"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsomorphicEffect = void 0;
var react_1 = require("react");
/**
 * useIsomorphicEffect
 * Resolves to useEffect when "window" is not in scope and useLayout effect in the browser
 *
 * @param {Function} callback Callback function to be called on mount
 */
var useIsomorphicEffect =
  typeof window === "undefined" ? react_1.useEffect : react_1.useLayoutEffect;
exports.useIsomorphicEffect = useIsomorphicEffect;
