"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_2 = __importStar(require("react"));
var useUpdateEffect_1 = require("../hooks/useUpdateEffect");
describe("useUpdateEffect", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, react_2.useState)(0),
        value = _a[0],
        setValue = _a[1];
      var _b = (0, react_2.useState)(0),
        hasUpdated = _b[0],
        setHasUpdated = _b[1];
      (0, useUpdateEffect_1.useUpdateEffect)(
        function () {
          setHasUpdated(hasUpdated + 1);
        },
        [value > 0]
      );
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "button",
          {
            "data-testid": "trigger-btn",
            onClick: function () {
              return setValue(value + 1);
            },
          },
          "Trigger updation"
        ),
        react_2.default.createElement(
          "span",
          { "data-testid": "value" },
          value.toString()
        ),
        react_2.default.createElement(
          "span",
          { "data-testid": "element" },
          hasUpdated
        )
      );
    };
  });
  afterEach(react_1.cleanup); // <-- add this
  it("should be defined", function () {
    expect(useUpdateEffect_1.useUpdateEffect).toBeDefined();
  });
  it("initializes correctly", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var renderedElement = getByTestId("element");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
  });
  it("does not get called on mount", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var renderedElement = getByTestId("element");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
  });
  it("gets called if a state value changes", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var renderedElement = getByTestId("element");
    var valueElement = getByTestId("value");
    var triggerElement = getByTestId("trigger-btn");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(1);
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(1);
  });
  it("does not get called if state value has not updated", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var renderedElement = getByTestId("element");
    var valueElement = getByTestId("value");
    var triggerElement = getByTestId("trigger-btn");
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(1);
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(1);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(2);
    expect(Number.parseInt(String(renderedElement.textContent))).toEqual(1);
  });
});
describe("useUpdateEffect with []", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, react_2.useState)(0),
        value = _a[0],
        setValue = _a[1];
      var _b = (0, react_2.useState)(0),
        hasUpdated = _b[0],
        setHasUpdated = _b[1];
      (0, useUpdateEffect_1.useUpdateEffect)(function () {
        setHasUpdated(hasUpdated + 1);
      }, []);
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "button",
          {
            "data-testid": "trigger-btn",
            onClick: function () {
              return setValue(value + 1);
            },
          },
          "Trigger updation"
        ),
        react_2.default.createElement(
          "span",
          { "data-testid": "value" },
          value.toString()
        ),
        react_2.default.createElement(
          "span",
          { "data-testid": "element" },
          hasUpdated
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("warns if conditionals is empty array", function () {
    var spy = jest.spyOn(global.console, "warn");
    (0, react_1.render)(react_2.default.createElement(App, null));
    expect(spy).toHaveBeenCalled();
  });
});
describe("useUpdateEffect with cleanup phase", function () {
  var App;
  var mockCallback;
  beforeEach(function () {
    mockCallback = jest.fn(function () {
      return console.log("cleanup");
    });
    App = function () {
      var _a = (0, react_2.useState)(0),
        value = _a[0],
        setValue = _a[1];
      (0, useUpdateEffect_1.useUpdateEffect)(
        function () {
          console.log(value);
          return mockCallback;
        },
        [value]
      );
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "button",
          {
            "data-testid": "trigger-btn",
            onClick: function () {
              return setValue(value + 1);
            },
          },
          "Trigger updation"
        ),
        react_2.default.createElement(
          "span",
          { "data-testid": "value" },
          value.toString()
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("cleanup is called", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var valueElement = getByTestId("value");
    var triggerElement = getByTestId("trigger-btn");
    expect(mockCallback).toHaveBeenCalledTimes(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(1);
    expect(mockCallback).toHaveBeenCalledTimes(0);
    (0, react_1.act)(function () {
      react_1.fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toEqual(2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
