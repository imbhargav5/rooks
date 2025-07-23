import { useCallback, useState } from "react";

type CounterHandler = {
  decrement: () => void;
  decrementBy: (amount: number) => void;
  increment: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
  value: number;
};

/**
 *
 * @typedef handler
 * @type {object}
 * @property {number} value The value of the counter
 * @property {Function}  increment Increment counter value by 1
 * @property {Function} decrement Decrement counter value by 1
 * @property {Function} incrementBy Increment counter by incrAmount
 * @property {Function} decrementBy Decrement counter by decrAmount
 * @property {Function} reset Reset counter to initialValue
 * @see {@link https://rooks.vercel.app/docs/hooks/useCounter}
 */

/**
 * Counter hook
 *
 * @param {number} initialValue The initial value of the counter
 * @returns {handler} A handler to interact with the counter
 * @see https://rooks.vercel.app/docs/hooks/useCounter
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
  const decrementBy = useCallback(
    (decrAmount: number) => {
      incrementBy(-decrAmount);
    },
    [incrementBy]
  );

  /**
   * Increment counter by 1
   */
  const increment = useCallback(() => {
    incrementBy(1);
  }, [incrementBy]);
  /**
   * Decrement counter by 1
   */
  const decrement = useCallback(() => {
    incrementBy(-1);
  }, [incrementBy]);
  /**
   * Reset counter to initial value
   */
  const reset = useCallback(() => {
    setCounter(initialValue);
  }, [initialValue]);

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
