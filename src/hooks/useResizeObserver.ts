import { RefObject, useEffect, useState } from "react";

interface Options {
  box: "content-box" | "border-box" | "device-pixel-content-box";
}

/**
 *
 * useResizeObserver hook
 *
 * Returns a resize observer for a React Ref and fires a callback
 * https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @param {RefObject<HTMLElement | null>} ref React ref on which resizes are to be observed
 * @param {ResizeObserverCallback} callback Function that needs to be fired on resize
 * @param {Options} options An options object allowing you to set options for the observation
 */
function useResizeObserver(
  ref: RefObject<HTMLElement | null>,
  callback: ResizeObserverCallback,
  options?: Options
) {
  useEffect(() => {
    if (!ref.current) return;

    // Start observing the target node for resizes
    const observer = new ResizeObserver(callback);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);
}

export { useResizeObserver };
