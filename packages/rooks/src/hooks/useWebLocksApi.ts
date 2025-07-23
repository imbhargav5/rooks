import { useCallback, useEffect, useRef, useState, useMemo } from "react";

/**
 * Web Locks API lock request options
 */
type LockOptions = {
  /**
   * The lock mode - "exclusive" (default) or "shared"
   */
  mode?: "exclusive" | "shared";

  /**
   * If true, the lock request will only succeed if the lock is available immediately
   */
  ifAvailable?: boolean;

  /**
   * If true, any held locks with the same name will be released first
   */
  steal?: boolean;

  /**
   * AbortSignal to cancel the lock request
   */
  signal?: AbortSignal;
};

/**
 * Hook configuration options
 */
type UseWebLocksApiOptions = {
  /**
   * Enable periodic checking of lock state (disabled by default)
   */
  periodicCheck?: boolean;

  /**
   * Interval in milliseconds for periodic checks (default: 1000ms)
   */
  checkInterval?: number;
};

/**
 * useWebLocksApi hook return type
 */
type UseWebLocksApiReturn = {
  /**
   * Whether Web Locks API is supported
   */
  isSupported: boolean;

  /**
   * Whether the resource is currently locked
   */
  isLocked: boolean;

  /**
   * Number of pending lock requests for this resource
   */
  waitingCount: number;

  /**
   * Current error state
   */
  error: Error | null;

  /**
   * The resource name being managed
   */
  resourceName: string;

  /**
   * Acquire a lock on the resource
   */
  acquire: <T>(callback: () => Promise<T> | T, options?: LockOptions) => Promise<T>;

  /**
   * Release the current lock
   */
  release: () => void;

  /**
   * Query the current lock state
   */
  query: () => Promise<any>;
};

/**
 * useWebLocksApi
 * @description Hook for coordinating operations across tabs/workers with Web Locks API
 * @see {@link https://rooks.vercel.app/docs/hooks/useWebLocksApi}
 */
function useWebLocksApi(
  resourceName: string,
  options: UseWebLocksApiOptions = {}
): UseWebLocksApiReturn {
  // Validate resource name
  if (typeof resourceName !== "string") {
    throw new Error("Resource name must be a string");
  }

  const { periodicCheck = false, checkInterval = 1000 } = options;

  // Check if Web Locks API is supported - check both existence and locks property
  const isSupported = useMemo(() => {
    return typeof navigator !== "undefined" &&
      navigator.locks !== undefined &&
      typeof navigator.locks.request === "function";
  }, []);

  // State management
  const [isLocked, setIsLocked] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const periodicCheckTimeoutRef = useRef<number | undefined>(undefined);

  // Helper functions for error management
  const setErrorState = useCallback((err: Error) => {
    setError(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Query the current lock state
   */
  const query = useCallback(async (): Promise<any> => {
    if (!isSupported) {
      const err = new Error("Web Locks API is not supported");
      setErrorState(err);
      throw err;
    }

    try {
      const result = await navigator.locks.query();

      // Update state based on query results with null checks
      const resourceLocks = result.held?.filter((lock: any) => lock.name === resourceName) || [];
      const pendingLocks = result.pending?.filter((lock: any) => lock.name === resourceName) || [];

      setIsLocked(resourceLocks.length > 0);
      setWaitingCount(pendingLocks.length);

      clearError();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Query failed");
      setErrorState(error);
      throw error;
    }
  }, [isSupported, resourceName, setErrorState, clearError]);

  /**
   * Acquire a lock on the resource
   */
  const acquire = useCallback(async <T>(
    callback: () => Promise<T> | T,
    lockOptions?: LockOptions
  ): Promise<T> => {
    if (!isSupported) {
      const err = new Error("Web Locks API is not supported");
      setErrorState(err);
      throw err;
    }

    try {
      // Set locked state immediately
      setIsLocked(true);
      clearError();

      // Create AbortController for this request only if signal is not provided and ifAvailable is not used
      let controller: AbortController | null = null;
      if (!lockOptions?.signal && !lockOptions?.ifAvailable) {
        controller = new AbortController();
        abortControllerRef.current = controller;
      }

      // Prepare lock options - avoid combining signal and ifAvailable
      const finalOptions: LockOptions = { ...lockOptions };
      
      // Only add signal if ifAvailable is not set and no custom signal provided
      if (!lockOptions?.ifAvailable && !lockOptions?.signal && controller) {
        finalOptions.signal = controller.signal;
      } else if (lockOptions?.signal) {
        // Use the provided signal
        finalOptions.signal = lockOptions.signal;
      }

      // Request the lock
      const result = await navigator.locks.request(
        resourceName,
        finalOptions,
        async () => {
          try {
            return await callback();
          } catch (err) {
            const error = err instanceof Error ? err : new Error("Callback failed");
            setErrorState(error);
            throw error;
          }
        }
      );

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Lock acquisition failed");
      setErrorState(error);
      throw error;
    } finally {
      // Clear locked state and abort controller
      setIsLocked(false);
      abortControllerRef.current = null;
    }
  }, [isSupported, resourceName, setErrorState, clearError]);

  /**
   * Release the current lock
   */
  const release = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Initial query and periodic checking setup
  useEffect(() => {
    if (!isSupported) return;

    // Initial query
    query().catch(() => {
      // Error is already handled in query function
    });

    // Setup periodic checking if enabled
    if (periodicCheck) {
      const setupPeriodicCheck = () => {
        periodicCheckTimeoutRef.current = window.setTimeout(() => {
          query()
            .catch(() => {
              // Error is already handled in query function
            })
            .finally(() => {
              // Schedule next check
              setupPeriodicCheck();
            });
        }, checkInterval);
      };

      setupPeriodicCheck();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (periodicCheckTimeoutRef.current) {
        window.clearTimeout(periodicCheckTimeoutRef.current);
        periodicCheckTimeoutRef.current = undefined;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isSupported, resourceName, periodicCheck, checkInterval, query]);

  return {
    isSupported,
    isLocked,
    waitingCount,
    error,
    resourceName,
    acquire,
    release,
    query,
  };
}

export { useWebLocksApi };
