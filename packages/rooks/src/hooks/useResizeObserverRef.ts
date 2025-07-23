import { noop } from "@/utils/noop";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CallbackRef, HTMLElementOrNull } from "../utils/utils";

const config: ResizeObserverOptions = {
  box: "content-box",
};

/**
 *
 * useResizeObserverRef hook
 *
 * Returns a resize observer for a React Ref and fires a callback
 * https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @param {ResizeObserverCallback} callback Function that needs to be fired on resize
 * @param {ResizeObserverOptions} options An options object allowing you to set options for the observation
 * @returns {[CallbackRef]} callbackref
 * @see https://rooks.vercel.app/docs/hooks/useResizeObserverRef
 */
function useResizeObserverRef(
  callback: ResizeObserverCallback | undefined,
  options: ResizeObserverOptions = config
): [CallbackRef] {
  const { box } = options;
  const [node, setNode] = useState<HTMLElementOrNull>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const handleResizeObserver = useCallback<ResizeObserverCallback>(
    (...args) => {
      callbackRef.current?.(...args);
    },
    []
  );

  useEffect(() => {
    if (node) {
      // Create an observer instance linked to the callback function
      const observer = new ResizeObserver(handleResizeObserver);

      // Start observing the target node for resizes
      observer.observe(node, { box });

      return () => {
        observer.disconnect();
      };
    }
    return noop;
  }, [node, handleResizeObserver, box]);

  const ref: CallbackRef = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  return [ref];
}

export { useResizeObserverRef };
