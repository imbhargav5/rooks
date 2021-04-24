import { useCallback, useRef, useState, createRef } from 'react';
import type { RefElementOrNull } from '../utils/utils';

/**
 * useRefElement hook for React
 * Helps bridge gap between callback ref and state
 * Manages the element called with callback ref api using state variable
 */
function useRefElement<T>(): [
  (refElement: RefElementOrNull<T>) => void,
  RefElementOrNull<T>
] {
  const [refElement, setRefElement] = useState<RefElementOrNull<T>>(null);
  const ref = useCallback<(refElement: RefElementOrNull<T>) => void>(
    (refElement: RefElementOrNull<T>) => {
      setRefElement(refElement);
    },
    []
  );

  return [ref, refElement];
}

export { useRefElement };
