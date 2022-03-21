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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var react_1 = require("react");
var useDebounce_1 = require("../hooks/useDebounce");
var wait = function (ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
describe("useDebounce", function () {
  it("should be defined", function () {
    expect(useDebounce_1.useDebounce).toBeDefined();
  });
});
describe("useDebounce behavior", function () {
  var DEBOUNCE_WAIT = 500;
  var useCustomDebounce;
  beforeEach(function () {
    useCustomDebounce = function () {
      var _a = (0, react_1.useState)(0),
        value = _a[0],
        setValue = _a[1];
      function log() {
        setValue(value + 1);
      }
      var callback = (0, useDebounce_1.useDebounce)(log, DEBOUNCE_WAIT);
      return { cb: callback, value: value };
    };
  });
  it("runs only once if cb is called repeatedly in wait period", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var _a, result, waitForNextUpdate;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            expect.assertions(1);
            (_a = (0, react_hooks_1.renderHook)(useCustomDebounce)),
              (result = _a.result),
              (waitForNextUpdate = _a.waitForNextUpdate);
            result.current.cb();
            result.current.cb();
            result.current.cb();
            return [4 /*yield*/, waitForNextUpdate()];
          case 1:
            _b.sent();
            expect(result.current.value).toBe(1);
            return [2 /*return*/];
        }
      });
    });
  });
  it("should apply default options", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var callback, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(2);
            callback = jest.fn();
            result = (0, react_hooks_1.renderHook)(function () {
              return (0, useDebounce_1.useDebounce)(callback, 32);
            }).result;
            result.current();
            expect(callback).not.toHaveBeenCalled();
            return [4 /*yield*/, wait(64)];
          case 1:
            _a.sent();
            expect(callback).toHaveBeenCalledTimes(1);
            return [2 /*return*/];
        }
      });
    });
  });
  it("should support a `leading` option", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var callback, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(2);
            callback = jest.fn();
            result = (0, react_hooks_1.renderHook)(function () {
              return (0,
              useDebounce_1.useDebounce)(callback, 32, { leading: true });
            }).result;
            result.current();
            expect(callback).toHaveBeenCalledTimes(1);
            return [4 /*yield*/, wait(64)];
          case 1:
            _a.sent();
            result.current();
            expect(callback).toHaveBeenCalledTimes(2);
            return [2 /*return*/];
        }
      });
    });
  });
  it("should support a `trailing` option", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var withTrailing,
        withTrailingResult,
        withoutTrailing,
        withoutTrailingResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(4);
            withTrailing = jest.fn();
            withTrailingResult = (0, react_hooks_1.renderHook)(function () {
              return (0,
              useDebounce_1.useDebounce)(withTrailing, 32, { trailing: true });
            }).result;
            withoutTrailing = jest.fn();
            withoutTrailingResult = (0, react_hooks_1.renderHook)(function () {
              return (0,
              useDebounce_1.useDebounce)(withTrailing, 32, { trailing: false });
            }).result;
            withTrailingResult.current();
            expect(withTrailing).toHaveBeenCalledTimes(0);
            withoutTrailingResult.current();
            expect(withoutTrailing).toHaveBeenCalledTimes(0);
            return [4 /*yield*/, wait(64)];
          case 1:
            _a.sent();
            expect(withTrailing).toHaveBeenCalledTimes(1);
            expect(withoutTrailing).toHaveBeenCalledTimes(0);
            return [2 /*return*/];
        }
      });
    });
  });
});
