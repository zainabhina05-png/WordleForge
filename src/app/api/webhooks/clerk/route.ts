import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { webhookRatelimit } from '@/lib/rate-limit';
import { webhookSchema } from '@/lib/validations';
import { SecurityError } from '@/lib/security';
import { webhookLogger, dbLogger } from '@/lib/logger';
import { apiErrorResponse, ERROR_MESSAGES } from '@/lib/api-errors';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function POST(req: Request) {
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Rate limiting for webhooks
    const { success } = await webhookRatelimit.limit(clientIP);

    if (!success) {
      webhookLogger.rateLimitHit('webhook', 50, clientIP);
      return apiErrorResponse(ERROR_MESSAGES.RATE_LIMITED, isDevelopment);
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      webhookLogger.error('MISSING_WEBHOOK_SECRET', { ipAddress: clientIP });
      return apiErrorResponse(ERROR_MESSAGES.SERVICE_UNAVAILABLE, isDevelopment);
    }

    const headerPayload = headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      webhookLogger.warn('MISSING_SVIX_HEADERS', {
        details: { svixId: !!svixId, svixTimestamp: !!svixTimestamp, svixSignature: !!svixSignature },
        ipAddress: clientIP,
      });
      return apiErrorResponse(ERROR_MESSAGES.BAD_REQUEST, isDevelopment);
    }

    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      webhookLogger.warn('INVALID_JSON_PAYLOAD', {
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        ipAddress: clientIP,
      });
      return apiErrorResponse(ERROR_MESSAGES.BAD_REQUEST, isDevelopment);
    }

    // Validate webhook payload structure
    const validationResult = webhookSchema.safeParse(payload);
    if (!validationResult.success) {
      webhookLogger.warn('INVALID_PAYLOAD_STRUCTURE', {
        details: { errors: validationResult.error.errors.length },
        ipAddress: clientIP,
      });
      return apiErrorResponse(ERROR_MESSAGES.BAD_REQUEST, isDevelopment);
    }

    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      webhookLogger.webhookVerificationFailed(err instanceof Error ? err.message : 'Unknown error', clientIP);
      return apiErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, isDevelopment);
    }

    const eventType = evt.type;

    // Process webhook events with proper error handling and logging
    try {
      if (eventType === 'user.created') {
        await handleUserCreated(evt);
        webhookLogger.info('USER_CREATED', {
          userId: (evt.data as { id: string }).id,
          ipAddress: clientIP,
        });
      } else if (eventType === 'user.updated') {
        await handleUserUpdated(evt);
        webhookLogger.info('USER_UPDATED', {
          userId: (evt.data as { id: string }).id,
          ipAddress: clientIP,
        });
      } else if (eventType === 'user.deleted') {
        await handleUserDeleted(evt);
        webhookLogger.info('USER_DELETED', {
          userId: (evt.data as { id: string }).id,
          ipAddress: clientIP,
        });
      } else {
        webhookLogger.debug('UNHANDLED_EVENT_TYPE', {
          details: { eventType },
          ipAddress: clientIP,
        });
      }
    } catch (error) {
      webhookLogger.error('WEBHOOK_PROCESSING_FAILED', {
        details: {
          eventType,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
        ipAddress: clientIP,
      });
      return apiErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, isDevelopment);
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    webhookLogger.error('WEBHOOK_HANDLER_CRASH', {
      details: { errorMessage: error instanceof Error ? error.message : 'Unknown error' },
    });
    return apiErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, isDevelopment);
  }
}

async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== 'user.created') return;

  const userData = evt.data as {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    username?: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
  const { id, email_addresses, username, first_name, last_name, image_url } = userData;

  if (!id) {
    throw new SecurityError('Missing user ID in webhook data', 'INVALID_WEBHOOK_DATA');
  }

  const email = email_addresses?.[0]?.email_address;
  if (!email) {
    throw new SecurityError('Missing email address in webhook data', 'INVALID_WEBHOOK_DATA');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new SecurityError('Invalid email format', 'INVALID_EMAIL');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: id },
    select: { id: true },
  });

  if (existingUser) {
    webhookLogger.info('USER_ALREADY_EXISTS', { userId: id });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        email,
        username: username || undefined,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
        imageUrl: image_url || undefined,
      },
    });

    // Create related records with error handling
    await Promise.all([
      prisma.profile.create({
        data: { userId: user.id },
      }),
      prisma.statistics.create({
        data: { userId: user.id },
      }),
      prisma.userSettings.create({
        data: { userId: user.id },
      }),
    ]);
  } catch (error) {
    dbLogger.dbError('user_creation', error);
    throw error;
  }
}

async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== 'user.updated') return;

  const userData = evt.data as {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    username?: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
  const { id, email_addresses, username, first_name, last_name, image_url } = userData;

  if (!id) {
    throw new SecurityError('Missing user ID in webhook data', 'INVALID_WEBHOOK_DATA');
  }

  const email = email_addresses?.[0]?.email_address;
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new SecurityError('Invalid email format', 'INVALID_EMAIL');
    }
  }

  const updateData: Record<string, unknown> = {};
  if (email) updateData.email = email;
  if (username !== undefined) updateData.username = username || null;
  if (first_name !== undefined) updateData.firstName = first_name || null;
  if (last_name !== undefined) updateData.lastName = last_name || null;
  if (image_url !== undefined) updateData.imageUrl = image_url || null;

  try {
    await prisma.user.update({
      where: { clerkId: id },
      data: updateData,
    });
  } catch (error) {
    dbLogger.dbError('user_update', error);
    throw error;
  }
}

async function handleUserDeleted(evt: WebhookEvent) {
  const userData = evt.data as { id: string };
  const { id } = userData;

  if (!id || typeof id !== 'string') {
    throw new SecurityError('Missing or invalid user ID in webhook data', 'INVALID_WEBHOOK_DATA');
  }

  // Soft delete user by anonymizing data instead of hard delete for data integrity
  try {
    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: `deleted_${Date.now()}@example.com`,
        username: null,
        firstName: null,
        lastName: null,
        imageUrl: null,
        // Note: deletedAt field would need to be added to Prisma schema
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    dbLogger.dbError('user_soft_delete', error);
    throw error;
  }
}