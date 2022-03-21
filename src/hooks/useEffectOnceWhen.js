"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffectOnceWhen = void 0;
var react_1 = require("react");
/**
 * useEffectOnceWhen hook
 *
 * It fires a callback once when a condition is true or become true.
 * Fires the callback at most one time.
 *
 * @param callback The callback to fire
 * @param when The condition which needs to be true
 */
function useEffectOnceWhen(callback, when) {
  if (when === void 0) {
    when = true;
  }
  var hasRunOnceRef = (0, react_1.useRef)(false);
  var callbackRef = (0, react_1.useRef)(callback);
  (0, react_1.useEffect)(function () {
    callbackRef.current = callback;
  });
  (0, react_1.useEffect)(
    function () {
      if (when && !hasRunOnceRef.current) {
        callbackRef.current();
        hasRunOnceRef.current = true;
      }
    },
    [when]
  );
}
exports.useEffectOnceWhen = useEffectOnceWhen;
