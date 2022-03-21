"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFreshRef = void 0;
var react_1 = require("react");
var useIsomorphicEffect_1 = require("./useIsomorphicEffect");
/**
 * useFreshRef
 *
 * @param value The value which needs to be fresh at all times. Probably
 * best used with functions
 * @param preferLayoutEffect Should the value be updated using a layout effect
 * or a passive effect. Defaults to false.
 * @returns A ref containing the fresh value
 */
function useFreshRef(value, preferLayoutEffect) {
  if (preferLayoutEffect === void 0) {
    preferLayoutEffect = false;
  }
  var useEffectToUse = preferLayoutEffect
    ? useIsomorphicEffect_1.useIsomorphicEffect
    : react_1.useEffect;
  var ref = (0, react_1.useRef)(value);
  useEffectToUse(function () {
    ref.current = value;
  });
  return ref;
}
exports.useFreshRef = useFreshRef;
