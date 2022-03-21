"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable jest/no-disabled-tests */
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var react_1 = __importDefault(require("react"));
require("@testing-library/jest-dom/extend-expect");
var useMouse_1 = require("../hooks/useMouse");
function TestMouse() {
  var mouse = (0, useMouse_1.useMouse)();
  return react_1.default.createElement("div", null, JSON.stringify(mouse));
}
describe.skip("useMouse", function () {
  afterEach(react_hooks_1.cleanup);
  it("should be defined", function () {
    expect(useMouse_1.useMouse).toBeDefined();
  });
  it("should default with null values", function () {
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useMouse_1.useMouse)();
    }).result;
    expect(result.current).toBe({
      x: null,
      screenX: null,
      y: null,
      pageX: null,
      screenY: null,
      clientX: null,
      pageY: null,
      clientY: null,
      movementX: null,
      movementY: null,
      offsetX: null,
      offsetY: null,
    });
  });
  it("should update client position when mouse is moved", function () {
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useMouse_1.useMouse)();
    }).result;
    var expected =
      '{"screenX":0,"screenY":0,"clientX":80,"clientY":20,"x":0,"y":0}';
    // fireEvent.mouseMove(document, { clientX: 80, clientY: 20 });
    // expect(getByText(expected)).toBeInTheDocument()
  });
  it("should update screen position when mouse is moved", function () {
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useMouse_1.useMouse)();
    }).result;
    var expected =
      '{"screenX":80,"screenY":20,"clientX":0,"clientY":0,"x":80,"y":20}';
    // fireEvent.mouseMove(document, { screenX: 80, screenY: 20 });
    // expect(getByText(expected)).toBeInTheDocument()
  });
});
