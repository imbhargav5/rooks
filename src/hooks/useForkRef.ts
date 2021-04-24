import { useMemo, MutableRefObject } from 'react';
import type { HTMLElementOrNull, CallbackRef, AnyRef } from '../utils/utils';
/**
 * Credit to material-ui for this snippet
 */

function setRef(ref: AnyRef, value: HTMLElementOrNull) {
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
function useForkRef(refA: AnyRef, refB: AnyRef): CallbackRef | null {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }

    return (refValue: HTMLElementOrNull) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}

export { useForkRef };
