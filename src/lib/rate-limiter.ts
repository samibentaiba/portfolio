/**
 * Rate Limiter Module
 *
 * Provides flexible rate limiting using the Token Bucket algorithm.
 * Features:
 * - In-memory store with automatic cleanup (no Redis dependency)
 * - Configurable per-endpoint limits
 * - IP-based tracking
 * - Rate limit headers for responses
 * - Automatic client cleanup to prevent memory leaks
 */

import { NextRequest } from "next/server";

// ============================================================
// TYPES
// ============================================================

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed in the window
  windowMs: number; // Time window in milliseconds
  blockDurationMs?: number; // How long to block after limit exceeded (optional)
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
  headers: Record<string, string>;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  blocked?: number; // Timestamp when block expires (if blocked)
}

// ============================================================
// RATE LIMIT CONFIGURATIONS
// ============================================================

/**
 * Predefined rate limit configurations for different endpoint types.
 * Adjust these values based on your traffic patterns.
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - strict limits to prevent brute force
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
    blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after exceeding
  },

  // Password reset - very strict to prevent email spam
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 3 requests per hour
    blockDurationMs: 60 * 60 * 1000, // Block for 1 hour
  },

  // Login attempts - separate from registration
  login: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 10 attempts per 15 minutes
    blockDurationMs: 15 * 60 * 1000, // Block for 15 minutes
  },

  // Admin endpoints - higher limits for authenticated admins
  admin: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },

  // General API endpoints
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 requests per minute
  },

  // Database-heavy operations
  database: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 200 operations per minute
  },

  // File uploads
  upload: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 uploads per minute
  },

  // Email sending endpoints
  email: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 emails per minute
  },

  // Development API - per-key rate limit (default)
  devApi: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 requests per minute
  },

  // Dev API key management - strict for admin operations
  devApiAdmin: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
    blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes
  },
};

// ============================================================
// RATE LIMITER CLASS
// ============================================================

class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start cleanup interval to prevent memory leaks
    // Runs every 5 minutes to remove stale entries
    this.startCleanup();
  }

  /**
   * Start automatic cleanup of stale rate limit entries
   */
  private startCleanup(): void {
    if (typeof window === "undefined" && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        const maxAge = 2 * 60 * 60 * 1000; // 2 hours

        for (const [key, bucket] of this.buckets.entries()) {
          if (now - bucket.lastRefill > maxAge) {
            this.buckets.delete(key);
          }
        }
      }, 5 * 60 * 1000); // Every 5 minutes
    }
  }

  /**
   * Extract client IP from request
   */
  private getClientIP(request: NextRequest): string {
    // Check various headers for real IP (behind proxies/load balancers)
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
      return realIP;
    }

    const cfConnectingIP = request.headers.get("cf-connecting-ip");
    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    // Fallback to a generic identifier
    return "unknown";
  }

  /**
   * Generate rate limit key from request and limit type
   */
  private generateKey(request: NextRequest, limitType: string): string {
    const ip = this.getClientIP(request);
    const path = request.nextUrl.pathname;
    return `${limitType}:${ip}:${path}`;
  }

  /**
   * Check rate limit by custom key (for authenticated users)
   */
  public checkByKey(key: string, limitType: keyof typeof RATE_LIMITS): RateLimitResult {
    const config = RATE_LIMITS[limitType];
    if (!config) {
      console.warn(`Unknown rate limit type: ${limitType}, using default 'api'`);
      return this.applyLimit(`api:${key}`, RATE_LIMITS.api);
    }
    return this.applyLimit(`${limitType}:${key}`, config);
  }

  /**
   * Check rate limit for a request
   */
  public check(request: NextRequest, limitType: keyof typeof RATE_LIMITS): RateLimitResult {
    const config = RATE_LIMITS[limitType];
    if (!config) {
      console.warn(`Unknown rate limit type: ${limitType}, using default 'api'`);
      return this.applyLimit(this.generateKey(request, "api"), RATE_LIMITS.api);
    }
    return this.applyLimit(this.generateKey(request, limitType), config);
  }

  /**
   * Apply rate limiting using Token Bucket algorithm
   */
  private applyLimit(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    // Check if currently blocked
    if (bucket?.blocked && bucket.blocked > now) {
      const resetTime = Math.ceil(bucket.blocked / 1000);
      return {
        success: false,
        remaining: 0,
        reset: resetTime,
        headers: this.createHeaders(0, config.maxRequests, resetTime),
      };
    }

    // Initialize or refill bucket
    if (!bucket) {
      bucket = {
        tokens: config.maxRequests,
        lastRefill: now,
      };
    } else {
      // Calculate token refill based on time elapsed
      const elapsed = now - bucket.lastRefill;
      const refillRate = config.maxRequests / config.windowMs;
      const tokensToAdd = elapsed * refillRate;

      bucket.tokens = Math.min(config.maxRequests, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
      bucket.blocked = undefined; // Clear any expired block
    }

    // Check if request can be allowed
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.buckets.set(key, bucket);

      const resetTime = Math.ceil((now + config.windowMs) / 1000);
      return {
        success: true,
        remaining: Math.floor(bucket.tokens),
        reset: resetTime,
        headers: this.createHeaders(Math.floor(bucket.tokens), config.maxRequests, resetTime),
      };
    }

    // Rate limit exceeded - apply block if configured
    if (config.blockDurationMs) {
      bucket.blocked = now + config.blockDurationMs;
    }
    this.buckets.set(key, bucket);

    const resetTime = Math.ceil((bucket.blocked || now + config.windowMs) / 1000);
    return {
      success: false,
      remaining: 0,
      reset: resetTime,
      headers: this.createHeaders(0, config.maxRequests, resetTime),
    };
  }

  /**
   * Create rate limit headers for response
   */
  private createHeaders(remaining: number, limit: number, reset: number): Record<string, string> {
    return {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(reset),
      "Retry-After": remaining === 0 ? String(Math.max(0, reset - Math.floor(Date.now() / 1000))) : "0",
    };
  }

  /**
   * Reset rate limit for a key (useful for admin actions)
   */
  public reset(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Get current stats for monitoring
   */
  public getStats(): { totalBuckets: number; blockedCount: number } {
    const now = Date.now();
    let blockedCount = 0;

    for (const bucket of this.buckets.values()) {
      if (bucket.blocked && bucket.blocked > now) {
        blockedCount++;
      }
    }

    return {
      totalBuckets: this.buckets.size,
      blockedCount,
    };
  }
}

// ============================================================
// SINGLETON EXPORT
// ============================================================

// Create singleton instance
export const rateLimiter = new RateLimiter();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Convenience function to create a rate-limited API handler
 */
export function withRateLimit(handler: (request: NextRequest) => Promise<Response>, limitType: keyof typeof RATE_LIMITS = "api") {
  return async (request: NextRequest): Promise<Response> => {
    const result = rateLimiter.check(request, limitType);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: result.headers["Retry-After"],
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...result.headers,
          },
        },
      );
    }

    // Execute the handler and add rate limit headers to response
    const response = await handler(request);

    // Clone response to add headers
    const newHeaders = new Headers(response.headers);
    Object.entries(result.headers).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}
