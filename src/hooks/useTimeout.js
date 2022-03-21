"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeout = void 0;
var react_1 = require("react");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
/**
 * A setTimeout hook that calls a callback after a timeout duration
 *
 * @param cb The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 */
function useTimeout(callback_, timeoutDelayMs) {
  if (timeoutDelayMs === void 0) {
    timeoutDelayMs = 0;
  }
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "useTimeout is deprecated, it will be removed in rooks v7. Please use useTimeoutWhen instead."
  );
  var _a = (0, react_1.useState)(false),
    isTimeoutActive = _a[0],
    setIsTimeoutActive = _a[1];
  var savedRefCallback = (0, react_1.useRef)();
  (0, react_1.useEffect)(
    function () {
      savedRefCallback.current = callback_;
    },
    [callback_]
  );
  function callback() {
    savedRefCallback.current && savedRefCallback.current();
    clear();
  }
  var clear = (0, react_1.useCallback)(function () {
    setIsTimeoutActive(false);
  }, []);
  var start = (0, react_1.useCallback)(function () {
    setIsTimeoutActive(true);
  }, []);
  (0, react_1.useEffect)(
    function () {
      if (isTimeoutActive) {
        if (typeof window !== "undefined") {
          var timeout_1 = window.setTimeout(callback, timeoutDelayMs);
          return function () {
            window.clearTimeout(timeout_1);
          };
        } else {
          console.warn("useTimeout: window is undefined.");
        }
      }
    },
    [isTimeoutActive, timeoutDelayMs]
  );
  return {
    clear: clear,
    isActive: isTimeoutActive,
    start: start,
    stop: clear,
  };
}
exports.useTimeout = useTimeout;
