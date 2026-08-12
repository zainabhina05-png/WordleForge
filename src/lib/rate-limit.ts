// Fallback rate limiting implementation for development
// This can be replaced with Upstash Redis in production

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// Simple in-memory rate limiting for development
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function createRateLimit(maxRequests: number, windowMs: number) {
  return {
    limit: (identifier: string): RateLimitResult => {
      const now = Date.now();
      const key = identifier;
      const existing = rateLimitStore.get(key);
      
      // Clean up expired entries
      if (existing && now > existing.resetTime) {
        rateLimitStore.delete(key);
      }
      
      const current = rateLimitStore.get(key);
      
      if (!current) {
        // First request in window
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return {
          success: true,
          remaining: maxRequests - 1,
          reset: now + windowMs
        };
      }
      
      if (current.count >= maxRequests) {
        // Rate limit exceeded
        return {
          success: false,
          remaining: 0,
          reset: current.resetTime
        };
      }
      
      // Increment count
      current.count++;
      rateLimitStore.set(key, current);
      
      return {
        success: true,
        remaining: maxRequests - current.count,
        reset: current.resetTime
      };
    }
  };
}

// Create different rate limiters for different actions
export const ratelimit = createRateLimit(10, 60 * 1000); // 10 requests per minute
export const gameRatelimit = createRateLimit(30, 60 * 1000); // 30 game actions per minute
export const authRatelimit = createRateLimit(5, 60 * 1000); // 5 auth attempts per minute
export const webhookRatelimit = createRateLimit(50, 60 * 1000); // 50 webhook calls per minute

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);