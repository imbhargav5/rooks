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
var useFreshRef_1 = require("../hooks/useFreshRef");
describe("useFreshRef", function () {
  var useHook;
  beforeEach(function () {
    useHook = function () {
      var _a = (0, react_1.useState)(0),
        currentValue = _a[0],
        setCurrentValue = _a[1];
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      var freshIncrementRef = (0, useFreshRef_1.useFreshRef)(increment);
      (0, react_1.useEffect)(function () {
        function tick() {
          if (freshIncrementRef.current) {
            freshIncrementRef.current();
          }
        }
        var intervalId = setInterval(tick, 1000);
        return function () {
          clearInterval(intervalId);
        };
      }, []);
      return { currentValue: currentValue };
    };
  });
  afterEach(react_hooks_1.cleanup);
  it("should be defined", function () {
    expect(useFreshRef_1.useFreshRef).toBeDefined();
  });
  it("should increment correctly", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(useHook).result;
    (0, react_hooks_1.act)(function () {
      jest.advanceTimersByTime(5000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(5);
    jest.useRealTimers();
  });
  test("should use stale state", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var result, handlers;
      return __generator(this, function (_a) {
        expect.hasAssertions();
        result = (0, react_hooks_1.renderHook)(function () {
          var _a = (0, react_1.useState)(0),
            count = _a[0],
            setCount = _a[1];
          var increment = function () {
            setCount(count + 1);
          };
          var handler = (0, react_1.useCallback)(function () {
            increment();
          }, []);
          return {
            count: count,
            handler: handler,
          };
        }).result;
        handlers = [];
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        expect(result.current.count).toEqual(1);
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        expect(result.current.count).toEqual(1);
        expect(
          handlers.every(function (function_) {
            return function_ === handlers[0];
          })
        ).toBe(true);
        return [2 /*return*/];
      });
    });
  });
  test("should use the latest state via fresh ref and return stable ref object won’t and won't change on re-renders", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var result, handlers, references;
      return __generator(this, function (_a) {
        expect.assertions(8);
        result = (0, react_hooks_1.renderHook)(function () {
          var _a = (0, react_1.useState)(0),
            count = _a[0],
            setCount = _a[1];
          var increment = function () {
            setCount(count + 1);
          };
          var ref = (0, useFreshRef_1.useFreshRef)(increment);
          var handler = (0, react_1.useCallback)(
            function () {
              ref.current();
            },
            [ref]
          );
          return { count: count, handler: handler, ref: ref };
        }).result;
        handlers = [];
        references = [];
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        references.push(result.current.ref);
        expect(result.current.count).toEqual(1);
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        references.push(result.current.ref);
        expect(result.current.count).toEqual(2);
        (0, react_hooks_1.act)(function () {
          result.current.handler();
        });
        handlers.push(result.current.handler);
        references.push(result.current.ref);
        handlers.forEach(function (function_) {
          expect(function_).toBe(handlers[0]);
        });
        references.forEach(function (ref) {
          expect(ref).toBe(references[0]);
        });
        return [2 /*return*/];
      });
    });
  });
});
