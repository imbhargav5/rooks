import { useState, useLayoutEffect } from "react";

function useTimeout(cb, timeoutDelayMs = 0) {
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

  function clear() {
    setIsTimeoutRunning(false);
  }
  function start() {
    setIsTimeoutRunning(true);
  }

  useLayoutEffect(
    () => {
      if (isTimeoutRunning) {
        const timeout = window.setTimeout(cb, timeoutDelayMs);
        return () => {
          window.clearTimeout(timeout);
        };
      }
    },
    [isTimeoutRunning]
  );
  return {
    clear,
    start
  };
}

module.exports = useTimeout;
