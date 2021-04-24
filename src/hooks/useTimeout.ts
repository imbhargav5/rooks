import { useState, useRef, useEffect } from 'react';

type UseTimeoutHandler = {
  start: () => any;
  clear: () => any;
  stop: () => any;
  isActive: boolean;
};

/**
 * A setTimeout hook that calls a callback after a timeout duration
 *
 * @param cb The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 */
function useTimeout(
  callback_: () => void,
  timeoutDelayMs: number = 0
): UseTimeoutHandler {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const savedRefCallback = useRef<() => any>();

  useEffect(() => {
    savedRefCallback.current = callback_;
  }, [callback_]);

  function callback() {
    savedRefCallback.current && savedRefCallback.current();
    clear();
  }

  function clear() {
    setIsTimeoutActive(false);
  }
  function start() {
    setIsTimeoutActive(true);
  }

  useEffect(() => {
    if (isTimeoutActive) {
      const timeout = window.setTimeout(callback, timeoutDelayMs);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [isTimeoutActive, timeoutDelayMs]);

  return {
    clear,
    isActive: isTimeoutActive,
    start,
    stop: clear,
  };
}

export { useTimeout };
