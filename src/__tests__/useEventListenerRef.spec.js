"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var react_hooks_1 = require("@testing-library/react-hooks");
var react_2 = __importDefault(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var useCounter_1 = require("../hooks/useCounter");
var useEventListenerRef_1 = require("../hooks/useEventListenerRef");
var act = react_test_renderer_1.default.act;
describe("useEventListenerRef", function () {
  it("should be defined", function () {
    expect(useEventListenerRef_1.useEventListenerRef).toBeDefined();
  });
  it("should return a callback ref", function () {
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0,
      useEventListenerRef_1.useEventListenerRef)("click", function () {
        console.log("clicked");
      });
    }).result;
    expect(typeof result.current).toBe("function");
  });
});
describe("useEventListenerRef jsx", function () {
  var mockCallback;
  var TestJSX;
  beforeEach(function () {
    mockCallback = jest.fn(function () {});
    TestJSX = function () {
      var ref = (0, useEventListenerRef_1.useEventListenerRef)(
        "click",
        mockCallback
      );
      return react_2.default.createElement(
        "div",
        { "data-testid": "element", ref: ref },
        "Click me"
      );
    };
  });
  it("should not call callback by default", function () {
    (0, react_1.render)(react_2.default.createElement(TestJSX, null));
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
  it("should not call callback when event fires", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(TestJSX, null)
    ).container;
    var displayElement = (0, react_1.getByTestId)(container, "element");
    act(function () {
      react_1.fireEvent.click(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    act(function () {
      react_1.fireEvent.click(displayElement);
      react_1.fireEvent.click(displayElement);
      react_1.fireEvent.click(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});
describe("useEventListenerRef state variables", function () {
  var mockCallback;
  var TestJSX;
  beforeEach(function () {
    mockCallback = jest.fn(function () {});
    TestJSX = function () {
      var _a = (0, useCounter_1.useCounter)(0),
        increment = _a.increment,
        value = _a.value;
      var ref = (0, useEventListenerRef_1.useEventListenerRef)(
        "click",
        increment
      );
      return react_2.default.createElement(
        react_2.default.Fragment,
        null,
        react_2.default.createElement(
          "div",
          { "data-testid": "element", ref: ref },
          "Click me"
        ),
        react_2.default.createElement("div", { "data-testid": "value" }, value)
      );
    };
  });
  it("should not call callback by default", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(TestJSX, null)
    ).container;
    var displayElement = (0, react_1.getByTestId)(container, "element");
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
  });
  it("should not call callback when event fires", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(TestJSX, null)
    ).container;
    var displayElement = (0, react_1.getByTestId)(container, "element");
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
    act(function () {
      react_1.fireEvent.click(displayElement);
      react_1.fireEvent.click(displayElement);
      react_1.fireEvent.click(displayElement);
    });
    expect(Number.parseInt(valueElement.innerHTML)).toBe(3);
  });
});
