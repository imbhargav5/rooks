"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInput = void 0;
var react_1 = require("react");
var defaultOptions = {};
/**
 *
 * useInput Hook
 *
 * Handles an input's value and onChange props internally to
 * make text input creation process easier
 *
 * @param {any} [initialValue=""] Initial value of the input
 * @param {Options} [opts={}] Options object
 * @returns {InputHandler} Input handler with value and onChange
 */
function useInput(initialValue, options) {
  if (initialValue === void 0) {
    initialValue = "";
  }
  if (options === void 0) {
    options = defaultOptions;
  }
  var _a = (0, react_1.useState)(initialValue),
    value = _a[0],
    setValue = _a[1];
  var onChange = (0, react_1.useCallback)(
    function (e) {
      var newValue = e.target.value;
      var shouldUpdate = true;
      if (typeof options.validate === "function") {
        shouldUpdate = options.validate(newValue, value);
      }
      if (shouldUpdate) {
        setValue(newValue);
      }
    },
    [value]
  );
  // sync with default value
  (0, react_1.useEffect)(
    function () {
      setValue(initialValue);
    },
    [initialValue]
  );
  var handler = {
    onChange: onChange,
    value: value,
  };
  return handler;
}
exports.useInput = useInput;
