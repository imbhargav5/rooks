"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowSize = void 0;
var react_1 = require("react");
var useIsomorphicEffect_1 = require("./useIsomorphicEffect");
var nullDimensions = {
  innerHeight: null,
  innerWidth: null,
  outerHeight: null,
  outerWidth: null,
};
function getDimensions() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}
/**
 * useWindowSize hook
 * A hook that provides information of the dimensions of the window
 *
 * @returns Dimensions of the window
 */
function useWindowSize() {
  var _a = (0, react_1.useState)(function () {
      if (typeof window !== "undefined") {
        return getDimensions();
      } else {
        return nullDimensions;
      }
    }),
    windowSize = _a[0],
    setWindowSize = _a[1];
  // set resize handler once on mount and clean before unmount
  (0, useIsomorphicEffect_1.useIsomorphicEffect)(function () {
    function onResize() {
      setWindowSize(getDimensions());
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
      return function () {
        window.removeEventListener("resize", onResize);
      };
    } else {
      console.warn("useWindowSize: window is undefined.");
    }
  }, []);
  return windowSize;
}
exports.useWindowSize = useWindowSize;
