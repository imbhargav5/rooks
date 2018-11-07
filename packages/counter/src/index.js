import { useState } from "react";

function useCounter(initialValue) {
  const [counter, setCounter] = useState(initialValue);

  function incrementBy(incrAmount) {
    setCounter(counter + incrAmount);
  }
  function decrementBy(decrAmount) {
    incrementBy(-decrAmount);
  }
  function increment() {
    setCounter(counter + 1);
  }
  function decrement() {
    incrementBy(-1);
  }
  function reset() {
    setCounter(initialValue);
  }
  return {
    value: counter,
    increment,
    decrement,
    incrementBy,
    decrementBy,
    reset
  };
}

module.exports = useCounter;
