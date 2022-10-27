import type { MutableRefObject } from "react";
import { useEffect } from "react";
import { noop } from "@/utils/noop";
import { ElementOrNull } from "@/utils/utils";

const config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

/**
 *
 * useMutationObserver hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutableRefObject<ElementOrNull>} ref React ref on which mutations are to be observed
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 * @see https://react-hooks.org/docs/useMutationObserver
 */
function useMutationObserver(
  ref: MutableRefObject<ElementOrNull>,
  callback: MutationCallback,
  options: MutationObserverInit = config
): void {
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

    return noop;
  }, [callback, options, ref]);
}

export { useMutationObserver };
