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
var useInterval_1 = require("../hooks/useInterval");
var act = react_test_renderer_1.default.act;
describe("useInterval", function () {
  var useHook;
  beforeEach(function () {
    useHook = function () {
      var _a = (0, react_1.useState)(0),
        currentValue = _a[0],
        setCurrentValue = _a[1];
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      var intervalHandler = (0, useInterval_1.useInterval)(function () {
        increment();
      }, 1000);
      return { currentValue: currentValue, intervalHandler: intervalHandler };
    };
  });
  afterEach(react_hooks_1.cleanup);
  it("should be defined", function () {
    expect(useInterval_1.useInterval).toBeDefined();
  });
  it("should start timer when started with start function", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(function () {
      return useHook();
    }).result;
    act(function () {
      result.current.intervalHandler.start();
    });
    act(function () {
      jest.advanceTimersByTime(1000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });
  it("should start timer when started with start function in array destructuring", function () {
    jest.useFakeTimers();
    var result = (0, react_hooks_1.renderHook)(function () {
      return useHook();
    }).result;
    act(function () {
      var start = result.current.intervalHandler[0];
      start();
    });
    act(function () {
      jest.advanceTimersByTime(1000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });
});
