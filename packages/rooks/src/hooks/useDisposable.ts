import { type DependencyList, useEffect, useRef, useState } from "react";

/**
 * useDisposable hook
 *
 * Bridges TC39 Explicit Resource Management (`Symbol.dispose`) with React component
 * lifecycles. Creates a disposable resource synchronously so it is available on the
 * very first render, and calls `resource[Symbol.dispose]()` when the component
 * unmounts or when the dependency array changes.
 *
 * Use this hook when a resource is cheap to create synchronously and its lifecycle
 * should mirror a React component or a specific set of props/state values.
 *
 * Note: if the resource also emits change events that should drive re-renders,
 * prefer `useSyncExternalStore` instead.
 *
 * @param {() => T} factory Function that creates and returns the disposable resource
 * @param {DependencyList} deps Dependency array — when deps change the old resource is
 *   disposed and a new one is created (same semantics as `useEffect` deps)
 * @returns {T} The disposable resource — guaranteed non-null on every render
 * @see https://rooks.vercel.app/docs/hooks/useDisposable
 * @example
 * ```tsx
 * const ws = useDisposable(
 *   () => createManagedWebSocket(url),
 *   [url]
 * );
 * ws.send("hello");
 * ```
 */
function useDisposable<T extends Disposable>(
  factory: () => T,
  deps: DependencyList = []
): T {
  const resourceRef = useRef<T | null>(null);
  // Used to trigger a re-render after the effect creates a new resource on
  // a deps change (cleanup nulls the ref; effect recreates and schedules a
  // re-render so the component receives the fresh resource).
  const [, forceUpdate] = useState(0);

  // Create the resource synchronously so it is available on the first render.
  // This same check also handles the React Strict Mode remount cycle: the effect
  // cleanup nulls the ref, and the subsequent remount render recreates it here
  // before any effects fire.
  if (resourceRef.current === null) {
    resourceRef.current = factory();
  }

  useEffect(() => {
    // When deps change, the cleanup of the previous effect runs first and nulls
    // the ref. There is no intermediate render, so we recreate here and schedule
    // a re-render via forceUpdate so the component receives the new resource.
    if (resourceRef.current === null) {
      resourceRef.current = factory();
      forceUpdate((n) => n + 1);
    }

    return () => {
      if (resourceRef.current !== null) {
        resourceRef.current[Symbol.dispose]();
        resourceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return resourceRef.current;
}

export { useDisposable };
