"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreviousDifferent = void 0;
var react_1 = require("react");
/**
 * usePreviousDifferent hook for React
 * It returns the past value which was different from the current one.
 *
 * @param currentValue The value whose previously different value is to be tracked
 * @returns The previous value
 */
function usePreviousDifferent(currentValue) {
  var previousRef = (0, react_1.useRef)(null);
  var previousRef2 = (0, react_1.useRef)(null);
  (0, react_1.useEffect)(
    function () {
      previousRef2.current = previousRef.current;
      previousRef.current = currentValue;
    },
    [currentValue]
  );
  return currentValue === previousRef.current
    ? previousRef2.current
    : previousRef.current;
}
exports.usePreviousDifferent = usePreviousDifferent;
