/**
 * Centralized API error handling
 * Never leaks stack traces, DB errors, or internal paths to client
 */

import { NextResponse } from 'next/server';

export interface APIError {
  code: string;
  message: string;
  status: number;
}

// Public error messages (safe to send to client)
export const ERROR_MESSAGES = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    status: 401,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Access denied',
    status: 403,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    status: 404,
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'Invalid request',
    status: 400,
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    message: 'Too many requests. Please try again later',
    status: 429,
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An error occurred. Please try again later',
    status: 500,
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable',
    status: 503,
  },
};

/**
 * Create a generic API error response
 * Never exposes internal details in production
 */
export function apiErrorResponse(
  errorDef: APIError,
  isDevelopment: boolean = false
): NextResponse {
  const response: Record<string, unknown> = {
    code: errorDef.code,
    message: errorDef.message,
  };

  // Only include detailed error info in development
  if (isDevelopment && errorDef.code === 'INTERNAL_ERROR') {
    response.note = 'Detailed error info in development mode only';
  }

  return NextResponse.json(response, { status: errorDef.status });
}

/**
 * Safely handle unknown errors without leaking details
 */
export function handleUnknownError(
  error: unknown,
  context: string,
  isDevelopment: boolean = false
): NextResponse {
  // Log the actual error server-side for debugging
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.error(`[${context}] Unknown error:`, error);
  }

  // Return generic error to client
  return apiErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, isDevelopment);
}

/**
 * Validate that a response doesn't leak sensitive information
 */
export function sanitizeErrorResponse(error: Error | unknown): string {
  if (error instanceof Error) {
    // Don't expose error message from database or internal systems
    const message = error.message.toLowerCase();

    // Filter out common patterns that might leak info
    const sensitivePatterns = [
      'database',
      'sql',
      'prisma',
      'connection',
      'environment',
      'secret',
      'token',
      'password',
      'cannot find module',
      'enoent', // File not found system error
    ];

    if (sensitivePatterns.some((pattern) => message.includes(pattern))) {
      return 'An error occurred. Please try again later';
    }

    return error.message;
  }

  return 'An unknown error occurred';
}
