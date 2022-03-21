"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForkRef = void 0;
var react_1 = require("react");
/**
 * Credit to material-ui for this snippet
 */
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
/**
 * useForkRef
 * Joins refs together and returns a combination of the two as a new ref
 *
 * @param refA
 * @param refB
 */
function useForkRef(refA, refB) {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return (0, react_1.useMemo)(
    function () {
      if (refA == null && refB == null) {
        return null;
      }
      return function (refValue) {
        setRef(refA, refValue);
        setRef(refB, refValue);
      };
    },
    [refA, refB]
  );
}
exports.useForkRef = useForkRef;
