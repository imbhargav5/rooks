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
var useIntervalWhen_1 = require("../hooks/useIntervalWhen");
var act = react_test_renderer_1.default.act;
describe("useIntervalWhen", function () {
  var useHook;
  var EAGER = true;
  beforeEach(function () {
    useHook = function (when, eager) {
      if (eager === void 0) {
        eager = false;
      }
      var _a = (0, react_1.useState)(0),
        currentValue = _a[0],
        setCurrentValue = _a[1];
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      (0, useIntervalWhen_1.useIntervalWhen)(
        function () {
          increment();
        },
        1000,
        when,
        eager
      );
      return { currentValue: currentValue };
    };
  });
  afterEach(function () {
    (0, react_hooks_1.cleanup)();
    jest.clearAllTimers();
  });
  it("should be defined", function () {
    expect(useIntervalWhen_1.useIntervalWhen).toBeDefined();
  });
  it("should start timer when started with start function", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(function () {
      return useHook(true);
    }).result;
    act(function () {
      jest.advanceTimersByTime(1000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });
  it("should call the callback eagerly", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(function () {
      return useHook(true, EAGER);
    }).result;
    // The value was already incremented because we use useIntervalWhen in EAGER mode
    expect(result.current.currentValue).toBe(1);
    act(function () {
      jest.advanceTimersByTime(1000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    // The value was incremented twice: one time by the setInterval and one time due to the EAGER
    expect(result.current.currentValue).toBe(2);
    jest.useRealTimers();
  });
});
