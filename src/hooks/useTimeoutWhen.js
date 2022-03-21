"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeoutWhen = void 0;
var react_1 = require("react");
/**
 * A setTimeout hook that calls a callback after a timeout duration
 * when a condition is true
 *
 * @param cb The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the timeout
 */
function useTimeoutWhen(callback_, timeoutDelayMs, when) {
  if (timeoutDelayMs === void 0) {
    timeoutDelayMs = 0;
  }
  if (when === void 0) {
    when = true;
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
      if (when) {
        if (typeof window !== "undefined") {
          var timeout_1 = window.setTimeout(callback, timeoutDelayMs);
          return function () {
            window.clearTimeout(timeout_1);
          };
        } else {
          console.warn("useTimeoutWhen: window is undefined.");
        }
      }
    },
    [when]
  );
}
exports.useTimeoutWhen = useTimeoutWhen;
