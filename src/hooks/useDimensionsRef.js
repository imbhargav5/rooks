"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDimensionsRef = void 0;
/* eslint-disable id-length */
/**
 *  Inspired from https://github.com/Swizec/useDimensions

 **/
var react_1 = require("react");
var useOnWindowResize_1 = require("./useOnWindowResize");
var useOnWindowScroll_1 = require("./useOnWindowScroll");
var getDimensionObject = function (node) {
  var rect = node.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.left,
    y: rect.top,
  };
};
var noWindowReturnValue = [undefined, null, null];
var useDimensionsRef = function (_a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.updateOnScroll,
    updateOnScroll = _c === void 0 ? true : _c,
    _d = _b.updateOnResize,
    updateOnResize = _d === void 0 ? true : _d;
  if (typeof window === "undefined") {
    console.warn("useDimensionsRef: window is undefined.");
    return noWindowReturnValue;
  }
  var _e = (0, react_1.useState)(null),
    dimensions = _e[0],
    setDimensions = _e[1];
  var _f = (0, react_1.useState)(null),
    node = _f[0],
    setNode = _f[1];
  var ref = (0, react_1.useCallback)(function (nodeFromCallback) {
    setNode(nodeFromCallback);
  }, []);
  var measure = (0, react_1.useCallback)(
    function () {
      window.requestAnimationFrame(function () {
        if (node) {
          setDimensions(getDimensionObject(node));
        }
      });
    },
    [node]
  );
  (0, react_1.useLayoutEffect)(
    function () {
      measure();
    },
    [measure]
  );
  (0, useOnWindowResize_1.useOnWindowResize)(
    function () {
      measure();
    },
    updateOnResize,
    true
  );
  (0, useOnWindowScroll_1.useOnWindowScroll)(
    function () {
      measure();
    },
    updateOnScroll,
    true
  );
  return [ref, dimensions, node];
};
exports.useDimensionsRef = useDimensionsRef;
