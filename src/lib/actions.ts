import { revalidatePath } from "next/cache";
import { withDbQueue } from "@/lib/request-queue";

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface RunActionOptions {
  /** Custom error message to return if the action fails */
  errorMessage?: string;
  /** Path to revalidate upon success */
  revalidatePath?: string;
  /** Skip the database queue (for very fast operations) */
  skipQueue?: boolean;
  /** Timeout for queued operations (ms) */
  timeoutMs?: number;
  /** Priority in the queue (higher = processed first) */
  priority?: number;
}

/**
 * A generic wrapper for Server Actions to handle try/catch blocks,
 * error logging, revalidation, and database queue management consistently.
 *
 * This wrapper:
 * - Routes database operations through the request queue for load balancing
 * - Handles errors gracefully with custom error messages
 * - Supports revalidation of cached paths
 * - Provides timeout handling for long-running operations
 */
export async function runAction<T>(actionFn: () => Promise<T>, options: RunActionOptions = {}): Promise<ActionResponse<T>> {
  try {
    let data: T;

    // Use the database queue for load balancing (unless skipped)
    if (options.skipQueue) {
      data = await actionFn();
    } else {
      data = await withDbQueue(actionFn, {
        priority: options.priority,
        timeoutMs: options.timeoutMs,
      });
    }

    // Handle revalidation if a path is provided
    if (options.revalidatePath) {
      try {
        revalidatePath(options.revalidatePath);
      } catch {
        // revalidatePath may fail in test environment (no static generation store)
        // This is expected and shouldn't fail the action
      }
    }

    return { success: true, data };
  } catch (error) {
    // Log the error internally for debugging
    console.error(`Action failed [${options.errorMessage || "Unknown"}]:`, error);

    // Check for queue timeout errors
    if (error instanceof Error && error.message.includes("queue")) {
      return {
        success: false,
        error: "Server is busy. Please try again in a moment.",
      };
    }

    // Return a clean error object to the frontend
    return {
      success: false,
      error: options.errorMessage || "An unexpected error occurred.",
    };
  }
}

/**
 * Wrapper for read-only database operations (uses queue but with lower priority)
 * Used for SELECT queries that don't modify data
 */
export async function runReadAction<T>(actionFn: () => Promise<T>, options: Omit<RunActionOptions, "revalidatePath"> = {}): Promise<ActionResponse<T>> {
  return runAction(actionFn, {
    ...options,
    priority: options.priority ?? 0, // Lower priority for reads
  });
}

/**
 * Wrapper for write database operations (uses queue with higher priority)
 * Used for INSERT, UPDATE, DELETE queries
 */
export async function runWriteAction<T>(actionFn: () => Promise<T>, options: RunActionOptions = {}): Promise<ActionResponse<T>> {
  return runAction(actionFn, {
    ...options,
    priority: options.priority ?? 1, // Higher priority for writes
  });
}
