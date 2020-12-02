import { useRef, useEffect } from "react";

/**
 * usePreviousImmediate hook for React
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 */
function usePreviousImmediate<T>(currentValue: T): T | null {
  const prevRef = useRef<T | null>(null);

  useEffect(() => {
    prevRef.current = currentValue;
  });

  return prevRef.current;
}

export { usePreviousImmediate };
