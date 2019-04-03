// See also: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, intervalDuration, startImmediate = false) {
  const [intervalId, setIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(startImmediate);
  const savedCallback = useRef();

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
      savedCallback.current();
    }
    if (intervalDuration !== null && isRunning) {
      let id = setInterval(tick, intervalDuration);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [intervalDuration, isRunning]);

  return {
    start,
    stop,
    intervalId
  };
}

export default useInterval;
