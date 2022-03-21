"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOutsideClick = void 0;
var react_1 = require("react");
/**
 *  useOutsideClick hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param ref Ref whose outside click needs to be listened to
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 */
function useOutsideClick(ref, handler, when) {
  if (when === void 0) {
    when = true;
  }
  var savedHandler = (0, react_1.useRef)(handler);
  var memoizedCallback = (0, react_1.useCallback)(function (e) {
    if (ref && ref.current && !ref.current.contains(e.target)) {
      savedHandler.current(e);
    }
  }, []);
  (0, react_1.useEffect)(function () {
    savedHandler.current = handler;
  });
  (0, react_1.useEffect)(
    function () {
      if (when) {
        document.addEventListener("click", memoizedCallback, true);
        document.addEventListener("ontouchstart", memoizedCallback, true);
        return function () {
          document.removeEventListener("click", memoizedCallback, true);
          document.removeEventListener("ontouchstart", memoizedCallback, true);
        };
      }
    },
    [ref, handler, when]
  );
}
exports.useOutsideClick = useOutsideClick;
