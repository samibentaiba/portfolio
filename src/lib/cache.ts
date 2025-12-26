/**
 * In-Memory TTL Cache for reducing database load on frequently accessed, rarely-changing data.
 *
 * Features:
 * - Configurable TTL per key
 * - Tag-based invalidation
 * - Automatic stale entry cleanup
 * - Type-safe wrapper functions
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  tags: string[];
}

// Cache TTL presets (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds - for rapidly changing data
  MEDIUM: 2 * 60 * 1000, // 2 minutes - dashboard stats
  STANDARD: 5 * 60 * 1000, // 5 minutes - reference data (UAP lists, dropdowns)
  LONG: 10 * 60 * 1000, // 10 minutes - static config (website settings)
  HOUR: 60 * 60 * 1000, // 1 hour - rarely changing data
} as const;

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  constructor() {
    // Auto-cleanup stale entries every 5 minutes (runs in background)
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Get cached value if exists and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache value with TTL
   */
  set<T>(key: string, data: T, ttlMs: number, tags: string[] = []): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      tags,
    });
  }

  /**
   * Delete specific cache key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries with a specific tag
   */
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton cache instance
export const cache = new MemoryCache();

/**
 * Cache wrapper function - fetches from cache or executes fetch function
 * @param key - Unique cache key
 * @param fetchFn - Function to fetch data if not cached
 * @param ttlMs - Time to live in milliseconds
 * @param tags - Optional tags for grouped invalidation
 */
export async function withCache<T>(key: string, fetchFn: () => Promise<T>, ttlMs: number = CACHE_TTL.STANDARD, tags: string[] = []): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  cache.set(key, data, ttlMs, tags);

  return data;
}

/**
 * Invalidate cache entries by tag
 * Call this when data changes to keep cache fresh
 */
export function invalidateCache(tag: string): void {
  cache.invalidateByTag(tag);
}

/**
 * Delete a specific cache key
 */
export function deleteCache(key: string): void {
  cache.delete(key);
}

// Cache keys for consistent key usage
export const CACHE_KEYS = {
  DASHBOARD_STATS: "dashboard:stats",
  UAP_LIST: "uap:list",
  WEBSITE_SETTINGS: "settings:website",
  SYSTEM_STATS: "admin:system-stats",
  // Dev API keys
  DEV_API_KEY: (keyHash: string) => `dev-api:key:${keyHash}`,
  DEV_API_STATS: "dev-api:stats",
  DEV_API_KEYS_LIST: "dev-api:keys:list",
} as const;

// Cache tags for grouped invalidation
export const CACHE_TAGS = {
  UAP: "uap",
  SETTINGS: "settings",
  FINANCE: "finance",
  ADMIN: "admin",
  DEV_API: "dev-api",
} as const;
