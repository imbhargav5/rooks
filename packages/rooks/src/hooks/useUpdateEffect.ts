import { useEffect, useRef } from "react";
import type { DependencyList, EffectCallback } from "react";

/**
 * useUpdateEffect hook
 *
 * Fires a callback on every update (re-render) but skips the initial mount.
 * Has the same API as React's built-in `useEffect`.
 *
 * @param {EffectCallback} effect Imperative function that can return a cleanup function
 * @param {DependencyList} [deps] Dependencies that control when the effect re-runs
 * @returns {void}
 * @example
 * function App() {
 *   const [count, setCount] = useState(0);
 *   useUpdateEffect(() => {
 *     console.log("count changed", count);
 *   }, [count]);
 *   return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
 * }
 * @see https://rooks.vercel.app/docs/hooks/useUpdateEffect
 */
function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const hasMountedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useUpdateEffect };
