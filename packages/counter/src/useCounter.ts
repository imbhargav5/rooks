import { useState } from "react";

interface CounterHandler {
  value: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  decrementBy: (amount: number) => void;
  reset: () => void;
}

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
function useCounter(initialValue: number): CounterHandler {
  const [counter, setCounter] = useState(initialValue);
  /**
   * Increment counter by an amount
   * @param {number} incrAmount
   */
  function incrementBy(incrAmount: number): void {
    setCounter(counter + incrAmount);
  }
  /**
   *
   * Decrement counter by an amount
   * @param {*} decrAmount
   */
  function decrementBy(decrAmount: number): void {
    incrementBy(-decrAmount);
  }

  /**
   * Increment counter by 1
   */
  function increment(): void {
    incrementBy(1);
  }
  /**
   * Decrement counter by 1
   */
  function decrement(): void {
    incrementBy(-1);
  }
  /**
   * Reset counter to initial value
   */
  function reset(): void {
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

export { useCounter };
