import { useRef, useEffect } from "react";
import { warning } from "./warning";

/**
 * usePreviousImmediate hook for React
 *
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 */
function usePreviousImmediate<T>(currentValue: T): T | null {
  warning(
    false,
    "usePreviousImmediate is deprecated, it will be removed in rooks v7. Please use usePrevious instead."
  );
  const previousRef = useRef<T | null>(null);

  useEffect(() => {
    previousRef.current = currentValue;
  });

  return previousRef.current;
}

export { usePreviousImmediate };
