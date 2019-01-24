import { useState, v } from "react";
import useDidMount from "@rooks/use-did-mount";

/**
 *
 * usePrevious hook for React
 * @param {*} currentValue The value whose previous value is to be tracked
 * @returns {*} The previous value
 */
function usePrevious(currentValue) {
  const [curr, setCurr] = useState(currentValue);
  const [prev, setPrev] = useState(undefined);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(
    () => {
      if (hasMounted) {
        setPrev(curr);
        setCurr(currentValue);
      }
    },
    [currentValue]
  );
  useDidMount(() => {
    setHasMounted(true);
  });
  return prev;
}

module.exports = usePrevious;
