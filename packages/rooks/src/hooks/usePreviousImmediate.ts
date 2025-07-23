import { useRef, useEffect } from "react";

/**
 * usePreviousImmediate hook for React
 *
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 * @see https://rooks.vercel.app/docs/hooks/usePreviousImmediate
 */
function usePreviousImmediate<T>(currentValue: T): T | null {
  const previousRef = useRef<T | null>(null);

  useEffect(() => {
    previousRef.current = currentValue;
  });

  return previousRef.current;
}

export { usePreviousImmediate };
