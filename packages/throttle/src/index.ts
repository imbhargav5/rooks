import { useState } from "react";

function useThrottle(fn: Function, timeout: number = 300) {
  const [ready, setState] = useState(true);

  if(!fn || typeof fn !== 'function') {
    throw new Error('As a first argument, you need to pass a function to useThrottle hook.')
  }
  return (...args) => {
    if (!ready) {
      return;
    }

    setState(false);
    fn(...args);

    setTimeout(() => {
      setState(true);
    }, timeout);
  };
}

module.exports = useThrottle;
