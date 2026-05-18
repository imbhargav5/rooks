import { useRef } from "react";
import type { DependencyList } from "react";

function depsHaveChanged(
  prevDeps: DependencyList,
  nextDeps: DependencyList
): boolean {
  if (prevDeps.length !== nextDeps.length) return true;
  return nextDeps.some((dep, i) => !Object.is(dep, prevDeps[i]));
}

/**
 * useCreation hook
 *
 * @description A more reliable version of useMemo backed by useRef. Unlike
 * useMemo, React does not discard cached values between renders for performance
 * — useCreation guarantees the factory function is only called once on mount
 * and again only when deps actually change.
 *
 * @param {Function} factory A factory function that returns the value to memoize
 * @param {DependencyList} deps Dependency array — factory re-runs when any dep changes
 * @returns {T} The stable memoized value
 * @see https://rooks.vercel.app/docs/hooks/useCreation
 */
function useCreation<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{
    deps: DependencyList;
    value: T;
    initialized: boolean;
  }>({
    deps,
    value: undefined as unknown as T,
    initialized: false,
  });

  if (!ref.current.initialized || depsHaveChanged(ref.current.deps, deps)) {
    ref.current.value = factory();
    ref.current.deps = deps;
    ref.current.initialized = true;
  }

  return ref.current.value;
}

export { useCreation };
