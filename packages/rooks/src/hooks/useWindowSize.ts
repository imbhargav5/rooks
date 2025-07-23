import { useState, useCallback } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import type { DeepNullable } from "@/types/utils";

type WindowDimensions = DeepNullable<
  Pick<Window, "innerHeight" | "innerWidth" | "outerHeight" | "outerWidth">
>;

const nullDimensions: WindowDimensions = {
  innerHeight: null,
  innerWidth: null,
  outerHeight: null,
  outerWidth: null,
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
 * @see https://rooks.vercel.app/docs/hooks/useWindowSize
 */
export function useWindowSize(): WindowDimensions {
  const [windowSize, setWindowSize] = useState<WindowDimensions>(() => {
    if (typeof window === "undefined") {
      return nullDimensions;
    } else {
      return getDimensions();
    }
  });


  // set resize handler once on mount and clean before unmount
  useIsomorphicEffect(() => {
    if (typeof window === "undefined") {
      return () => { };
    } else {
      function handleResize() {
        setWindowSize(getDimensions());
      }
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return windowSize;
}
