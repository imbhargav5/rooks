import { useState, useEffect } from "react";

interface WindowDimensions {
  innerWidth: number | null;
  innerHeight: number | null;
  outerWidth: number | null;
  outerHeight: number | null;
}

const initialValue: WindowDimensions = {
  innerWidth: null,
  innerHeight: null,
  outerWidth: null,
  outerHeight: null
};

/**
 * useWindowSize
 *
 * A hook that provides information of the dimensions of the window
 *
 * @return {WindowDimensions}  Dimensions of the window
 */
export function useWindowSize(): WindowDimensions {
  const [windowSize, setWindowSize] = useState<WindowDimensions>(initialValue);

  function fetchWindowDimensionsAndSave() {
    setWindowSize({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    });
  }

  // run on mount
  useEffect(() => {
    // run only once
    fetchWindowDimensionsAndSave();
  }, []);

  // set resize handler once on mount and clean before unmount
  useEffect(() => {
    window.addEventListener("resize", fetchWindowDimensionsAndSave);
    return () => {
      window.removeEventListener("resize", fetchWindowDimensionsAndSave);
    };
  }, []);

  return windowSize;
}
