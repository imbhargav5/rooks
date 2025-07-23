import type { MutableRefObject, RefCallback } from "react";
import { useMemo } from "react";
import type { PossibleRef } from "../utils/utils";
/**
 * Credit to material-ui for this snippet
 */

function setRef<T>(ref: PossibleRef<T> | null, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T>).current = value;
  }
}

/**
 * useForkRef
 * Joins refs together and returns a combination of the two as a new ref
 *
 * @param refA
 * @param refB
 * @returns MutableRefObject
 * @see https://rooks.vercel.app/docs/hooks/useForkRef
 */
function useForkRef<T>(
  refA: PossibleRef<T> | null,
  refB: PossibleRef<T> | null
): RefCallback<T> | null {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return useMemo(() => {
    if (refA === null && refB === null) {
      return null;
    }

    return (refValue: T) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}

export { useForkRef };
