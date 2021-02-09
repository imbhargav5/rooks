import { useEffect, useCallback, useState } from 'react';
import { HTMLElementOrNull, CallbackRef } from './utils/utils';

const config: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px 0px 0px',
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
        entries.forEach(({ isIntersecting }) => setInView(isIntersecting));
        callback(entries, observerRef);
      }, options);

      // Start observing the target node for configured mutations
      observer.observe(node);
      return () => {
        observer.disconnect();
      };
    }
  }, [node, callback, root, rootMargin, threshold]);

  const ref = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  return [ref, inView];
}

export { useInViewRef };
