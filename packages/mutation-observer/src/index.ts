import { useEffect, Ref, MutableRefObject } from "react";

var config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true
};

/**
 *
 * useMutationObserver hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutableRefObject<HTMLElement>} ref React ref on which mutations are to be observed
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
function useMutationObserver(
  ref: MutableRefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit = config
) {
  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (ref.current) {
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(ref.current, options);
      return () => {
        observer.disconnect();
      };
    }
  }, [ref.current, callback, options]);
}

export default useMutationObserver;
