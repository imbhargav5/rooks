import { useState } from "react";

/**
 *
 * @typedef handler
 * @type {Object}
 * @property {number} value The value of the counter
 * @property {function}  increment Increment counter value by 1
 * @property {function} decrement Decrement counter value by 1
 * @property {function} incrementBy Increment counter by incrAmount
 * @property {function} decrementBy Decrement counter by decrAmount
 * @property {function} reset Reset counter to initialValue
 */

/**
 * Counter hook
 * @param {number} initialValue The initial value of the counter
 * @returns {handler} A handler to interact with the counter
 */
function useCounter(initialValue) {
  const [counter, setCounter] = useState(initialValue);
  /**
   * Increment counter by an amount
   * @param {number} incrAmount
   */
  function incrementBy(incrAmount) {
    setCounter(counter + incrAmount);
  }
  /**
   *
   * Decrement counter by an amount
   * @param {*} decrAmount
   */
  function decrementBy(decrAmount) {
    incrementBy(-decrAmount);
  }

  /**
   * Increment counter by 1
   */
  function increment() {
    incrementBy(1);
  }
  /**
   * Decrement counter by 1
   */
  function decrement() {
    incrementBy(-1);
  }
  /**
   * Reset counter to initial value
   */
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

export default useCounter;
