import { useRef, useEffect } from "react";

/**
 *
 * usePrevious hook for React
 *
 * @param {*} currentValue The value whose previous value is to be tracked
 * @returns {*} The previous value
 */
function usePrevious<T>(currentValue: T): T | null {
  const prevRef = useRef<T | null>(null);

  useEffect(() => {
    prevRef.current = currentValue;
  }, [currentValue]);

  return prevRef.current;
}

export default usePrevious;
