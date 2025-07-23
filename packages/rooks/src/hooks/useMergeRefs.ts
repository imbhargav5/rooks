import type { MutableRefObject, RefCallback } from "react";
import { useMemo } from "react";
import type { PossibleRef } from "../utils/utils";

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T>).current = value;
  }
}

/**
 * useMergeRefs
 * Merges multiple refs into a single function ref.
 * Takes any number of refs.
 * Refs can be mutable refs or function refs.
 *
 * @param refs
 * @see https://rooks.vercel.app/docs/hooks/useMergeRefs
 */
export function useMergeRefs<T>(
  ...refs: Array<PossibleRef<T>>
): RefCallback<T> | null {
  return useMemo(() => {
    if (refs.every((ref) => ref === null)) {
      return null;
    }

    return (refValue: T) => {
      for (const ref of refs) {
        setRef<T>(ref, refValue);
      }
    };
  }, [refs]);
}
