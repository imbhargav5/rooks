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
exports.useMergeRefs = void 0;
var react_1 = require("react");
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
/**
 * useMergeRefs
 * Merges multiple refs into a single function ref.
 * Takes any number of refs.
 * Refs can be mutable refs or function refs.
 *
 * @param refs
 */
function useMergeReferences() {
  var references = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    references[_i] = arguments[_i];
  }
  return (0, react_1.useMemo)(function () {
    if (
      references.every(function (ref) {
        return ref === null;
      })
    ) {
      return null;
    }
    return function (refValue) {
      references.forEach(function (ref) {
        setRef(ref, refValue);
      });
    };
  }, __spreadArray([], references, true));
}
exports.useMergeRefs = useMergeReferences;
