import { useCallback, useEffect, useRef, useState } from "react";

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
 * Return type for useWebLocksApi hook
 */
type WebLocksApiHandler = {
  /**
   * Whether the Web Locks API is supported
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
   * Current error state (null if no error)
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
   * Release any currently held locks (via AbortController)
   */
  release: () => void;
  
  /**
   * Query the current lock state
   */
  query: () => Promise<any>;
};

/**
 * Validates that the resource name is a string
 */
function validateResourceName(resourceName: unknown): asserts resourceName is string {
  if (typeof resourceName !== "string") {
    throw new Error("Resource name must be a string");
  }
}

/**
 * Hook for managing Web Locks API functionality
 * 
 * @param resourceName - The name of the resource to manage locks for
 * @param options - Configuration options for the hook
 * @returns Handler object with lock management functions and state
 */
function useWebLocksApi(
  resourceName: string,
  options: UseWebLocksApiOptions = {}
): WebLocksApiHandler {
  // Validate resource name
  validateResourceName(resourceName);
  
  const { periodicCheck = false, checkInterval = 1000 } = options;
  
  // Check if Web Locks API is supported
  const isSupported = typeof navigator !== "undefined" && "locks" in navigator;
  
  // State management
  const [isLocked, setIsLocked] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const periodicCheckTimeoutRef = useRef<number | undefined>(undefined);
  
  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Set error state
   */
  const setErrorState = useCallback((err: Error) => {
    setError(err);
  }, []);
  
  /**
   * Query the current lock state
   */
  const query = useCallback(async () => {
    if (!isSupported) {
      const err = new Error("Web Locks API is not supported");
      setErrorState(err);
      throw err;
    }
    
    try {
      const result = await navigator.locks.query();
      
      // Update state based on query results
      const resourceLocks = result.held.filter(lock => lock.name === resourceName);
      const pendingLocks = result.pending.filter(lock => lock.name === resourceName);
      
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
  const acquire = useCallback(
    async <T>(callback: () => Promise<T> | T, lockOptions?: LockOptions): Promise<T> => {
      if (!isSupported) {
        const err = new Error("Web Locks API is not supported");
        setErrorState(err);
        throw err;
      }
      
      try {
        setIsLocked(true);
        clearError();
        
        const result = await navigator.locks.request(
          resourceName,
          lockOptions || {},
          async () => {
            try {
              return await callback();
            } catch (err) {
              throw err;
            }
          }
        );
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Lock acquisition failed");
        setErrorState(error);
        throw error;
      } finally {
        setIsLocked(false);
      }
    },
    [isSupported, resourceName, setErrorState, clearError]
  );
  
  /**
   * Release any currently held locks
   */
  const release = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  /**
   * Setup periodic checking if enabled
   */
  useEffect(() => {
    if (!periodicCheck || !isSupported) {
      return;
    }
    
    // Initial query
    query().catch(() => {
      // Error is already handled in query function
    });
    
    // Setup periodic checking
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
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (periodicCheckTimeoutRef.current) {
        window.clearTimeout(periodicCheckTimeoutRef.current);
        periodicCheckTimeoutRef.current = undefined;
      }
    };
  }, [periodicCheck, checkInterval, isSupported, query]);
  
  /**
   * Setup AbortController for lock release
   */
  useEffect(() => {
    if (!isSupported) {
      return;
    }
    
    abortControllerRef.current = new AbortController();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isSupported, resourceName]);
  
  /**
   * Initial query if not using periodic checks
   */
  useEffect(() => {
    if (!periodicCheck && isSupported) {
      query().catch(() => {
        // Error is already handled in query function
      });
    }
  }, [periodicCheck, isSupported, query]);
  
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