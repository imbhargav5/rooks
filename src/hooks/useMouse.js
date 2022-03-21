"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMouse = void 0;
var react_1 = require("react");
var initialMouseState = {
  clientX: null,
  clientY: null,
  movementX: null,
  movementY: null,
  offsetX: null,
  offsetY: null,
  pageX: null,
  pageY: null,
  screenX: null,
  screenY: null,
  x: null,
  // eslint-disable-next-line id-length
  y: null,
};
function getMousePositionFromEvent(event) {
  var screenX = event.screenX,
    screenY = event.screenY,
    movementX = event.movementX,
    movementY = event.movementY,
    pageX = event.pageX,
    pageY = event.pageY,
    clientX = event.clientX,
    clientY = event.clientY,
    offsetX = event.offsetX,
    offsetY = event.offsetY;
  return {
    clientX: clientX,
    clientY: clientY,
    movementX: movementX,
    movementY: movementY,
    offsetX: offsetX,
    offsetY: offsetY,
    pageX: pageX,
    pageY: pageY,
    screenX: screenX,
    screenY: screenY,
    x: screenX,
    // eslint-disable-next-line id-length
    y: screenY,
  };
}
/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
 */
function useMouse() {
  var _a = (0, react_1.useState)(initialMouseState),
    mousePosition = _a[0],
    setMousePosition = _a[1];
  function updateMousePosition(event) {
    setMousePosition(getMousePositionFromEvent(event));
  }
  (0, react_1.useEffect)(function () {
    document.addEventListener("mousemove", updateMousePosition);
    return function () {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mousePosition;
}
exports.useMouse = useMouse;
