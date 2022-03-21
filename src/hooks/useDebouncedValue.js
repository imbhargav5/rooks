"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebouncedValue = void 0;
var react_1 = require("react");
var useDebounce_1 = require("./useDebounce");
var useDidMount_1 = require("./useDidMount");
var useDidUpdate_1 = require("./useDidUpdate");
var defaultUseDebounceValueOptions = {
  initializeWithNull: false,
};
var useDebouncedValue = function (value, timeout, options) {
  if (options === void 0) {
    options = {};
  }
  var initializeWithNull = Object.assign(
    {},
    defaultUseDebounceValueOptions,
    options
  ).initializeWithNull;
  var _a = (0, react_1.useState)(initializeWithNull ? null : value),
    updatedValue = _a[0],
    setUpdatedValue = _a[1];
  var debouncedSetUpdatedValue = (0, useDebounce_1.useDebounce)(
    setUpdatedValue,
    timeout
  );
  (0, useDidMount_1.useDidMount)(function () {
    if (initializeWithNull) {
      debouncedSetUpdatedValue(value);
    }
  });
  (0, useDidUpdate_1.useDidUpdate)(
    function () {
      debouncedSetUpdatedValue(value);
    },
    [value]
  );
  // No need to add `debouncedSetUpdatedValue ` to dependencies as it is a ref.current.
  // returning both updatedValue and setUpdatedValue (not the debounced version) to instantly update this if  needed.
  return [updatedValue, setUpdatedValue];
};
exports.useDebouncedValue = useDebouncedValue;
