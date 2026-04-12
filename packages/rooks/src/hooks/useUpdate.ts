import { useCallback, useState } from "react";

/**
 * useUpdate hook
 *
 * Returns a function that forces the component to re-render when called.
 * Useful for integrating imperative APIs or subscriptions that live outside
 * of React's state model (e.g. MobX stores, EventEmitter callbacks, WebSocket
 * message handlers).
 *
 * @returns {() => void} A stable callback that increments a dummy counter,
 *   triggering a re-render. The function reference is stable across renders.
 * @see https://rooks.vercel.app/docs/hooks/useUpdate
 * @example
 * const update = useUpdate();
 *
 * useEffect(() => {
 *   const subscription = externalStore.subscribe(() => {
 *     update(); // tell React to re-render and pull fresh data
 *   });
 *   return () => subscription.unsubscribe();
 * }, [update]);
 */
function useUpdate(): () => void {
  const [, setState] = useState(0);

  const update = useCallback(() => {
    setState((n) => n + 1);
  }, []);

  return update;
}

export { useUpdate };
