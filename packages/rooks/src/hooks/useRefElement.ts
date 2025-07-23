import { useCallback, useState } from "react";
import type { RefElementOrNull } from "../utils/utils";

/**
 * useRefElement hook for React
 * Helps bridge gap between callback ref and state
 * Manages the element called with callback ref api using state variable
 * @returns {[RefElementOrNull, (element: HTMLElementOrNull) => void]}
 * @see https://rooks.vercel.app/docs/hooks/useRefElement
 */
function useRefElement<T>(): [
  (refElement: RefElementOrNull<T>) => void,
  RefElementOrNull<T>
] {
  const [refElement, setRefElement] = useState<RefElementOrNull<T>>(null);
  const ref = useCallback<(refElement: RefElementOrNull<T>) => void>(
    (element: RefElementOrNull<T>) => {
      setRefElement(element);
    },
    []
  );

  return [ref, refElement];
}

export { useRefElement };
