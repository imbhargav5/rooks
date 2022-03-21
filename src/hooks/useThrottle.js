"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThrottle = void 0;
var react_1 = require("react");
/**
 * useThrottle
 * Throttles a function with a timeout and ensures
 * that the callback function runs at most once in that duration
 *
 * @param fn The callback to throttle
 * @param timeout Throttle timeout
 */
function useThrottle(function_, timeout) {
  if (timeout === void 0) {
    timeout = 300;
  }
  var _a = (0, react_1.useState)(true),
    ready = _a[0],
    setReady = _a[1];
  var timerRef = (0, react_1.useRef)(undefined);
  if (!function_ || typeof function_ !== "function") {
    throw new Error(
      "As a first argument, you need to pass a function to useThrottle hook."
    );
  }
  var throttledFunction = (0, react_1.useCallback)(
    function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (!ready) {
        return;
      }
      setReady(false);
      function_.apply(void 0, args);
    },
    [ready, function_]
  );
  (0, react_1.useEffect)(
    function () {
      if (typeof window !== "undefined") {
        if (!ready) {
          timerRef.current = window.setTimeout(function () {
            setReady(true);
          }, timeout);
          return function () {
            return window.clearTimeout(timerRef.current);
          };
        }
      } else {
        console.warn("useThrottle: window is undefined.");
      }
    },
    [ready, timeout]
  );
  return [throttledFunction, ready];
}
exports.useThrottle = useThrottle;
