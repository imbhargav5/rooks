import { useEffect, Ref, MutableRefObject, useCallback, useState } from "react";
import { HTMLElementOrNull } from "./utils/utils";

var config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true
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
) {
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

  const ref = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  return [ref];
}

export { useMutationObserverRef };
