import { useEffect, useCallback, useState, useRef } from "react";
import type { HTMLElementOrNull, CallbackRef } from "../utils/utils";
import { noop } from "@/utils/noop";

const config: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: [0, 1],
};

/**
 *
 * useIntersectionObserverRef hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {IntersectionObserverCallback} callback Function that needs to be fired on mutation
 * @param {IntersectionObserverInit} options
 * @see https://rooks.vercel.app/docs/hooks/useIntersectionObserverRef
 */
function useIntersectionObserverRef(
  callback: IntersectionObserverCallback | undefined,
  options: IntersectionObserverInit = config
): [CallbackRef] {
  const { root = null, rootMargin, threshold } = options;

  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const handleIntersectionObserver = useCallback<IntersectionObserverCallback>(
    (...args) => {
      return callbackRef.current?.(...args);
    },
    []
  );

  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (node) {
      const observer = new IntersectionObserver(handleIntersectionObserver, {
        root,
        rootMargin,
        threshold,
      });

      // Start observing the target node for configured mutations
      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }

    return noop;
  }, [node, handleIntersectionObserver, root, rootMargin, threshold]);

  const ref = useCallback((nodeElement: HTMLElementOrNull) => {
    setNode(nodeElement);
  }, []);

  return [ref];
}

export { useIntersectionObserverRef };
