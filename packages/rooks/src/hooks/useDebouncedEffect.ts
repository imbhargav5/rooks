import { useEffect, useRef, type DependencyList, type EffectCallback } from "react";
import { useDebounce, type DebounceSettings } from "./useDebounce";


/**
 * useDebouncedEffect
 * @description A version of useEffect that debounces the effect execution based on dependency changes
 * @param effect The effect callback to run (can return a cleanup function)
 * @param deps The dependency list that triggers the effect
 * @param delay The debounce delay in milliseconds
 * @param options Optional debounce settings (leading, trailing, maxWait)
 * @see https://rooks.vercel.app/docs/hooks/useDebouncedEffect
 * @example
 * ```jsx
 * useDebouncedEffect(
 *   () => {
 *     console.log('Search query:', searchQuery);
 *     // Perform API call
 *     return () => {
 *       // Cleanup
 *     };
 *   },
 *   [searchQuery],
 *   500
 * );
 * ```
 */
function useDebouncedEffect(
    effect: EffectCallback,
    deps: DependencyList,
    delay: number = 500,
    options?: DebounceSettings
): void {
    const cleanupRef = useRef<void | (() => void)>(undefined);

    const wrappedEffect = () => {
        // Call cleanup from previous effect if it exists
        if (typeof cleanupRef.current === "function") {
            cleanupRef.current();
        }
        // Run the effect and store the new cleanup
        cleanupRef.current = effect();
    };

    const debouncedEffect = useDebounce(wrappedEffect, delay, options);

    useEffect(() => {
        debouncedEffect();

        return () => {
            // Cancel any pending debounced calls
            debouncedEffect.cancel();
            // Call cleanup if it exists (for when component unmounts)
            if (typeof cleanupRef.current === "function") {
                cleanupRef.current();
                cleanupRef.current = undefined;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export { useDebouncedEffect };

