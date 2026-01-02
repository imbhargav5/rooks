import type { MutableRefObject } from "react";
import { useEffect } from "react";
import { noop } from "@/utils/noop";

/**
 *
 * useResizeObserver hook
 *
 * Returns a resize observer for a React Ref and fires a callback
 *
 * @param {MutableRefObject<HTMLElement | null>} ref React ref on which resizes are to be observed
 * @param {ResizeObserverCallback} callback Function that needs to be fired on resize
 * @param {ResizeObserverOptions} options
 * @see https://rooks.vercel.app/docs/hooks/useResizeObserver
 */
function useResizeObserver(
  ref: MutableRefObject<HTMLElement | null>,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
): void {
  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (ref.current) {
      const observer = new ResizeObserver(callback);

      // Start observing the target node for configured resizes
      observer.observe(ref.current, options);

      return () => {
        observer.disconnect();
      };
    }

    return noop;
  }, [callback, options, ref]);
}

export { useResizeObserver };
