import { type DependencyList, useEffect, useRef, useState } from "react";
import {
  assertSyncDisposeSupport,
  disposeSync,
} from "@/utils/explicitResourceManagement";

/**
 * useDisposable hook
 *
 * ⚠️ Experimental: import from "rooks/experimental".
 *
 * Bridges TC39 Explicit Resource Management (`Symbol.dispose`) with React
 * component lifecycles. Creates a disposable resource synchronously so it is
 * available on the first render, and disposes it when the component unmounts
 * or when the dependency array changes.
 *
 * This hook requires `Symbol.dispose` support at runtime. In unsupported
 * browsers such as Safari, install a polyfill like
 * `core-js/proposals/explicit-resource-management` before using it.
 *
 * @param factory Function that creates and returns the disposable resource
 * @param deps Dependency array controlling the resource lifecycle
 * @returns The disposable resource
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
function useDisposable<T>(factory: () => T, deps: DependencyList = []): T {
  const resourceRef = useRef<T | null>(null);
  const [, forceUpdate] = useState(0);

  if (resourceRef.current === null) {
    assertSyncDisposeSupport("useDisposable");
    resourceRef.current = factory();
  }

  useEffect(() => {
    if (resourceRef.current === null) {
      assertSyncDisposeSupport("useDisposable");
      resourceRef.current = factory();
      forceUpdate((n) => n + 1);
    }

    return () => {
      if (resourceRef.current !== null) {
        disposeSync(resourceRef.current, "useDisposable");
        resourceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return resourceRef.current;
}

export { useDisposable };
