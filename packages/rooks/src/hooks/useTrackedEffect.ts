import { type DependencyList, useEffect, useRef } from "react";

/**
 * useTrackedEffect hook
 * @description A useEffect hook that tracks which dependencies changed between renders.
 * The callback receives an array of indices indicating which dependencies changed.
 * On the initial render, the callback is called with an empty array.
 * @param {Function} callback Effect callback that receives an array of changed dependency indices
 * @param {DependencyList} deps Dependency list to track
 * @see https://rooks.vercel.app/docs/hooks/useTrackedEffect
 */
function useTrackedEffect(
  callback: (changedIndices: number[]) => void | (() => void),
  deps?: DependencyList
): void {
  const prevDepsRef = useRef<DependencyList | undefined>(undefined);

  useEffect(() => {
    const changedIndices: number[] = [];

    if (prevDepsRef.current !== undefined && deps !== undefined) {
      deps.forEach((dep, index) => {
        if (!Object.is(dep, prevDepsRef.current![index])) {
          changedIndices.push(index);
        }
      });
    }

    prevDepsRef.current = deps;

    return callback(changedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useTrackedEffect };
