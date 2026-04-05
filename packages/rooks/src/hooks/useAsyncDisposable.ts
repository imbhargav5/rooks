import { type DependencyList, useEffect, useRef, useState } from "react";
import {
  assertAsyncDisposeSupport,
  disposeAsync,
} from "@/utils/explicitResourceManagement";

/**
 * useAsyncDisposable hook
 *
 * ⚠️ Experimental: import from "rooks/experimental".
 *
 * Bridges TC39 Explicit Resource Management (`Symbol.asyncDispose`) with React
 * component lifecycles. Asynchronously creates a disposable resource and
 * disposes it when the component unmounts or when the dependency array changes.
 *
 * This hook requires `Symbol.asyncDispose` support at runtime. In unsupported
 * browsers such as Safari, install a polyfill like
 * `core-js/proposals/explicit-resource-management` before using it.
 *
 * @param factory Async function that creates and returns the resource
 * @param deps Dependency array controlling the resource lifecycle
 * @returns The resource, or null while it is still resolving
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
function useAsyncDisposable<T>(
  factory: () => Promise<T>,
  deps: DependencyList = []
): T | null {
  const [resource, setResource] = useState<T | null>(null);
  const resourceRef = useRef<T | null>(null);

  useEffect(() => {
    assertAsyncDisposeSupport("useAsyncDisposable");

    let disposed = false;

    factory().then((newResource) => {
      if (disposed) {
        void disposeAsync(newResource, "useAsyncDisposable").catch(() => {});
      } else {
        resourceRef.current = newResource;
        setResource(newResource);
      }
    });

    return () => {
      disposed = true;
      const toDispose = resourceRef.current;

      resourceRef.current = null;
      setResource(null);

      if (toDispose !== null) {
        void disposeAsync(toDispose, "useAsyncDisposable").catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return resource;
}

export { useAsyncDisposable };
