import { useRef, useEffect } from "react";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";

/**
 * usePrevious hook for React
 *
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 */
function usePrevious<T>(currentValue: T): T | null {
  useWarningOnMountInDevelopment(
    "usePrevious is deprecated, it will be removed in rooks v7. Please use usePreviousImmediate instead."
  );
  const previousRef = useRef<T | null>(null);

  useEffect(() => {
    previousRef.current = currentValue;
  }, [currentValue]);

  return previousRef.current;
}

export { usePrevious };
