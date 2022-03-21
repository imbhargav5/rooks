"use strict";
// See also: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterval = void 0;
var react_1 = require("react");
var useWarningOnMountInDevelopment_1 = require("./useWarningOnMountInDevelopment");
/**
 *
 * useInterval hook
 *
 * Declaratively creates a setInterval to run a callback after a fixed
 * amount of time
 *
 *@param {funnction} callback - Callback to be fired
 *@param {number} intervalId - Interval duration in milliseconds after which the callback is to be fired
 *@param {boolean} startImmediate - Whether the interval should start immediately on initialise
 *@returns {IntervalHandler}
 */
function useInterval(callback, intervalDuration, startImmediate) {
  if (startImmediate === void 0) {
    startImmediate = false;
  }
  (0, useWarningOnMountInDevelopment_1.useWarningOnMountInDevelopment)(
    "useInterval is deprecated, it will be removed in rooks v7. Please use useIntervalWhen instead."
  );
  var internalIdRef = (0, react_1.useRef)(null);
  var _a = (0, react_1.useState)(startImmediate),
    isRunning = _a[0],
    setIsRunning = _a[1];
  var savedCallback = (0, react_1.useRef)();
  function start() {
    if (!isRunning) {
      setIsRunning(true);
    }
  }
  function stop() {
    if (isRunning) {
      setIsRunning(false);
    }
  }
  // Remember the latest callback.
  (0, react_1.useEffect)(function () {
    savedCallback.current = callback;
  });
  // Set up the interval.
  (0, react_1.useEffect)(
    function () {
      function tick() {
        savedCallback.current && savedCallback.current();
      }
      if (intervalDuration !== null && isRunning) {
        var id_1 = setInterval(tick, intervalDuration);
        internalIdRef.current = id_1;
        return function () {
          internalIdRef.current = null;
          clearInterval(id_1);
        };
      }
    },
    [intervalDuration, isRunning]
  );
  var handler;
  handler = [start, stop, internalIdRef.current];
  handler.start = start;
  handler.stop = stop;
  handler.intervalId = internalIdRef.current;
  return handler;
}
exports.useInterval = useInterval;
