import { RefObject, useEffect, useState } from "react";

interface ISize {
  width: number;
  height: number;
}

/**
 *
 * useResizeObserver hook
 *
 * Returns a resize observer for a React Ref and fires a callback
 * https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @param {RefObject<HTMLElement | null>} ref React ref on which resizes are to be observed
 * @param {() => void} callback Function that needs to be fired on resize
 */
function useResizeObserver(ref: RefObject<HTMLElement | null>): ISize {
  const [size, setSize] = useState<ISize>({ height: 0, width: 0 });

  useEffect(() => {
    if (ref.current) {
      // Create an observer instance that will update the state on size change
      const observer = new ResizeObserver(([refElement]) => {
        const { height = 0, width = 0 } = refElement?.contentRect || {};
        if (size.height !== height || size.width !== width)
          setSize({ height, width });
      });

      // Start observing the target node for resizes
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [ref, size.height, size.width]);

  return size;
}

export default useResizeObserver;
