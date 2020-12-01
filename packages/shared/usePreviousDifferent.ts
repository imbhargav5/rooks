import { useRef, useEffect } from "react";

/**
 * usePreviousDifferent hook for React
 * @param currentValue The value whose previously different value is to be tracked
 * @returns The previous value
 */
function usePreviousDifferent<T>(currentValue: T): T | null {
  const prevRef = useRef<T | null>(null);

  useEffect(() => {
    prevRef.current = currentValue;
  }, [currentValue]);

  return prevRef.current;
}

export { usePreviousDifferent };
