import { useState, useLayoutEffect, useRef, useEffect } from "react";

interface UseTimeoutHandler {
  start: () => any;
  clear: () => any;
  stop: () => any;
  isActive: boolean;
}

function useTimeout(
  cb: () => void,
  timeoutDelayMs: number = 0
): UseTimeoutHandler {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const savedRefCallback = useRef<() => any>();

  useEffect(() => {
    savedRefCallback.current = cb;
  }, [cb]);

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

  useLayoutEffect(() => {
    if (isTimeoutActive) {
      const timeout = window.setTimeout(callback, timeoutDelayMs);
      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [isTimeoutActive]);
  return {
    clear,
    start,
    stop: clear,
    isActive: isTimeoutActive
  };
}

export default useTimeout;
