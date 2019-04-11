// See also: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useState, useEffect, useRef } from "react";

interface IntervalHandler {
  /**
   * Function to start the interval
   */
  start: () => void;
  /**
   * Function to stop the interval
   */
  stop: () => void;
  /**
   * IntervalId of the interval
   */
  intervalId: NodeJS.Timeout | null;
}

/**
 *
 * useInterval hook
 *
 * Declaratively creates a setInterval to run a callback after a fixed
 * amount of time
 *
 *@param {funnction} callback - Callback to be fired
 *@param {number} intervalId - Interval duration in milliseconds after which the callback is to be fired
 *@param {boolean} startImmediate - Whether the interval should start immediately on initialise
 *@return {IntervalHandler}
 */
function useInterval(
  callback: () => any,
  intervalDuration: number,
  startImmediate: boolean = false
): IntervalHandler {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(startImmediate);
  const savedCallback = useRef<() => any>();

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
      savedCallback.current && savedCallback.current();
    }
    if (intervalDuration !== null && isRunning) {
      let id = setInterval(tick, intervalDuration);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [intervalDuration, isRunning]);

  const handler: IntervalHandler = {
    start,
    stop,
    intervalId
  };

  return handler;
}

export { useInterval };
