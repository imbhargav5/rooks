// See also: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useState, useEffect, useRef } from "react";
import { useWarningOnMountInDevelopment } from "./useWarningOnMountInDevelopment";
import { noop } from "@/utils/noop";

type IntervalHandlerAsObject = {
  /**
   * IntervalId of the interval
   */
  intervalId: ReturnType<typeof setTimeout> | null;
  /**
   * Function to start the interval
   */
  start: () => void;
  /**
   * Function to stop the interval
   */
  stop: () => void;
};

type IntervalHandlerAsArray = Array<
  ReturnType<typeof setTimeout> | (() => void) | null
> & {
  0: () => void;
  1: () => void;
  2: ReturnType<typeof setTimeout> | null;
};

type IntervalHandler = IntervalHandlerAsArray & {};

/**
 *
 * useInterval hook
 *
 * Declaratively creates a setInterval to run a callback after a fixed
 * amount of time
 *
 *@param {Function} callback - Callback to be fired
 *@param {number} intervalId - Interval duration in milliseconds after which the callback is to be fired
 *@param {boolean} startImmediate - Whether the interval should start immediately on initialise
 *@returns {IntervalHandler}
 */
function useInterval(
  callback: () => void,
  intervalDuration: number | null,
  startImmediate: boolean = false
): IntervalHandler {
  useWarningOnMountInDevelopment(
    "useInterval is deprecated, it will be removed in rooks v7. Please use useIntervalWhen instead."
  );
  const internalIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRunning, setIsRunning] = useState(startImmediate);
  const savedCallback = useRef<() => void>();

  function start() {
    if (!isRunning) {
      setIsRunning(true);
    }
  }

  function stop() {
    if (isRunning) {
      setIsRunning(false);
    }
  }

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (intervalDuration !== null && isRunning) {
      const id = setInterval(tick, intervalDuration);
      internalIdRef.current = id;

      return () => {
        internalIdRef.current = null;
        clearInterval(id);
      };
    }

    return noop;
  }, [intervalDuration, isRunning]);

  let handler: unknown;
  (handler as IntervalHandlerAsArray) = [start, stop, internalIdRef.current];
  (handler as IntervalHandlerAsObject).start = start;
  (handler as IntervalHandlerAsObject).stop = stop;
  (handler as IntervalHandlerAsObject).intervalId = internalIdRef.current;

  return handler as IntervalHandlerAsArray & IntervalHandlerAsObject;
}

export { useInterval };
