import { useEffect, useCallback, useState } from "react";
import type { HTMLElementOrNull, CallbackRef } from "../utils/utils";
import { noop } from "@/utils/noop";

const config: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: [0, 1],
};

/**
 *
 * useInViewRef hook
 *
 * Returns a mutation observer for a React Ref and true/false when element enters/leaves the viewport. Also fires a callback.
 *
 * @param {IntersectionObserverCallback} callback Function that needs to be fired on mutation
 * @param {IntersectionObserverInit} options
 * @see https://react-hooks.org/docs/useInViewRef
 */
function useInViewRef(
  callback: IntersectionObserverCallback = () => {},
  options: IntersectionObserverInit = config
): [CallbackRef, boolean] {
  const { root = null, rootMargin, threshold } = options;

  const [node, setNode] = useState<HTMLElementOrNull>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (node) {
      const observer = new IntersectionObserver((entries, observerRef) => {
        for (const { isIntersecting } of entries) setInView(isIntersecting);
        callback(entries, observerRef);
      }, options);

      // Start observing the target node for configured mutations
      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }

    return noop;
  }, [node, callback, root, rootMargin, threshold, options]);

  const ref = useCallback((nodeElement: HTMLElementOrNull) => {
    setNode(nodeElement);
  }, []);

  return [ref, inView];
}

export { useInViewRef };
