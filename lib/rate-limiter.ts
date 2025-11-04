/**
 * Simple in-memory rate limiter for payment endpoints
 * Production use: Consider Redis-based limiter like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;

  /**
   * Time window in milliseconds
   */
  window: number;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean;

  /**
   * Current request count in this window
   */
  count: number;

  /**
   * Maximum allowed requests
   */
  limit: number;

  /**
   * When the rate limit resets (timestamp)
   */
  resetTime: number;

  /**
   * Remaining requests in this window
   */
  remaining: number;
}

/**
 * Rate limit a request by IP address
 *
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;

  const entry = rateLimitStore.get(key);

  // No entry or expired - create new
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.window,
    };
    rateLimitStore.set(key, newEntry);

    return {
      success: true,
      count: 1,
      limit: config.limit,
      resetTime: newEntry.resetTime,
      remaining: config.limit - 1,
    };
  }

  // Increment count
  entry.count++;

  const success = entry.count <= config.limit;

  return {
    success,
    count: entry.count,
    limit: config.limit,
    resetTime: entry.resetTime,
    remaining: Math.max(0, config.limit - entry.count),
  };
}

/**
 * Get client IP address from request headers
 *
 * @param request - Next.js request object
 * @returns IP address
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can be a comma-separated list
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

/**
 * Preset rate limit configurations for different endpoints
 */
export const RateLimitPresets = {
  /**
   * Payment creation: 10 requests per 15 minutes
   * Prevents spam order creation
   */
  PAYMENT_CREATE: {
    limit: 10,
    window: 15 * 60 * 1000, // 15 minutes
  },

  /**
   * Payment verification: 20 requests per 10 minutes
   * Allows some retry but prevents abuse
   */
  PAYMENT_VERIFY: {
    limit: 20,
    window: 10 * 60 * 1000, // 10 minutes
  },

  /**
   * Webhook: 100 requests per 5 minutes
   * Higher limit as legitimate webhooks may come in bursts
   */
  WEBHOOK: {
    limit: 100,
    window: 5 * 60 * 1000, // 5 minutes
  },

  /**
   * Subscription check: 60 requests per minute
   * Used frequently by UI, needs higher limit
   */
  SUBSCRIPTION_CHECK: {
    limit: 60,
    window: 60 * 1000, // 1 minute
  },
} as const;
