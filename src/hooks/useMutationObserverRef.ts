import { useEffect, Ref, MutableRefObject, useCallback, useState } from 'react';
import type { CallbackRef, HTMLElementOrNull } from '../utils/utils';

const config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

/**
 *
 * useMutationObserverRef hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
function useMutationObserverRef(
  callback: MutationCallback,
  options: MutationObserverInit = config
): [CallbackRef] {
  const [node, setNode] = useState<HTMLElementOrNull>(null);

  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (node) {
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(node, options);

      return () => {
        observer.disconnect();
      };
    }
  }, [node, callback, options]);

  const ref: CallbackRef = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  return [ref];
}

export { useMutationObserverRef };
