import { useRef, useEffect } from "react";

/**
 * usePreviousDifferent hook for React
 * It returns the past value which was different from the current one.
 *
 * @param currentValue The value whose previously different value is to be tracked
 * @returns The previous value
 * @see https://rooks.vercel.app/docs/hooks/usePreviousDifferent
 */
function usePreviousDifferent<T>(currentValue: T): T | null {
  const previousRef = useRef<T | null>(null);
  const previousRef2 = useRef<T | null>(null);

  useEffect(() => {
    previousRef2.current = previousRef.current;
    previousRef.current = currentValue;
  }, [currentValue]);

  return currentValue === previousRef.current
    ? previousRef2.current
    : previousRef.current;
}

export { usePreviousDifferent };
