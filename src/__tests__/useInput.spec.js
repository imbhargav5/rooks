"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var react_hooks_1 = require("@testing-library/react-hooks");
var react_2 = __importDefault(require("react"));
var useInput_1 = require("../hooks/useInput");
describe("useInput", function () {
  // basic tests
  describe("basic", function () {
    var App;
    beforeEach(function () {
      App = function () {
        var myInput = (0, useInput_1.useInput)("hello");
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement(
            "input",
            __assign({ "data-testid": "input-element" }, myInput)
          ),
          react_2.default.createElement(
            "input",
            __assign({ "data-testid": "display-element" }, myInput)
          )
        );
      };
    });
    afterEach(react_1.cleanup); // <-- add this
    test("memo", function () {
      var _a = (0, react_hooks_1.renderHook)(function () {
          return (0, useInput_1.useInput)("hello");
        }),
        result = _a.result,
        rerender = _a.rerender;
      var onChangeBeforeRerender = result.current.onChange;
      rerender();
      var onChangeAfterRerender = result.current.onChange;
      // fn is memo
      expect(onChangeBeforeRerender).toBe(onChangeAfterRerender);
      (0, react_hooks_1.act)(function () {
        onChangeAfterRerender({ target: { value: "string" } });
      });
      // memo fn is still able to set data
      expect(result.current.value).toBe("string");
      // memo fn is reactive
      (0, react_hooks_1.act)(function () {
        onChangeAfterRerender({ target: { value: "string2" } });
      });
      expect(result.current.value).toBe("string2");
    });
    it("should be defined", function () {
      expect(useInput_1.useInput).toBeDefined();
    });
    it("sets initial value correctly", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var inputElement = getByTestId("input-element");
      expect(inputElement.value).toBe("hello");
    });
    it("updates value correctly", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var inputElement = getByTestId("input-element");
      var displayElement = getByTestId("display-element");
      expect(inputElement.value).toBe("hello");
      expect(displayElement.value).toBe("hello");
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement, {
          target: {
            value: "world",
          },
        });
      });
      expect(inputElement.value).toBe("world");
      expect(displayElement.value).toBe("world");
    });
  });
  // validate
  describe("validate", function () {
    var App;
    beforeEach(function () {
      App = function (_a) {
        var validate = _a.validate;
        var myInput = (0, useInput_1.useInput)(5, {
          validate:
            validate ||
            function (newValue) {
              return newValue < 10;
            },
        });
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement(
            "input",
            __assign(
              { "data-testid": "input-element", type: "number" },
              myInput
            )
          )
        );
      };
    });
    afterEach(react_1.cleanup); // <-- add this
    it("does not update if validate returns false", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var inputElement = getByTestId("input-element");
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement, {
          target: {
            value: 10,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(5);
    });
    it("updates if validate returns true", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var inputElement = getByTestId("input-element");
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement, {
          target: {
            value: 9,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(9);
    });
    it("validate can be used to compare possible newvalue with current value", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, {
          validate: function (newValue, currentValue) {
            return newValue % currentValue != 0;
          },
        })
      ).getByTestId;
      var inputElement = getByTestId("input-element");
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement, {
          target: {
            value: 6,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(6);
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement, {
          target: {
            value: 12,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(6);
    });
  });
  describe("multiple", function () {
    var App;
    beforeEach(function () {
      App = function () {
        var myInput = (0, useInput_1.useInput)(5);
        var myInput2 = (0, useInput_1.useInput)(myInput.value);
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement(
            "input",
            __assign(
              { "data-testid": "input-element1", type: "number" },
              myInput
            )
          ),
          react_2.default.createElement(
            "input",
            __assign(
              { "data-testid": "input-element2", type: "number" },
              myInput2
            )
          )
        );
      };
    });
    afterEach(react_1.cleanup); // <-- add this
    it("updates value of input if initial value changes", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var inputElement1 = getByTestId("input-element1");
      var inputElement2 = getByTestId("input-element2");
      expect(Number.parseInt(inputElement1.value)).toBe(5);
      expect(Number.parseInt(inputElement2.value)).toBe(5);
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement2, {
          target: {
            value: 6,
          },
        });
      });
      expect(Number.parseInt(inputElement2.value)).toBe(6);
      (0, react_1.act)(function () {
        react_1.fireEvent.change(inputElement1, {
          target: {
            value: 10,
          },
        });
      });
      expect(Number.parseInt(inputElement1.value)).toBe(10);
      expect(Number.parseInt(inputElement2.value)).toBe(10);
    });
  });
});
// figure out tests
