import { useRef, useEffect } from 'react';

/**
 * usePrevious hook for React
 *
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 */
function usePrevious<T>(currentValue: T): T | null {
  const previousRef = useRef<T | null>(null);

  useEffect(() => {
    previousRef.current = currentValue;
  }, [currentValue]);

  return previousRef.current;
}

export { usePrevious };
