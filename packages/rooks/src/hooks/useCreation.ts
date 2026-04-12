import { useRef } from "react";

type CreationCache<T> = {
  deps: readonly unknown[];
  value: T;
};

/**
 * Compares two dependency arrays using Object.is for each element,
 * mirroring the comparison React uses for useMemo/useEffect.
 */
function areDepsEqual(
  prevDeps: readonly unknown[],
  nextDeps: readonly unknown[]
): boolean {
  if (prevDeps.length !== nextDeps.length) return false;
  return prevDeps.every((dep, i) => Object.is(dep, nextDeps[i]));
}

/**
 * useCreation
 *
 * A stable alternative to `useMemo`. Unlike `useMemo`, React does **not**
 * guarantee that it will preserve cached values — it may discard the memo
 * cache to free memory (e.g. during concurrent rendering or future
 * optimisations). `useCreation` uses a `useRef` to store the cached value,
 * so React can never throw it away. The factory is only re-invoked when the
 * dependency array changes (compared with `Object.is`, the same strategy
 * React uses for hooks).
 *
 * Use this hook when:
 * - The object/function you create must remain referentially stable.
 * - Downstream hooks or components depend on reference equality and a silent
 *   recompute from `useMemo` would cause subtle bugs or unnecessary work.
 * - You are constructing expensive objects (e.g. class instances, parsers,
 *   heavy data structures) whose recreation must be strictly controlled.
 *
 * For pure performance hints where occasional re-computation is acceptable,
 * prefer the built-in `useMemo`.
 *
 * @template T - The type of value produced by the factory function.
 * @param factory - A function that produces the value. Called once on mount,
 *   then again only when `deps` change.
 * @param deps - Dependency array. The factory is re-run whenever any element
 *   changes (compared with `Object.is`).
 * @returns The stable cached value of type `T`.
 *
 * @example
 * ```tsx
 * import { useCreation } from "rooks";
 *
 * function MyComponent({ config }: { config: Config }) {
 *   // `parser` is guaranteed never to be silently recreated by React.
 *   const parser = useCreation(() => new ExpensiveParser(config), [config]);
 *   return <div>{parser.parse()}</div>;
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useCreation
 */
function useCreation<T>(factory: () => T, deps: readonly unknown[]): T {
  const cacheRef = useRef<CreationCache<T> | null>(null);

  if (
    cacheRef.current === null ||
    !areDepsEqual(cacheRef.current.deps, deps)
  ) {
    cacheRef.current = {
      deps,
      value: factory(),
    };
  }

  return cacheRef.current.value;
}

export { useCreation };
