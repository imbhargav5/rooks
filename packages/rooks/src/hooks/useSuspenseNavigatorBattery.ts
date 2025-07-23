/**
 * useSuspenseNavigatorBattery
 * @description Suspense-enabled hook for getting battery information from Navigator Battery API
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorBattery}
 * 
 * ⚠️ WARNING: Limited Browser Support
 * - Firefox: Removed in v52+ (2017) due to privacy concerns
 * - Safari: Never implemented
 * - Chrome/Edge: Requires HTTPS (secure context)
 * - This API may not work in most environments
 */

// Minimal type augmentation for the deprecated Battery API
// We don't define full types since this API is not standard and has limited support
declare global {
  interface Navigator {
    getBattery?(): Promise<{
      charging: boolean;
      chargingTime: number;
      dischargingTime: number;
      level: number;
      addEventListener: (type: string, listener: EventListener) => void;
      removeEventListener: (type: string, listener: EventListener) => void;
    }>;
  }
}

// Cache entry interface
interface CacheEntry {
  promise: Promise<any>;
  status: 'pending' | 'resolved' | 'rejected';
  result?: any;
  error?: Error;
}

// Simple cache to store the battery promise
const cache = new Map<string, CacheEntry>();
const CACHE_KEY = 'navigator-battery';

/**
 * Clear the battery cache - useful for testing
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get battery information using Suspense pattern
 * 
 * ⚠️ WARNING: This API has very limited browser support:
 * - Firefox: Removed in v52+ due to privacy concerns  
 * - Safari: Never implemented
 * - Chrome/Edge: Requires HTTPS (secure context)
 * 
 * @throws {Error} When Battery API is not supported
 * @throws {Promise} When battery data is loading (Suspense)
 * @returns Battery manager object with charging status and level information
 */
export function useSuspenseNavigatorBattery() {
  // Check if we have a cached entry
  const cachedEntry = cache.get(CACHE_KEY);
  
  if (cachedEntry) {
    if (cachedEntry.status === 'resolved') {
      return cachedEntry.result;
    } else if (cachedEntry.status === 'rejected') {
      throw cachedEntry.error;
    } else {
      // Still pending, throw the promise to suspend
      throw cachedEntry.promise;
    }
  }

  // Check if Battery API is available
  if (!navigator.getBattery) {
    const error = new Error(
      'Battery API is not supported in this browser. ' +
      'This API was removed from Firefox (v52+) due to privacy concerns, ' +
      'never implemented in Safari, and requires HTTPS in Chrome/Edge.'
    );
    
    const rejectedEntry: CacheEntry = {
      promise: Promise.reject(error),
      status: 'rejected',
      error
    };
    
    cache.set(CACHE_KEY, rejectedEntry);
    throw error;
  }

  // Create the promise to get battery information
  const promise = navigator.getBattery()
    .then((battery) => {
      // Update cache with resolved value
      const resolvedEntry: CacheEntry = {
        promise,
        status: 'resolved',
        result: battery
      };
      cache.set(CACHE_KEY, resolvedEntry);
      return battery;
    })
    .catch((error) => {
      // Update cache with error
      const rejectedEntry: CacheEntry = {
        promise,
        status: 'rejected',
        error: error instanceof Error ? error : new Error(String(error))
      };
      cache.set(CACHE_KEY, rejectedEntry);
      throw error;
    });

  // Cache the pending promise
  const pendingEntry: CacheEntry = {
    promise,
    status: 'pending'
  };
  cache.set(CACHE_KEY, pendingEntry);

  // Throw the promise to suspend
  throw promise;
}
