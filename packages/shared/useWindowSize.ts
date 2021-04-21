import { useState, useEffect } from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';

interface WindowDimensions {
  innerWidth: number | null;
  innerHeight: number | null;
  outerWidth: number | null;
  outerHeight: number | null;
}

const nullDimensions: WindowDimensions = {
  innerWidth: null,
  innerHeight: null,
  outerWidth: null,
  outerHeight: null,
};

function getDimensions(): WindowDimensions {
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  };
}

/**
 * useWindowSize hook
 * A hook that provides information of the dimensions of the window
 * @return Dimensions of the window
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
