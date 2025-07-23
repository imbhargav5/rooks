import { useState } from "react";
import { useOnWindowResize } from "./useOnWindowResize";
import { useOnWindowScroll } from "./useOnWindowScroll";

type ScrollPosition = {
  scrollX: Window["scrollX"];
  scrollY: Window["scrollY"];
};

function computeScrollPosition(): ScrollPosition {
  if (typeof window === "undefined") {
    return {
      scrollX: 0,
      scrollY: 0,
    };
  } else {
    return {
      scrollX: window.scrollX || window.pageXOffset,
      scrollY: window.scrollY || window.pageYOffset,
    };
  }
}

/**
 *
 * useWindowScrollPosition hook
 * A React hook to get the scroll position of the window
 *
 * @returns an object containing scrollX and scrollY values
 * @see https://rooks.vercel.app/docs/hooks/useWindowScrollPosition
 */
function useWindowScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(
    computeScrollPosition
  );
  /**
   * Recalculate on scroll
   */
  useOnWindowScroll(
    () => {
      setScrollPosition(computeScrollPosition());
    },
    true,
    true
  );
  /**
   * Recalculate on resize
   */
  useOnWindowResize(
    () => {
      setScrollPosition(computeScrollPosition());
    },
    true,
    true
  );

  return scrollPosition;
}

export { useWindowScrollPosition };
