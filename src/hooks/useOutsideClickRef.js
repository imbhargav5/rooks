"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOutsideClickRef = void 0;
var react_1 = require("react");
/**
 * useOutsideClickRef hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns An array with first item being ref
 */
function useOutsideClickRef(handler, when) {
  if (when === void 0) {
    when = true;
  }
  var savedHandler = (0, react_1.useRef)(handler);
  var _a = (0, react_1.useState)(null),
    node = _a[0],
    setNode = _a[1];
  var memoizedCallback = (0, react_1.useCallback)(
    function (e) {
      if (node && !node.contains(e.target)) {
        savedHandler.current(e);
      }
    },
    [node]
  );
  (0, react_1.useEffect)(function () {
    savedHandler.current = handler;
  });
  var ref = (0, react_1.useCallback)(function (node) {
    setNode(node);
  }, []);
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
    [when, memoizedCallback]
  );
  return [ref];
}
exports.useOutsideClickRef = useOutsideClickRef;
