"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntervalWhen = void 0;
var react_1 = require("react");
/**
 * A setInterval hook that calls a callback after a interval duration
 * when a condition is true
 *
 * @param cb The callback to be invoked after interval
 * @param intervalDurationMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the interval
 * @param startImmediate If the callback should be invoked immediately
 */
function useIntervalWhen(callback_, intervalDurationMs, when, startImmediate) {
  if (intervalDurationMs === void 0) {
    intervalDurationMs = 0;
  }
  if (when === void 0) {
    when = true;
  }
  if (startImmediate === void 0) {
    startImmediate = false;
  }
  var savedRefCallback = (0, react_1.useRef)();
  (0, react_1.useEffect)(function () {
    savedRefCallback.current = callback_;
  });
  function callback() {
    savedRefCallback.current && savedRefCallback.current();
  }
  (0, react_1.useEffect)(
    function () {
      if (typeof window !== "undefined") {
        if (when) {
          if (startImmediate) {
            callback();
          }
          var interval_1 = window.setInterval(callback, intervalDurationMs);
          return function () {
            window.clearInterval(interval_1);
          };
        }
      } else {
        console.warn("useIntervalWhen: window is undefined.");
      }
    },
    [when, intervalDurationMs]
  );
}
exports.useIntervalWhen = useIntervalWhen;
