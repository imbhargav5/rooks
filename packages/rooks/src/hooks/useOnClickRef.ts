import { noop } from "@/utils/noop";
import { useState, useEffect, useCallback } from "react";
import { useFreshCallback } from "./useFreshCallback";

/**
 * useOnClickRef hook
 *
 * This hook runs a callback for both clicks and tap events when the element is clicked or tapped.
 *
 * @param {Function} onClick The callback function to run on click or tap
 * @returns {Function} A callback ref which can be attached to an element
 */
function useOnClickRef(onClick: () => void) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const handleEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      onClick();
    },
    [onClick]
  );

  const freshCallback = useFreshCallback(handleEvent);

  useEffect(() => {
    if (node) {
      node.addEventListener("click", freshCallback);
      node.addEventListener("touchend", freshCallback);

      return () => {
        node.removeEventListener("click", freshCallback);
        node.removeEventListener("touchend", freshCallback);
      };
    }
    return noop;
  }, [node, freshCallback]);

  const ref = useCallback((element: HTMLElement) => {
    if (element) {
      setNode(element);
    }
  }, []);

  return ref;
}

export { useOnClickRef };
