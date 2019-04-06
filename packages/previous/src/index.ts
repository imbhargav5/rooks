import { useState, useEffect } from "react";
import useDidUpdate from "@rooks/use-did-update/src";

/**
 *
 * usePrevious hook for React
 *
 * @param {*} currentValue The value whose previous value is to be tracked
 * @returns {*} The previous value
 */
function usePrevious<T>(currentValue: T): T | null {
  const [curr, setCurr] = useState<T>(currentValue);
  const [prev, setPrev] = useState<T | null>(null);
  useDidUpdate(() => {
    setPrev(curr);
    setCurr(currentValue);
  }, [currentValue]);

  return prev;
}

export default usePrevious;
