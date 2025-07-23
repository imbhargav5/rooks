/**
 * useSuspenseNavigatorBattery
 * @description Suspense-enabled hook for getting battery information from Navigator Battery API
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorBattery}
 */

// Type definitions for BatteryManager based on the spec
interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
}

// Extend Navigator interface to include getBattery
declare global {
  interface Navigator {
    getBattery?(): Promise<BatteryManager>;
  }
}

// Cache entry interface
interface CacheEntry {
  promise: Promise<BatteryManager>;
  status: 'pending' | 'resolved' | 'rejected';
  result?: BatteryManager;
  error?: Error;
}

// Cache for storing promises and their results
const cache = new Map<string, CacheEntry>();

// Cache key for battery (since there are no parameters, we use a constant key)
const BATTERY_CACHE_KEY = "battery";

/**
 * Clear all cached entries - useful for testing
 * @internal
 */
export function clearCache() {
  cache.clear();
}

/**
 * Suspense-enabled hook for getting battery information from Navigator Battery API
 * 
 * This hook will suspend (throw a promise) while the Navigator Battery API
 * is fetching battery information. It should be wrapped in a Suspense boundary.
 * 
 * @returns The BatteryManager object with battery status information
 * 
 * @throws {Error} When Navigator Battery API is not supported
 * @throws {Promise} When data is still loading (for Suspense)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const battery = useSuspenseNavigatorBattery();
 *   
 *   return (
 *     <div>
 *       <div>Charging: {battery.charging ? 'Yes' : 'No'}</div>
 *       <div>Level: {Math.round(battery.level * 100)}%</div>
 *       <div>
 *         {battery.charging 
 *           ? `Time to full charge: ${battery.chargingTime}s`
 *           : `Time remaining: ${battery.dischargingTime}s`
 *         }
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading battery info...</div>}>
 *       <MyComponent />
 *     </Suspense>
 *   );
 * }
 * ```
 */
function useSuspenseNavigatorBattery(): BatteryManager {
  // Check if Navigator Battery API is supported
  if (typeof navigator === "undefined" || !navigator.getBattery) {
    throw new Error(
      "Navigator Battery API is not supported in this browser. " +
      "This API requires a secure context (HTTPS) and is not available in all browsers."
    );
  }

  // Check if we already have a cache entry
  let entry = cache.get(BATTERY_CACHE_KEY);
  
  if (!entry) {
    // Create new cache entry with promise
    const promise = navigator.getBattery();
    
    entry = {
      promise,
      status: 'pending'
    };
    
    cache.set(BATTERY_CACHE_KEY, entry);
    
    // Handle promise resolution/rejection
    promise
      .then((result) => {
        entry!.status = 'resolved';
        entry!.result = result;
      })
      .catch((error) => {
        entry!.status = 'rejected';
        entry!.error = error instanceof Error ? error : new Error(String(error));
      });
  }
  
  // Handle different cache entry states
  if (entry.status === 'pending') {
    // Suspend by throwing the promise
    throw entry.promise;
  }
  
  if (entry.status === 'rejected') {
    // Re-throw the error to be caught by error boundary
    throw entry.error;
  }
  
  // Return the resolved result
  return entry.result!;
}

export { useSuspenseNavigatorBattery };