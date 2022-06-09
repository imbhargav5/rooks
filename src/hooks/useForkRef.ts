import { useMemo } from 'react';
import type { HTMLElementOrNull, CallbackRef, AnyRef } from '../utils/utils';
/**
 * Credit to material-ui for this snippet
 */

function setRef<T extends HTMLElement | null>(ref: AnyRef<T> | null, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/**
 * useForkRef
 * Joins refs together and returns a combination of the two as a new ref
 *
 * @param refA
 * @param refB
 */
function useForkRef<T extends HTMLElement | null = HTMLElementOrNull>(
  refA: AnyRef<T> | null,
  refB: AnyRef<T> | null
): CallbackRef<T> | null {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }

    return (refValue: T) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}

export { useForkRef };
