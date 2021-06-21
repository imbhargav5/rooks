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
    // Create an observer instance that will update the state on size change
    // Start observing the target node for resizes
    const observer = new ResizeObserver(() => {
      if (!ref.current) return;

      const height = ref.current.clientHeight;
      const width = ref.current.clientWidth;
      if (size.height !== height || size.width !== width)
        setSize(() => ({ height, width }));
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return size;
}

export { useResizeObserver };
