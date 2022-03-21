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
var useToggle_1 = require("../hooks/useToggle");
describe("useToggle behaviour", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, useToggle_1.useToggle)(true),
        value = _a[0],
        toggleValue = _a[1];
      return react_2.default.createElement(
        "p",
        { "data-testid": "toggle-element", onClick: toggleValue },
        value.toString()
      );
    };
  });
  afterEach(react_1.cleanup); // <-- add this
  it("should be defined", function () {
    expect(useToggle_1.useToggle).toBeDefined();
  });
  it("sets initial value correctly", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("true");
  });
  it("updates value", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    react_1.fireEvent.click(toggleElement);
    expect(toggleElement.innerHTML).toBe("false");
  });
});
describe("useToggle with custom toggle function", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, useToggle_1.useToggle)("regina", function (v) {
          return v === "regina" ? "phalange" : "regina";
        }),
        value = _a[0],
        toggleValue = _a[1];
      return react_2.default.createElement(
        "p",
        { "data-testid": "toggle-element", onClick: toggleValue },
        value
      );
    };
  });
  afterEach(react_1.cleanup); // <-- add this
  it("should be defined", function () {
    expect(useToggle_1.useToggle).toBeDefined();
  });
  it("sets initial value correctly", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("regina");
  });
  it("updates value", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    react_1.fireEvent.click(toggleElement);
    expect(toggleElement.innerHTML).toBe("phalange");
  });
});
describe("useToggle with custom toggle function", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, useToggle_1.useToggle)(),
        value = _a[0],
        toggleValue = _a[1];
      return react_2.default.createElement(
        "p",
        { "data-testid": "toggle-element", onClick: toggleValue },
        value.toString()
      );
    };
  });
  afterEach(react_1.cleanup); // <-- add this
  it("should be false by default", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("false");
  });
});
describe("useToggle with reducer", function () {
  var App;
  var toggleReducer;
  beforeEach(function () {
    toggleReducer = function (state, action) {
      switch (action.type) {
        case "yep":
          return 1;
        case "nope":
          return -1;
        case "maybe":
          return 0;
        default:
          return state;
      }
    };
    App = function () {
      var _a = (0, useToggle_1.useToggle)(1, toggleReducer),
        value = _a[0],
        dispatch = _a[1];
      return react_2.default.createElement(
        react_2.default.Fragment,
        null,
        react_2.default.createElement(
          "p",
          { "data-testid": "toggle-element" },
          value.toString()
        ),
        react_2.default.createElement("button", {
          "data-testid": "yep-button",
          onClick: function () {
            return dispatch({ type: "yep" });
          },
        }),
        react_2.default.createElement("button", {
          "data-testid": "nope-button",
          onClick: function () {
            return dispatch({ type: "nope" });
          },
        }),
        react_2.default.createElement("button", {
          "data-testid": "maybe-button",
          onClick: function () {
            return dispatch({ type: "maybe" });
          },
        })
      );
    };
  });
  afterEach(react_1.cleanup); // <-- add this
  it("should be 1 by default", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("1");
  });
  it("should update with dispatched actions", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var toggleElement = getByTestId("toggle-element");
    var nopeButton = getByTestId("nope-button");
    var maybeButton = getByTestId("maybe-button");
    var yepButton = getByTestId("yep-button");
    react_1.fireEvent.click(nopeButton);
    expect(toggleElement.innerHTML).toBe("-1");
    react_1.fireEvent.click(maybeButton);
    expect(toggleElement.innerHTML).toBe("0");
    react_1.fireEvent.click(yepButton);
    expect(toggleElement.innerHTML).toBe("1");
  });
});
// figure out tests
