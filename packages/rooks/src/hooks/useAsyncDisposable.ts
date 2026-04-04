import { type DependencyList, useEffect, useRef, useState } from "react";

/**
 * useAsyncDisposable hook
 *
 * Bridges TC39 Explicit Resource Management (`Symbol.asyncDispose`) with React
 * component lifecycles. Asynchronously creates a disposable resource and calls
 * `resource[Symbol.asyncDispose]()` when the component unmounts or when the
 * dependency array changes.
 *
 * Returns `null` until the factory promise resolves. Race conditions are handled
 * via a `disposed` flag (similar to the `lastCallId` pattern in `useAsyncEffect`):
 * if the component unmounts (or deps change) while the factory is still resolving,
 * the arriving resource is disposed immediately and the component never receives it.
 *
 * Note: if the resource also emits change events that should drive re-renders,
 * prefer `useSyncExternalStore` instead.
 *
 * @param {() => Promise<T>} factory Async function that creates and returns the
 *   disposable resource
 * @param {DependencyList} deps Dependency array — when deps change the old resource
 *   is disposed and a new one is created (same semantics as `useEffect` deps)
 * @returns {T | null} The disposable resource, or `null` while the factory is
 *   still resolving
 * @see https://rooks.vercel.app/docs/hooks/useAsyncDisposable
 * @example
 * ```tsx
 * const db = useAsyncDisposable(
 *   () => openManagedDatabase("mydb"),
 *   [userId]
 * );
 * if (db === null) return <Spinner />;
 * ```
 */
function useAsyncDisposable<T extends AsyncDisposable>(
  factory: () => Promise<T>,
  deps: DependencyList = []
): T | null {
  const [resource, setResource] = useState<T | null>(null);
  // Ref allows the cleanup function to synchronously read and clear the latest
  // resource without stale-closure issues.
  const resourceRef = useRef<T | null>(null);

  useEffect(() => {
    // `disposed` mirrors the `lastCallId` pattern from useAsyncEffect.
    // When the cleanup runs (unmount or deps change) it sets disposed=true.
    // If the factory resolves after that point the arriving resource is
    // discarded rather than handed to the component.
    let disposed = false;

    factory().then((newResource) => {
      if (disposed) {
        // Cleanup already ran — dispose immediately; the component never sees
        // this resource.
        void newResource[Symbol.asyncDispose]();
      } else {
        resourceRef.current = newResource;
        setResource(newResource);
      }
    });

    return () => {
      disposed = true;
      const toDispose = resourceRef.current;
      // Null out the ref and state synchronously so the component immediately
      // shows null (loading state) while the next resource is being created.
      resourceRef.current = null;
      setResource(null);
      if (toDispose !== null) {
        void toDispose[Symbol.asyncDispose]();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return resource;
}

export { useAsyncDisposable };
