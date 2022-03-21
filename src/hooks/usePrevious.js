"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrevious = void 0;
var react_1 = require("react");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
/**
 * usePrevious hook for React
 *
 * @param currentValue The value whose previous value is to be tracked
 * @returns The previous value
 */
function usePrevious(currentValue) {
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "usePrevious is deprecated, it will be removed in rooks v7. Please use usePreviousImmediate instead."
  );
  var previousRef = (0, react_1.useRef)(null);
  (0, react_1.useEffect)(
    function () {
      previousRef.current = currentValue;
    },
    [currentValue]
  );
  return previousRef.current;
}
exports.usePrevious = usePrevious;
