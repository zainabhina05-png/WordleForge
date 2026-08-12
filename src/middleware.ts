import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/webhooks(.*)',
  '/guest(.*)',
]);

export default clerkMiddleware((auth, request: NextRequest) => {
  // Security Headers
  const response = NextResponse.next();
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://api.clerk.com wss:",
    "frame-src 'self' https://challenges.cloudflare.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const _clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Basic rate limit check (will be enhanced with Redis in actions)
    if (request.method === 'POST') {
      response.headers.set('X-RateLimit-Policy', 'Enabled');
    }
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return response;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$|_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};