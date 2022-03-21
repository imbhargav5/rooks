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
var useKeyRef_1 = require("../hooks/useKeyRef");
describe("useKeyRef", function () {
  var App;
  // let firstCallback
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var _a = react_2.default.useState(0),
        value = _a[0],
        setValue = _a[1];
      var inputRef = (0, useKeyRef_1.useKeyRef)(["r"], function () {
        setValue(value + 1);
      });
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
    // end
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useKeyRef_1.useKeyRef).toBeDefined();
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
    expect(valueElement.innerHTML).toBe("0");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(inputElement, {
        charCode: 82,
        code: "keyR",
        key: "r",
      });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});
describe("non array input", function () {
  var App;
  // let firstCallback
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var _a = react_2.default.useState(0),
        value = _a[0],
        setValue = _a[1];
      var inputRef = (0, useKeyRef_1.useKeyRef)("r", function () {
        setValue(value + 1);
      });
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
    // end
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useKeyRef_1.useKeyRef).toBeDefined();
  });
  it("should trigger the calback when pressed on document or target", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var valueElement = (0, react_1.getByTestId)(container, "value");
    var inputElement = (0, react_1.getByTestId)(container, "input");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(inputElement, {
        charCode: 82,
        code: "keyR",
        key: "r",
      });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});
describe("when", function () {
  var App;
  // let firstCallback
  beforeEach(function () {
    // firstCallback = jest.fn()
    App = function () {
      var _a = react_2.default.useState(true),
        when = _a[0],
        setWhen = _a[1];
      function toggleWhen() {
        setWhen(!when);
      }
      var _b = react_2.default.useState(0),
        value = _b[0],
        setValue = _b[1];
      var inputRef = (0, useKeyRef_1.useKeyRef)(
        ["r"],
        function () {
          setValue(value + 1);
        },
        {
          when: when,
        }
      );
      return react_2.default.createElement(
        "div",
        { "data-testid": "container" },
        react_2.default.createElement("p", { "data-testid": "value" }, value),
        react_2.default.createElement(
          "button",
          { "data-testid": "toggle-when", onClick: toggleWhen },
          " ",
          "Toggle when"
        ),
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
    // end
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useKeyRef_1.useKeyRef).toBeDefined();
  });
  it("should not trigger whenever 'when ' value is false and trigger when 'when' is true", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    console.log("container.innerHTML before", container.innerHTML);
    var valueElement = (0, react_1.getByTestId)(container, "value");
    var inputElement = (0, react_1.getByTestId)(container, "input");
    var toggleWhenElement = (0, react_1.getByTestId)(container, "toggle-when");
    (0, react_1.act)(function () {
      react_1.fireEvent.keyDown(inputElement, {
        charCode: 82,
        code: "keyR",
        key: "r",
      });
    });
    expect(valueElement.innerHTML).toBe("1");
    // disable when
    (0, react_1.act)(function () {
      react_1.fireEvent.click(toggleWhenElement);
    });
    expect(valueElement.innerHTML).toBe("1");
    // enable when
    (0, react_1.act)(function () {
      react_1.fireEvent.click(toggleWhenElement);
    });
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
        charCode: 82,
        code: "keyR",
        key: "r",
      });
    });
    expect(valueElement.innerHTML).toBe("3");
  });
});
