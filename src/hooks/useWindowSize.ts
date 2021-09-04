import { useState, useEffect } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

type WindowDimensions = Pick<
  Window,
  "innerWidth" | "innerHeight" | "outerWidth" | "outerHeight"
>;

const defaultDimensions: WindowDimensions = {
  innerHeight: 0,
  innerWidth: 0,
  outerHeight: 0,
  outerWidth: 0,
};

function getDimensions(): WindowDimensions {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

/**
 * useWindowSize hook
 * A hook that provides information of the dimensions of the window
 *
 * @returns Dimensions of the window
 */
export function useWindowSize(): WindowDimensions {
  const [windowSize, setWindowSize] = useState<WindowDimensions>(() => {
    if (typeof window !== "undefined") {
      return getDimensions();
    } else {
      return defaultDimensions;
    }
  });

  // set resize handler once on mount and clean before unmount
  useIsomorphicEffect(() => {
    function onResize() {
      setWindowSize(getDimensions());
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return windowSize;
}
