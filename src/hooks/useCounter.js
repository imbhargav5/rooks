"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCounter = void 0;
var react_1 = require("react");
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
function useCounter(initialValue) {
  var _a = (0, react_1.useState)(initialValue),
    counter = _a[0],
    setCounter = _a[1];
  /**
   * Increment counter by an amount
   *
   * @param {number} incrAmount
   */
  var incrementBy = (0, react_1.useCallback)(function (incrAmount) {
    setCounter(function (currentCounter) {
      return currentCounter + incrAmount;
    });
  }, []);
  /**
   *
   * Decrement counter by an amount
   *
   * @param {*} decrAmount
   */
  var decrementBy = (0, react_1.useCallback)(function (decrAmount) {
    incrementBy(-decrAmount);
  }, []);
  /**
   * Increment counter by 1
   */
  var increment = (0, react_1.useCallback)(function () {
    incrementBy(1);
  }, []);
  /**
   * Decrement counter by 1
   */
  var decrement = (0, react_1.useCallback)(function () {
    incrementBy(-1);
  }, []);
  /**
   * Reset counter to initial value
   */
  var reset = (0, react_1.useCallback)(function () {
    setCounter(initialValue);
  }, []);
  return {
    decrement: decrement,
    decrementBy: decrementBy,
    increment: increment,
    incrementBy: incrementBy,
    reset: reset,
    value: counter,
  };
}
exports.useCounter = useCounter;
