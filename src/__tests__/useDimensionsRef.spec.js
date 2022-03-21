"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
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
var useDimensionsRef_1 = require("../hooks/useDimensionsRef");
var domrect_polyfill_1 = require("../utils/domrect-polyfill");
describe("useDimensionsRef", function () {
  it("should be defined", function () {
    expect(useDimensionsRef_1.useDimensionsRef).toBeDefined();
  });
  describe("base", function () {
    it("runs immediately after mount", function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
          expect.assertions(1);
          result = (0, react_hooks_1.renderHook)(function () {
            return (0, useDimensionsRef_1.useDimensionsRef)();
          }).result;
          expect(result.current[0]).toBeDefined();
          return [2 /*return*/];
        });
      });
    });
  });
  describe("usage", function () {
    var App;
    beforeEach(function () {
      if (typeof window !== "undefined" && !window.DOMRect) {
        window.DOMRect = domrect_polyfill_1.DOMRectPolyfill;
      }
      jest
        .spyOn(Element.prototype, "getBoundingClientRect")
        .mockImplementation(function () {
          return new DOMRect(0, 0, 120, 300);
        });
      App = function () {
        var _a;
        var _b = (0, useDimensionsRef_1.useDimensionsRef)(),
          ref = _b[0],
          dimensions = _b[1];
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement(
            "span",
            { "data-testid": "value" },
            (_a =
              dimensions === null || dimensions === void 0
                ? void 0
                : dimensions.width) !== null && _a !== void 0
              ? _a
              : "null"
          ),
          react_2.default.createElement(
            "span",
            { "data-testid": "element", ref: ref },
            "Hello"
          )
        );
      };
    });
    afterEach(react_1.cleanup);
    it("gets called if a state value changes", function () {
      var getByTestId = (0, react_1.render)(
        react_2.default.createElement(App, null)
      ).getByTestId;
      var valueElement = getByTestId("value");
      expect(valueElement.textContent).toEqual("120");
    });
  });
  beforeEach(function () {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(function (callback) {
        return callback();
      });
  });
  afterEach(function () {
    window.requestAnimationFrame.mockRestore();
  });
});
