"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUndoState = void 0;
var react_1 = require("react");
var defaultOptions = { maxSize: 100 };
/**
 * useUndoState hook
 * Drop in replacement for useState hook but with undo functionality.
 *
 * @param {any} defaultValue
 * @param {UndoStateOptions} [{ maxSize }=defaultOptions]
 * @returns {[any, Function, Function]}
 */
var useUndoState = function (defaultValue, options) {
  var maxSize = Object.assign({}, defaultOptions, options).maxSize;
  var _a = (0, react_1.useState)([defaultValue]),
    value = _a[0],
    setValue = _a[1];
  var push = (0, react_1.useCallback)(
    function (setterOrValue) {
      return setValue(function (current) {
        var restValues =
          current.length >= maxSize ? current.slice(0, maxSize) : current;
        if (typeof setterOrValue === "function") {
          return __spreadArray([setterOrValue(current[0])], restValues, true);
        } else {
          return __spreadArray([setterOrValue], restValues, true);
        }
      });
    },
    [maxSize]
  );
  var undo = (0, react_1.useCallback)(function () {
    setValue(function (current) {
      if (current.length === 1) {
        return current;
      }
      var values = current.slice(1);
      return values;
    });
  }, []);
  return [value[0], push, undo];
};
exports.useUndoState = useUndoState;
