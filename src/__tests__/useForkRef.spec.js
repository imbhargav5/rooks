"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var useForkRef_1 = require("../hooks/useForkRef");
var useEventListenerRef_1 = require("../hooks/useEventListenerRef");
var react_2 = __importDefault(require("react"));
var act = react_test_renderer_1.default.act;
describe("useForkRef", function () {
  var mockCallback;
  var TestJSX;
  beforeEach(function () {
    mockCallback = jest.fn(function () {});
    TestJSX = function () {
      var mouseUpRef = (0, useEventListenerRef_1.useEventListenerRef)(
        "mouseup",
        mockCallback
      );
      var mouseDownRef = (0, useEventListenerRef_1.useEventListenerRef)(
        "mousedown",
        mockCallback
      );
      var ref = (0, useForkRef_1.useForkRef)(mouseUpRef, mouseDownRef);
      return react_2.default.createElement(
        "div",
        { "data-testid": "element", ref: ref },
        "Click me"
      );
    };
  });
  it("should be defined", function () {
    expect(useForkRef_1.useForkRef).toBeDefined();
  });
  it("should be called on mouse events", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(TestJSX, null)
    ).container;
    var displayElement = (0, react_1.getByTestId)(container, "element");
    act(function () {
      react_1.fireEvent.mouseUp(displayElement);
      react_1.fireEvent.mouseDown(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
