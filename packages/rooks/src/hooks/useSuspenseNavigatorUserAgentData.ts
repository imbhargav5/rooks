/**
 * useSuspenseNavigatorUserAgentData
 * @description Suspense-enabled hook for getting high entropy values from Navigator User Agent Data API
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseNavigatorUserAgentData}
 */

// Type definitions for NavigatorUAData based on the spec
interface UADataValues {
  brands?: Array<{ brand: string; version: string }>;
  mobile?: boolean;
  platform?: string;
  architecture?: string;
  bitness?: string;
  formFactors?: string[];
  fullVersionList?: Array<{ brand: string; version: string }>;
  model?: string;
  platformVersion?: string;
  uaFullVersion?: string; // Deprecated
  wow64?: boolean;
}

interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
  toJSON(): object;
}

// Extend Navigator interface to include userAgentData
declare global {
  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

type HighEntropyHint =
  | "architecture"
  | "bitness"
  | "formFactors"
  | "fullVersionList"
  | "model"
  | "platformVersion"
  | "uaFullVersion"
  | "wow64";

// Default hints include all available high entropy values
const DEFAULT_HINTS: HighEntropyHint[] = [
  "architecture",
  "bitness",
  "formFactors",
  "fullVersionList",
  "model",
  "platformVersion",
  "uaFullVersion",
  "wow64",
];

// Cache entry interface
interface CacheEntry {
  promise: Promise<UADataValues>;
  status: 'pending' | 'resolved' | 'rejected';
  result?: UADataValues;
  error?: Error;
}

// Cache for storing promises and their results
const cache = new Map<string, CacheEntry>();

/**
 * Clear all cached entries - useful for testing
 * @internal
 */
export function clearCache() {
  cache.clear();
}

/**
 * Creates a cache key from an array of hints
 */
function createCacheKey(hints: string[]): string {
  return hints.sort().join(",");
}

/**
 * Suspense-enabled hook for getting high entropy values from Navigator User Agent Data API
 * 
 * This hook will suspend (throw a promise) while the Navigator User Agent Data API
 * is fetching high entropy values. It should be wrapped in a Suspense boundary.
 * 
 * @param hints - Array of high entropy hints to request. Defaults to all available hints.
 * @returns The high entropy values returned by the API
 * 
 * @throws {Error} When Navigator User Agent Data API is not supported
 * @throws {Promise} When data is still loading (for Suspense)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const userAgentData = useSuspenseNavigatorUserAgentData([
 *     "architecture",
 *     "platformVersion"
 *   ]);
 *   
 *   return <div>Architecture: {userAgentData.architecture}</div>;
 * }
 * 
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading...</div>}>
 *       <MyComponent />
 *     </Suspense>
 *   );
 * }
 * ```
 */
function useSuspenseNavigatorUserAgentData(
  hints: HighEntropyHint[] = DEFAULT_HINTS
): UADataValues {
  // Check if Navigator User Agent Data API is supported
  if (typeof navigator === "undefined" || !navigator.userAgentData) {
    throw new Error(
      "Navigator User Agent Data API is not supported in this browser. " +
      "This API is currently only available in Chromium-based browsers."
    );
  }

  const cacheKey = createCacheKey(hints);
  
  // Check if we already have a cache entry for this combination of hints
  let entry = cache.get(cacheKey);
  
  if (!entry) {
    // Create new cache entry with promise
    const promise = navigator.userAgentData.getHighEntropyValues(hints);
    
    entry = {
      promise,
      status: 'pending'
    };
    
    cache.set(cacheKey, entry);
    
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

export { useSuspenseNavigatorUserAgentData };
