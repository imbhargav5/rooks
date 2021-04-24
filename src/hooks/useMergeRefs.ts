import { useMemo, MutableRefObject } from 'react';
import type { HTMLElementOrNull, CallbackRef, AnyRef } from '../utils/utils';

function setRef(ref: AnyRef, value: HTMLElementOrNull) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
/**
 * useMergeRefs
 * Merges multiple refs into a single function ref.
 * Takes any number of refs.
 * Refs can be mutable refs or function refs.
 *
 * @param refs
 */
function useMergeReferences(...references: AnyRef[]): CallbackRef | null {
  return useMemo(() => {
    if (references.every((ref) => ref === null)) {
      return null;
    }

    return (refValue) => {
      references.forEach((ref) => {
        setRef(ref, refValue);
      });
    };
  }, [...references]);
}

export { useMergeReferences as useMergeRefs };
