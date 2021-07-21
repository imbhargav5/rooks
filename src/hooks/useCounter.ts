import { useCallback, useState } from "react";

type CounterHandler = {
  value: number;
  increment: () => void;
  decrement: () => void;
  incrementBy: (amount: number) => void;
  decrementBy: (amount: number) => void;
  reset: () => void;
};

/**
 *
 * @typedef handler
 * @type {Object}
 * @property {number} value The value of the counter
 * @property {Function}  increment Increment counter value by 1
 * @property {Function} decrement Decrement counter value by 1
 * @property {Function} incrementBy Increment counter by incrAmount
 * @property {Function} decrementBy Decrement counter by decrAmount
 * @property {Function} reset Reset counter to initialValue
 */

/**
 * Counter hook
 *
 * @param {number} initialValue The initial value of the counter
 * @returns {handler} A handler to interact with the counter
 */
function useCounter(initialValue: number): CounterHandler {
  const [counter, setCounter] = useState(initialValue);
  /**
   * Increment counter by an amount
   *
   * @param {number} incrAmount
   */
  const incrementBy = useCallback((incrAmount: number) => {
    setCounter((currentCounter) => currentCounter + incrAmount);
  }, []);
  /**
   *
   * Decrement counter by an amount
   *
   * @param {*} decrAmount
   */
  const decrementBy = useCallback((decrAmount: number) => {
    incrementBy(-decrAmount);
  }, []);

  /**
   * Increment counter by 1
   */
  const increment = useCallback(() => {
    incrementBy(1);
  }, []);
  /**
   * Decrement counter by 1
   */
  const decrement = useCallback(() => {
    incrementBy(-1);
  }, []);
  /**
   * Reset counter to initial value
   */
  const reset = useCallback(() => {
    setCounter(initialValue);
  }, []);

  return {
    decrement,
    decrementBy,
    increment,
    incrementBy,
    reset,
    value: counter,
  };
}

export { useCounter };
