import { useState, useEffect } from "react";
import useDidUpdate from "@rooks/use-did-update";

/**
 *
 * usePrevious hook for React
 * @param {*} currentValue The value whose previous value is to be tracked
 * @returns {*} The previous value
 */
function usePrevious(currentValue) {
  const [curr, setCurr] = useState(currentValue);
  const [prev, setPrev] = useState(null);
  useDidUpdate(() => {
    setPrev(curr);
    setCurr(currentValue);
  }, [currentValue]);
  return prev;
}

export default usePrevious;
