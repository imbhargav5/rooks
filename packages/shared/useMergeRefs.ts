import { useMemo, MutableRefObject } from 'react';
import { HTMLElementOrNull, CallbackRef, AnyRef } from './utils/utils';

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
 * @param refs
 */
function useMergeRefs(...refs: AnyRef[]): CallbackRef | null {
  return useMemo(() => {
    if (refs.every((ref) => ref === null)) {
      return null;
    }
    return (refValue) => {
      refs.forEach((ref) => {
        setRef(ref, refValue);
      });
    };
  }, [...refs]);
}

export { useMergeRefs };
