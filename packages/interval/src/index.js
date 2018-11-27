import { useState, useEffect } from "react";

function useInterval(cb, intervalDuration, startImmediate = false) {
  const [intervalId, setIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(startImmediate);

  function start() {
    setIsRunning(true);
  }
  function stop() {
    if (isRunning) {
      setIsRunning(false);
    }
  }

  useEffect(
    () => {
      if (isRunning) {
        const _intervalId = setInterval(cb, intervalDuration);
        setIntervalId(_intervalId);
        return () => {
          clearInterval(_intervalId);
        };
      }
    },
    [isRunning]
  );

  return {
    start,
    stop,
    intervalId
  };
}

module.exports = useInterval;
