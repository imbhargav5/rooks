import { useState, useEffect } from "react";

function useThrottle(fn: Function, timeout: number = 300) {
  const [ready, setState] = useState(true);
  let timer = null;

  if(!fn || typeof fn !== 'function') {
    throw new Error('As a first argument, you need to pass a function to useThrottle hook.')
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [])

  return (...args) => {
    if (!ready) {
      return;
    }

    setState(false);
    fn(...args);

    timer = setTimeout(() => {
      setState(true);
    }, timeout);
  };
}

module.exports = useThrottle;
