"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToggle = void 0;
var react_1 = require("react");
var defaultToggleFunction = function (v) {
  return !v;
};
/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 */
function useToggle(initialValue, toggleFunction) {
  if (initialValue === void 0) {
    initialValue = false;
  }
  if (toggleFunction === void 0) {
    toggleFunction = defaultToggleFunction;
  }
  return (0, react_1.useReducer)(toggleFunction, initialValue);
}
exports.useToggle = useToggle;
