import { useRef } from "react";
import type { DependencyList, EffectCallback } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

/**
 * useUpdateLayoutEffect hook
 *
 * Fires a callback on every update (re-render) but skips the initial mount.
 * Has the same API as React's built-in `useLayoutEffect`, and uses the
 * isomorphic effect pattern to avoid SSR warnings.
 *
 * @param {EffectCallback} effect Imperative function that can return a cleanup function
 * @param {DependencyList} [deps] Dependencies that control when the effect re-runs
 * @returns {void}
 * @example
 * function App() {
 *   const [width, setWidth] = useState(0);
 *   const ref = useRef<HTMLDivElement>(null);
 *   useUpdateLayoutEffect(() => {
 *     if (ref.current) {
 *       setWidth(ref.current.offsetWidth);
 *     }
 *   }, [someState]);
 *   return <div ref={ref}>content</div>;
 * }
 * @see https://rooks.vercel.app/docs/hooks/useUpdateLayoutEffect
 */
function useUpdateLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const hasMountedRef = useRef<boolean>(false);

  useIsomorphicEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useUpdateLayoutEffect };
