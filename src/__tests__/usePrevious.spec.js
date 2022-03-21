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
var usePrevious_1 = require("../hooks/usePrevious");
describe("usePrevious", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, react_2.useState)(0),
        currentValue = _a[0],
        setCurrentValue = _a[1];
      var previousValue = (0, usePrevious_1.usePrevious)(currentValue);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "p",
          { "data-testid": "current-element", onClick: increment },
          currentValue
        ),
        react_2.default.createElement(
          "p",
          { "data-testid": "previous-element" },
          previousValue
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(usePrevious_1.usePrevious).toBeDefined();
  });
  it("sets initial value to null and updates after change in tracked value", function () {
    var getByTestId = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).getByTestId;
    var currentElement = getByTestId("current-element");
    var previousElement = getByTestId("previous-element");
    expect(currentElement.innerHTML).toBe("0");
    expect(previousElement.innerHTML).toBe("");
    (0, react_1.act)(function () {
      react_1.fireEvent.click(currentElement);
    });
    expect(currentElement.innerHTML).toBe("1");
    expect(previousElement.innerHTML).toBe("0");
  });
});
// figure out tests
