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
var useLocalstorageState_1 = require("../hooks/useLocalstorageState");
describe("useLocalstorageState defined", function () {
  it("should be defined", function () {
    expect(useLocalstorageState_1.useLocalstorageState).toBeDefined();
  });
});
describe("useLocalstorageState basic", function () {
  var App;
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var _a = (0, useLocalstorageState_1.useLocalstorageState)(
          "test-value",
          "hello"
        ),
        value = _a[0],
        set = _a[1],
        remove = _a[2];
      return react_2.default.createElement(
        "div",
        { "data-testid": "container" },
        react_2.default.createElement("p", { "data-testid": "value" }, value),
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
  test("memo", function () {
    var _a = (0, react_hooks_1.renderHook)(function () {
        return (0,
        useLocalstorageState_1.useLocalstorageState)("key1", "value");
      }),
      result = _a.result,
      rerender = _a.rerender;
    // test memo
    var setBeforeRerender = result.current[1];
    var removeBeforeRerender = result.current[2];
    rerender();
    var setAfterRerender = result.current[1];
    var removeAfterRerender = result.current[2];
    expect(setBeforeRerender).toBe(setAfterRerender);
    expect(removeBeforeRerender).toBe(removeAfterRerender);
  });
  it("initializes correctly", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    expect(valueElement.innerHTML).toBe("hello");
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
  it.skip("unsetting the value", function () {
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
