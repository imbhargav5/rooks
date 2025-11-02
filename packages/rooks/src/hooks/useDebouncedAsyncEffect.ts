import { type DependencyList, useEffect, useRef, useCallback } from "react";
import { useFreshRef } from "./useFreshRef";
import { useGetIsMounted } from "./useGetIsMounted";
import { useDebounce, type DebounceSettings } from "./useDebounce";

type AsyncEffect<T> = (shouldContinueEffect: () => boolean) => Promise<T>;
type CleanupFunction<T> = (result: T | void) => void;

/**
 * useDebouncedAsyncEffect
 * @description A version of useEffect that accepts an async function and debounces its execution based on dependency changes
 * @param effect Async function that receives a shouldContinueEffect callback
 * @param deps The dependency list that triggers the effect
 * @param delay The debounce delay in milliseconds
 * @param cleanup Optional cleanup function that receives the previous result
 * @param options Optional debounce settings (leading, trailing, maxWait)
 * @see https://rooks.vercel.app/docs/hooks/useDebouncedAsyncEffect
 * @example
 * ```jsx
 * useDebouncedAsyncEffect(
 *   async (shouldContinueEffect) => {
 *     const data = await fetchData(searchQuery);
 *     if (shouldContinueEffect()) {
 *       setResults(data);
 *     }
 *   },
 *   [searchQuery],
 *   500,
 *   (previousResult) => {
 *     // Cleanup
 *   }
 * );
 * ```
 */
function useDebouncedAsyncEffect<T>(
    effect: AsyncEffect<T>,
    deps: DependencyList,
    delay: number = 500,
    cleanup?: CleanupFunction<T>,
    options?: DebounceSettings
): void {
    // Track call IDs to ensure we only process the latest async call
    const lastCallId = useRef(0);
    const getIsMounted = useGetIsMounted();
    const effectRef = useFreshRef(effect);
    const resultRef = useRef<void | T>(undefined);

    // Create the async callback that will be debounced
    const asyncCallback = useCallback(async (): Promise<void | T> => {
        const callId = ++lastCallId.current;
        const shouldContinueEffect = () => {
            return getIsMounted() && callId === lastCallId.current;
        };

        try {
            const result = await effectRef.current(shouldContinueEffect);
            if (shouldContinueEffect()) {
                resultRef.current = result;
            }
            return result;
        } catch (error) {
            if (shouldContinueEffect()) {
                throw error;
            }
        }
    }, [getIsMounted, effectRef]);

    // Debounce the async callback
    const debouncedAsyncCallback = useDebounce(asyncCallback, delay, options);

    const cleanupRef = useFreshRef(cleanup);

    useEffect(() => {
        // Trigger the debounced async effect
        debouncedAsyncCallback();

        // Capture cleanup function at effect time
        const currentCleanup = cleanupRef.current;

        return () => {
            // Cancel any pending debounced calls
            debouncedAsyncCallback.cancel();
            // Call cleanup with the result
            if (currentCleanup) {
                currentCleanup(resultRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export { useDebouncedAsyncEffect };
export type { AsyncEffect, CleanupFunction };

