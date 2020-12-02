import { useRef, useEffect } from "react";

/**
 * usePreviousDifferent hook for React
 * It returns the past value which was different from the current one.
 * @param currentValue The value whose previously different value is to be tracked
 * @returns The previous value
 */
function usePreviousDifferent<T>(currentValue: T): T | null {
  const prevRef = useRef<T | null>(null);
  const prevRef2 = useRef<T | null>(null);

  useEffect(() => {
    prevRef2.current = prevRef.current;
    prevRef.current = currentValue;
  }, [currentValue]);

  return currentValue === prevRef.current ? prevRef2.current: prevRef.current;
}

export { usePreviousDifferent };
