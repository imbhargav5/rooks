"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_2 = __importDefault(require("react"));
var useWillUnmount_1 = require("../hooks/useWillUnmount");
describe("useWillUnmount", function () {
  var App;
  var mockCallback = jest.fn(function () {
    return null;
  });
  // let firstCallback
  beforeEach(function () {
    function Child() {
      (0, useWillUnmount_1.useWillUnmount)(mockCallback);
      return null;
    }
    // firstCallback = jest.fn()
    App = function () {
      var _a = react_2.default.useState(false),
        isChildVisible = _a[0],
        setIsChildVisible = _a[1];
      var _b = react_2.default.useState(0),
        value = _b[0],
        setValue = _b[1];
      function toggleIsChildVisible() {
        setIsChildVisible(!isChildVisible);
      }
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "p",
          {
            "data-testid": "value",
            onClick: function () {
              return setValue(value + 1);
            },
          },
          value
        ),
        react_2.default.createElement(
          "button",
          { "data-testid": "toggle-child", onClick: toggleIsChildVisible },
          "Toggle child visibility"
        ),
        isChildVisible && react_2.default.createElement(Child, null)
      );
    };
    // end
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useWillUnmount_1.useWillUnmount).toBeDefined();
  });
  it("should only call the unmount function only when unmount", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    var toggleChildElement = (0, react_1.getByTestId)(
      container,
      "toggle-child"
    );
    expect(mockCallback.mock.calls.length).toBe(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls.length).toBe(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls.length).toBe(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls.length).toBe(1);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
