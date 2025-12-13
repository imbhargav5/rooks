import { useCallback, useRef, useSyncExternalStore } from "react";
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
  const cacheRef = useRef<WindowDimensions>(nullDimensions);

  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => {
      window.removeEventListener("resize", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    const newDimensions = getDimensions();
    // Only update cache if values changed to maintain referential equality
    if (
      cacheRef.current.innerHeight !== newDimensions.innerHeight ||
      cacheRef.current.innerWidth !== newDimensions.innerWidth ||
      cacheRef.current.outerHeight !== newDimensions.outerHeight ||
      cacheRef.current.outerWidth !== newDimensions.outerWidth
    ) {
      cacheRef.current = newDimensions;
    }
    return cacheRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return nullDimensions;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
