/**
 * Request Queue Module
 *
 * Provides load balancing for database operations by limiting
 * concurrent operations and queuing excess requests.
 *
 * Features:
 * - Configurable concurrent operation limits
 * - Request timeout handling
 * - Priority queue support
 * - Backpressure to prevent cascading failures
 */

// ============================================================
// TYPES
// ============================================================

interface QueuedRequest<T> {
  id: string;
  priority: number;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
  createdAt: number;
}

interface QueueConfig {
  maxConcurrent: number; // Maximum concurrent operations
  maxQueueSize: number; // Maximum queue size
  defaultTimeoutMs: number; // Default timeout for queued requests
}

interface QueueStats {
  pending: number;
  active: number;
  completed: number;
  failed: number;
  timedOut: number;
}

// ============================================================
// QUEUE CONFIGURATION
// ============================================================

const DEFAULT_CONFIG: QueueConfig = {
  maxConcurrent: 10, // 10 concurrent DB operations
  maxQueueSize: 100, // Queue up to 100 pending requests
  defaultTimeoutMs: 30000, // 30 second timeout
};

// ============================================================
// REQUEST QUEUE CLASS
// ============================================================

class RequestQueue {
  private config: QueueConfig;
  private queue: QueuedRequest<unknown>[] = [];
  private activeCount = 0;
  private stats: QueueStats = {
    pending: 0,
    active: 0,
    completed: 0,
    failed: 0,
    timedOut: 0,
  };

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate unique request ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute a function with queue management
   *
   * @param fn - Async function to execute
   * @param options - Optional configuration (priority, timeout)
   */
  public async execute<T>(fn: () => Promise<T>, options: { priority?: number; timeoutMs?: number } = {}): Promise<T> {
    const { priority = 0, timeoutMs = this.config.defaultTimeoutMs } = options;

    // If under limit, execute immediately
    if (this.activeCount < this.config.maxConcurrent) {
      return this.executeNow(fn);
    }

    // Check queue capacity
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new Error("Server is busy. Please try again later.");
    }

    // Add to queue
    return this.addToQueue(fn, priority, timeoutMs);
  }

  /**
   * Execute function immediately
   */
  private async executeNow<T>(fn: () => Promise<T>): Promise<T> {
    this.activeCount++;
    this.stats.active++;

    try {
      const result = await fn();
      this.stats.completed++;
      return result;
    } catch (error) {
      this.stats.failed++;
      throw error;
    } finally {
      this.activeCount--;
      this.stats.active--;
      this.processQueue();
    }
  }

  /**
   * Add request to queue
   */
  private addToQueue<T>(fn: () => Promise<T>, priority: number, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = this.generateId();

      const timeout = setTimeout(() => {
        // Remove from queue on timeout
        const index = this.queue.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.queue.splice(index, 1);
          this.stats.pending--;
          this.stats.timedOut++;
          reject(new Error("Request timed out in queue"));
        }
      }, timeoutMs);

      const request: QueuedRequest<T> = {
        id,
        priority,
        execute: fn,
        resolve: resolve as (value: unknown) => void,
        reject,
        timeout,
        createdAt: Date.now(),
      };

      // Insert by priority (higher priority first)
      const insertIndex = this.queue.findIndex((r) => r.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(request as QueuedRequest<unknown>);
      } else {
        this.queue.splice(insertIndex, 0, request as QueuedRequest<unknown>);
      }

      this.stats.pending++;
    });
  }

  /**
   * Process next item in queue
   */
  private processQueue(): void {
    if (this.queue.length === 0 || this.activeCount >= this.config.maxConcurrent) {
      return;
    }

    const request = this.queue.shift();
    if (!request) return;

    clearTimeout(request.timeout);
    this.stats.pending--;

    this.executeNow(request.execute).then(request.resolve).catch(request.reject);
  }

  /**
   * Get current queue statistics
   */
  public getStats(): QueueStats & { queueLength: number; utilizationPercent: number } {
    return {
      ...this.stats,
      queueLength: this.queue.length,
      utilizationPercent: Math.round((this.activeCount / this.config.maxConcurrent) * 100),
    };
  }

  /**
   * Check if queue is healthy
   */
  public isHealthy(): boolean {
    return this.queue.length < this.config.maxQueueSize * 0.8;
  }

  /**
   * Clear all pending requests (emergency use)
   */
  public clearQueue(): void {
    for (const request of this.queue) {
      clearTimeout(request.timeout);
      request.reject(new Error("Queue cleared"));
    }
    this.queue = [];
    this.stats.pending = 0;
  }
}

// ============================================================
// SINGLETON INSTANCES
// ============================================================

// Database operations queue (stricter limits)
export const dbQueue = new RequestQueue({
  maxConcurrent: 10,
  maxQueueSize: 100,
  defaultTimeoutMs: 30000,
});

// API operations queue (more permissive)
export const apiQueue = new RequestQueue({
  maxConcurrent: 50,
  maxQueueSize: 500,
  defaultTimeoutMs: 60000,
});

// Email operations queue (very limited)
export const emailQueue = new RequestQueue({
  maxConcurrent: 3,
  maxQueueSize: 50,
  defaultTimeoutMs: 120000,
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Wrap a database operation with queue management
 */
export async function withDbQueue<T>(operation: () => Promise<T>, options?: { priority?: number; timeoutMs?: number }): Promise<T> {
  return dbQueue.execute(operation, options);
}

/**
 * Wrap an API operation with queue management
 */
export async function withApiQueue<T>(operation: () => Promise<T>, options?: { priority?: number; timeoutMs?: number }): Promise<T> {
  return apiQueue.execute(operation, options);
}

/**
 * Wrap an email operation with queue management
 */
export async function withEmailQueue<T>(operation: () => Promise<T>, options?: { priority?: number; timeoutMs?: number }): Promise<T> {
  return emailQueue.execute(operation, options);
}

/**
 * Get combined queue health status
 */
export function getQueueHealth(): {
  overall: "healthy" | "degraded" | "critical";
  queues: Record<string, { healthy: boolean; stats: ReturnType<RequestQueue["getStats"]> }>;
} {
  const dbStats = { healthy: dbQueue.isHealthy(), stats: dbQueue.getStats() };
  const apiStats = { healthy: apiQueue.isHealthy(), stats: apiQueue.getStats() };
  const emailStats = { healthy: emailQueue.isHealthy(), stats: emailQueue.getStats() };

  const healthyCount = [dbStats, apiStats, emailStats].filter((s) => s.healthy).length;

  return {
    overall: healthyCount === 3 ? "healthy" : healthyCount >= 2 ? "degraded" : "critical",
    queues: {
      database: dbStats,
      api: apiStats,
      email: emailStats,
    },
  };
}
