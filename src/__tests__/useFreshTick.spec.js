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
var react_hooks_1 = require("@testing-library/react-hooks");
var react_1 = require("react");
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var useFreshTick_1 = require("../hooks/useFreshTick");
var act = react_test_renderer_1.default.act;
describe("useFreshTick", function () {
  var useHook;
  beforeEach(function () {
    useHook = function () {
      var _a = (0, react_1.useState)(0),
        currentValue = _a[0],
        setCurrentValue = _a[1];
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      var freshTick = (0, useFreshTick_1.useFreshTick)(increment);
      (0, react_1.useEffect)(function () {
        var intervalId = setInterval(function () {
          freshTick();
        }, 1000);
        return function () {
          return clearInterval(intervalId);
        };
      }, []);
      return { currentValue: currentValue };
    };
  });
  afterEach(react_hooks_1.cleanup);
  it("should be defined", function () {
    expect(useFreshTick_1.useFreshTick).toBeDefined();
  });
  it("should increment correctly", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(function () {
      return useHook();
    }).result;
    act(function () {
      jest.advanceTimersByTime(5000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(5);
    jest.useRealTimers();
  });
  // it("should start timer when started with start function in array destructuring", () => {
  //     jest.useFakeTimers();
  //     const { result } = renderHook(() => useHook());
  //     act(() => {
  //         const [start] = result.current.intervalHandler;
  //         start();
  //     });
  //     act(() => {
  //       jest.advanceTimersByTime(1000);
  //     });
  //     expect(setInterval).toHaveBeenCalledTimes(1);
  //     expect(result.current.currentValue).toBe(1);
  //     jest.useRealTimers();
  //   });
});
