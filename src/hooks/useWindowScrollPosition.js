"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowScrollPosition = void 0;
var react_1 = require("react");
var useOnWindowResize_1 = require("./useOnWindowResize");
var useOnWindowScroll_1 = require("./useOnWindowScroll");
function getScrollPosition() {
  if (typeof window !== "undefined") {
    return {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    };
  } else {
    return {
      scrollX: 0,
      scrollY: 0,
    };
  }
}
/**
 *
 * useWindowScrollPosition hook
 * A React hook to get the scroll position of the window
 *
 * @returns an object containing scrollX and scrollY values
 */
function useWindowScrollPosition() {
  var _a = (0, react_1.useState)(getScrollPosition),
    scrollPosition = _a[0],
    setScrollPosition = _a[1];
  /**
   * Recalculate on scroll
   */
  (0, useOnWindowScroll_1.useOnWindowScroll)(
    function () {
      setScrollPosition(getScrollPosition());
    },
    true,
    true
  );
  /**
   * Recalculate on resize
   */
  (0, useOnWindowResize_1.useOnWindowResize)(
    function () {
      setScrollPosition(getScrollPosition());
    },
    true,
    true
  );
  return scrollPosition;
}
exports.useWindowScrollPosition = useWindowScrollPosition;
