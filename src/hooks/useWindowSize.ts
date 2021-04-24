import { useState, useEffect } from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';

type WindowDimensions = {
  innerWidth: number | null;
  innerHeight: number | null;
  outerWidth: number | null;
  outerHeight: number | null;
};

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
 */
export function useWindowSize(): WindowDimensions {
  const [windowSize, setWindowSize] = useState<WindowDimensions>(() => {
    if (typeof window !== 'undefined') {
      return getDimensions();
    } else {
      return nullDimensions;
    }
  });

  // set resize handler once on mount and clean before unmount
  useIsomorphicEffect(() => {
    function onResize() {
      setWindowSize(getDimensions());
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return windowSize;
}
