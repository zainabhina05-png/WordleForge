import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { ratelimit } from '@/lib/rate-limit';
import { authLogger, rateLimitLogger } from '@/lib/logger';

// Fallback sanitization without DOMPurify for development
function sanitizeInputFallback(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // Basic HTML escaping and cleanup
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/&/g, '&amp;');
}

export class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export async function validateAuth() {
  const { userId } = await auth();
  if (!userId) {
    const clientIP = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    authLogger.authFailure('Missing userId from Clerk auth', clientIP);
    throw new SecurityError('Unauthorized', 'UNAUTHORIZED');
  }
  return userId;
}

export async function validateRateLimit(identifier: string, limit = 10) {
  const { success, remaining, reset } = ratelimit.limit(identifier);

  if (!success) {
    const clientIPHeader = (await import('next/headers')).headers().get('x-forwarded-for') || 'unknown';
    rateLimitLogger.rateLimitHit(identifier, limit, clientIPHeader);
    throw new SecurityError(
      `Rate limit exceeded. Try again in ${Math.round((reset - Date.now()) / 1000)} seconds`,
      'RATE_LIMITED'
    );
  }

  return { remaining, reset };
}

export function sanitizeInput(input: string): string {
  return sanitizeInputFallback(input);
}

export function validateGameOwnership(game: { userId?: string } | null, userId: string): void {
  if (!game || game.userId !== userId) {
    throw new SecurityError('Access denied: Game not found or not owned by user', 'ACCESS_DENIED');
  }
}

export async function validateCSRF() {
  const headersList = headers();
  const origin = headersList.get('origin');
  const _clientIP = headersList.get('x-forwarded-for') || 'unknown';

  // In production on Vercel, origin should be your app URL
  // Skip CSRF check if we can't determine the origin (Vercel sometimes doesn't send it)
  if (!origin) {
    if (process.env.NODE_ENV === 'production') {
      return; // Allow in production if no origin header (Vercel quirk)
    }
    if (process.env.NODE_ENV === 'development') {
      return; // Allow in development if no origin header
    }
  }

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001',
  ].filter(Boolean);

  if (!origin) {
    authLogger.csrfViolation(origin, _clientIP);
    throw new SecurityError('Invalid origin', 'CSRF_VIOLATION');
  }

  // Check if origin matches any allowed origin
  const isAllowed = allowedOrigins.some((allowed) => {
    if (!allowed) return false;
    // Exact match or subdomain match
    return origin === allowed || origin.endsWith('.' + allowed);
  });

  if (!isAllowed) {
    authLogger.csrfViolation(origin, _clientIP);
    throw new SecurityError('Invalid origin', 'CSRF_VIOLATION');
  }
}

export function validateWordInput(word: string, minLength = 4, maxLength = 8): string {
  const sanitized = sanitizeInput(word);
  
  if (!sanitized) {
    throw new SecurityError('Word cannot be empty', 'INVALID_INPUT');
  }
  
  if (sanitized.length < minLength || sanitized.length > maxLength) {
    throw new SecurityError(
      `Word must be between ${minLength} and ${maxLength} characters`,
      'INVALID_LENGTH'
    );
  }
  
  if (!/^[A-Za-z]+$/.test(sanitized)) {
    throw new SecurityError('Word must contain only letters', 'INVALID_CHARACTERS');
  }
  
  return sanitized.toUpperCase();
}

export function validateGameId(gameId: string): string {
  const sanitized = sanitizeInput(gameId);

  // CUID validation pattern
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!/^c[a-z0-9]{24}$/i.test(sanitized)) {
    throw new SecurityError('Invalid game ID format', 'INVALID_GAME_ID');
  }

  return sanitized;
}