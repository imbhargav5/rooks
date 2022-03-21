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
var react_hooks_1 = require("@testing-library/react-hooks");
var react_2 = __importDefault(require("react"));
var useLocalstorage_1 = require("../hooks/useLocalstorage");
describe("useLocalstorage defined", function () {
  it("should be defined", function () {
    expect(useLocalstorage_1.useLocalstorage).toBeDefined();
  });
});
describe("useLocalstorage with object destructuring", function () {
  var App;
  // let firstCallback
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var value = (0, useLocalstorage_1.useLocalstorage)(
        "test-value",
        "hello"
      ).value;
      return react_2.default.createElement(
        "div",
        { "data-testid": "container" },
        react_2.default.createElement("p", { "data-testid": "value" }, value)
      );
    };
    // end
  });
  afterEach(react_1.cleanup);
  it("initializes correctly", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });
});
describe("useLocalstorage with array destructuring", function () {
  var App;
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var _a = (0, useLocalstorage_1.useLocalstorage)("test-value", "hello"),
        currentValue = _a[0],
        set = _a[1],
        remove = _a[2];
      return react_2.default.createElement(
        "div",
        { "data-testid": "container" },
        react_2.default.createElement(
          "p",
          { "data-testid": "value" },
          currentValue
        ),
        react_2.default.createElement(
          "button",
          {
            "data-testid": "new-value",
            onClick: function () {
              set("new value");
            },
          },
          "Set to new value"
        ),
        react_2.default.createElement(
          "button",
          { "data-testid": "unset-value", onClick: remove },
          "Unset the value"
        )
      );
    };
    // end
  });
  afterEach(react_1.cleanup);
  it("initializes correctly", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });
  test("set ", function () {
    var _a = (0, react_hooks_1.renderHook)(function () {
        return (0, useLocalstorage_1.useLocalstorage)("test-value", "hello");
      }),
      result = _a.result,
      rerender = _a.rerender;
    // tests equality after emo
    var setBeforeRerender = result.current.set;
    rerender();
    var setAfterRerender = result.current.set;
    expect(setBeforeRerender).toBe(setAfterRerender);
    // work after rerender
    (0, react_hooks_1.act)(function () {
      setAfterRerender("value");
    });
    expect(result.current.value).toBe("value");
  });
  it("setting the new value", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var setToNewValueButton = (0, react_1.getByTestId)(container, "new-value");
    (0, react_1.act)(function () {
      react_1.fireEvent.click(setToNewValueButton);
    });
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(valueElement.innerHTML).toBe("new value");
  });
  it("unsetting the value", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var unsetValueButton = (0, react_1.getByTestId)(container, "unset-value");
    (0, react_1.act)(function () {
      react_1.fireEvent.click(unsetValueButton);
    });
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(valueElement.innerHTML).toBe("");
  });
});
// figure out tests
