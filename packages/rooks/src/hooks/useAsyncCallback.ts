import { useCallback, type DependencyList } from "react";
import { useGetIsMounted } from "./useGetIsMounted";
import { useFreshRef } from "./useFreshRef";

type AsyncCallback<T extends unknown[], R> = (...args: T) => Promise<R>;

/**
 * useAsyncCallback
 * @description A safe version of useCallback for async functions that prevents stale closures
 * and checks if component is still mounted before executing
 * @param callback Async callback function
 * @param deps Dependency array (same as useCallback)
 * @returns A safe async callback that won't execute if component is unmounted
 * @see https://rooks.vercel.app/docs/useAsyncCallback
 */
function useAsyncCallback<T extends unknown[], R>(
  callback: AsyncCallback<T, R>,
  deps: DependencyList
): AsyncCallback<T, R> {
  const getIsMounted = useGetIsMounted();
  const freshCallbackRef = useFreshRef(callback);

  return useCallback(
    async (...args: T): Promise<R> => {
      if (!getIsMounted()) {
        // Component is unmounted, don't execute the callback
        return Promise.reject(new Error("Component is unmounted"));
      }

      try {
        const result = await freshCallbackRef.current(...args);
        
        // Check again if component is still mounted after async operation
        if (!getIsMounted()) {
          return Promise.reject(new Error("Component unmounted during async operation"));
        }
        
        return result;
      } catch (error) {
        // Only re-throw if component is still mounted
        if (getIsMounted()) {
          throw error;
        }
        return Promise.reject(new Error("Component unmounted during async operation"));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getIsMounted, freshCallbackRef, ...deps]
  );
}

export { useAsyncCallback };