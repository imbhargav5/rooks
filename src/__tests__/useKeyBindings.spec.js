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
var useKeyBindings_1 = require("../hooks/useKeyBindings");
describe("useKeyBindings", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var inputRef = react_2.default.useRef(null);
      var _a = react_2.default.useState(0),
        value = _a[0],
        setValue = _a[1];
      (0, useKeyBindings_1.useKeyBindings)({
        s: function () {
          setValue(value + 1);
        },
      });
      (0, useKeyBindings_1.useKeyBindings)(
        {
          r: function () {
            setValue(value + 1);
          },
          v: function () {
            setValue(value + 1);
          },
        },
        {
          target: inputRef,
        }
      );
      return react_2.default.createElement(
        "div",
        { "data-testid": "container" },
        react_2.default.createElement("p", { "data-testid": "value" }, value),
        react_2.default.createElement(
          "div",
          { className: "grid-container" },
          react_2.default.createElement("input", {
            className: "box1",
            "data-testid": "input",
            ref: inputRef,
            tabIndex: 1,
          })
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useKeyBindings_1.useKeyBindings).toBeDefined();
  });
  it("should trigger the calback when pressed on document or target", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    var inputElement = (0, react_1.getByTestId)(container, "input");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(window, {
        charCode: 83,
        code: "keyS",
        key: "s",
      });
    });
    expect(valueElement.innerHTML).toBe("1");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(inputElement, {
        charCode: 82,
        code: "keyR",
        key: "r",
      });
    });
    expect(valueElement.innerHTML).toBe("2");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(inputElement, {
        charCode: 86,
        code: "keyV",
        key: "v",
      });
    });
    expect(valueElement.innerHTML).toBe("3");
  });
});
