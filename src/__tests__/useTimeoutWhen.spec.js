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
var useTimeoutWhen_1 = require("../hooks/useTimeoutWhen");
describe("useTimeoutWhen", function () {
  it("should be defined", function () {
    expect(useTimeoutWhen_1.useTimeoutWhen).toBeDefined();
  });
});
describe("base", function () {
  var useHook;
  beforeEach(function () {
    useHook = function () {
      var _a = (0, react_1.useState)(0),
        value = _a[0],
        setValue = _a[1];
      (0, useTimeoutWhen_1.useTimeoutWhen)(function () {
        setValue(9000);
      }, 1000);
      return { value: value };
    };
  });
  it("runs immediately after mount", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        jest.useFakeTimers();
        result = (0, react_hooks_1.renderHook)(function () {
          return useHook();
        }).result;
        (0, react_hooks_1.act)(function () {
          jest.advanceTimersByTime(1000);
        });
        expect(result.current.value).toBe(9000);
        jest.useRealTimers();
        return [2 /*return*/];
      });
    });
  });
});
// describe.skip("use-timeout base", async () => {
//   let Component;
//   let mockCallback;
//   const TIMEOUT_MS = 1000;
//   beforeEach(() => {
//     Component = function() {
//       const [value, setValue] = useState(0);
//       mockCallback = jest.fn(() => setValue(3));
//       useTimeoutWhen(mockCallback, TIMEOUT_MS);
//     };
//   });
//   afterEach(cleanup); // <-- add this
// //   it("should set value after timeout", () => {
// //     jest.useFakeTimers();
// //     const {result} = renderHook(()=> useHook())
// //     expect(result.current.value).toBe(9000)
// //     jest.advanceTimersByTime(1000);
// //   })
// //   it("should initially not run timeoutcallback unless start is invoked", () => {
// //     render(<Component />);
// //     jest.useFakeTimers();
// //     expect(mockCallback.mock.calls.length).toBe(0);
// //     jest.useRealTimers(); //needed for wait
// //   });
// //   it("should run timeoutcallback when start is invoked", async () => {
// //     jest.useFakeTimers();
// //     const { getByTestId } = render(<Component />);
// //     expect(mockCallback.mock.calls.length).toBe(0);
// //     act(() => {
// //       fireEvent.click(getByTestId("start-button"));
// //       jest.runAllTimers();
// //     });
// //     jest.useRealTimers(); //needed for wait
// //     //TODO: no idea why I need to wait for next tick
// //     waitFor(() => {
// //       expect(mockCallback.mock.calls.length).toBe(1);
// //     });
// //   });
// });
