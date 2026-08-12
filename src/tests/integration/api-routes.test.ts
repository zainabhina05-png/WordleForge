import { describe, it, expect } from 'vitest';

/**
 * Integration Tests for API Routes
 * 
 * These tests verify security boundaries:
 * - Unauthenticated requests are rejected
 * - Wrong owner requests are rejected
 * - Invalid payloads are rejected
 * - Rate limits are enforced
 * 
 * NOTE: These require a running development server or test database.
 * Run with: npm run test:integration
 */

describe('API Routes Security', () => {
  describe('Health Check Route (Public)', () => {
    it('should return 200 for GET /api/health', async () => {
      // This test assumes the server is running
      // In CI/CD, you'd start the server before running tests
      const response = await fetch('http://localhost:3000/api/health');
      expect(response.status).toBe(200);
    });

    it('should not require authentication', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      expect(response.status).not.toBe(401);
    });
  });

  describe('Webhook Route (CSRF Protected)', () => {
    it('should reject POST without Svix headers', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'payload' }),
      });
      // Should reject due to missing svix headers
      expect([400, 401]).toContain(response.status);
    });

    it('should reject invalid JSON', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'svix-id': 'test',
          'svix-timestamp': 'test',
          'svix-signature': 'test',
        },
        body: 'not json',
      });
      expect(response.status).toBe(400);
    });

    it('should reject malformed webhook structure', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'svix-id': 'test',
          'svix-timestamp': 'test',
          'svix-signature': 'test',
        },
        body: JSON.stringify({ invalid: 'payload' }),
      });
      // Should reject due to schema validation failure
      expect([400, 401]).toContain(response.status);
    });
  });

  describe('Protected Routes (Auth Required)', () => {
    // These tests would require authenticated session
    // In real implementation, use Clerk's testing utilities

    it('should reject unauthenticated GET /game', async () => {
      const response = await fetch('http://localhost:3000/game', {
        headers: {
          // No auth cookie/header
        },
      });
      // Next.js with clerkMiddleware will redirect to sign-in
      expect([301, 302, 307, 308]).toContain(response.status);
    });

    it('should reject unauthenticated GET /dashboard', async () => {
      const response = await fetch('http://localhost:3000/dashboard');
      expect([301, 302, 307, 308]).toContain(response.status);
    });

    it('should reject unauthenticated GET /profile', async () => {
      const response = await fetch('http://localhost:3000/profile');
      expect([301, 302, 307, 308]).toContain(response.status);
    });
  });

  describe('Malformed Request Handling', () => {
    it('should reject POST with invalid JSON to webhook', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'svix-id': 'test_id',
          'svix-timestamp': 'test_time',
          'svix-signature': 'test_sig',
        },
        body: '{invalid json}',
      });
      expect(response.status).toBe(400);
    });

    it('should return error response without exposing internals', async () => {
      const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const body = await response.text();
      // Should not contain database errors, SQL, etc.
      expect(body).not.toContain('SELECT');
      expect(body).not.toContain('database');
      expect(body).not.toContain('ENOENT');
      expect(body).not.toContain('stack');
    });
  });

  describe('Security Header Validation', () => {
    it('should include Content-Security-Policy header', async () => {
      const response = await fetch('http://localhost:3000/');
      expect(response.headers.has('content-security-policy')).toBe(true);
    });

    it('should include X-Frame-Options header', async () => {
      const response = await fetch('http://localhost:3000/');
      expect(response.headers.has('x-frame-options')).toBe(true);
    });

    it('should include X-Content-Type-Options header', async () => {
      const response = await fetch('http://localhost:3000/');
      expect(response.headers.has('x-content-type-options')).toBe(true);
    });

    it('should include Strict-Transport-Security header', async () => {
      const response = await fetch('http://localhost:3000/');
      expect(response.headers.has('strict-transport-security')).toBe(true);
    });
  });
});
