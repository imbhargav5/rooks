"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useDebouncedValue_1 = require("../hooks/useDebouncedValue");
describe("useDebouncedValue", function () {
  beforeEach(function () {
    jest.useFakeTimers("modern");
  });
  afterEach(function () {
    jest.useRealTimers();
  });
  it("should be defined", function () {
    expect(useDebouncedValue_1.useDebouncedValue).toBeDefined();
  });
  it("should initialize with first value if timeout is not reached and initializeWithNull is false", function () {
    var mockValue = "mock_value";
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useDebouncedValue_1.useDebouncedValue)(mockValue, 200);
    }).result;
    (0, react_hooks_1.act)(function () {
      expect(result.current[0]).toBe(mockValue);
    });
  });
  it("should return null if the timeout has not been reached and initializeWithNull is true", function () {
    var mockValue = "mock_value";
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0,
      useDebouncedValue_1.useDebouncedValue)(mockValue, 200, { initializeWithNull: true });
    }).result;
    (0, react_hooks_1.act)(function () {
      expect(result.current[0]).toBeNull();
    });
  });
  it("should returns updated value if the timeout has been reached and initializeWithNull is true", function () {
    var mockValue = "mock_value";
    var result;
    (0, react_hooks_1.act)(function () {
      var resultFromHook = (0, react_hooks_1.renderHook)(function () {
        return (0,
        useDebouncedValue_1.useDebouncedValue)(mockValue, 200, { initializeWithNull: true });
      }).result;
      result = resultFromHook;
    });
    expect(result.current[0]).toBeNull();
    (0, react_hooks_1.act)(function () {
      jest.runAllTimers();
    });
    expect(result.current[0]).toBe(mockValue);
  });
  it("should respect the timeout value if initializedWithNull is true", function () {
    var mockValue = "mock_value";
    var mockTimeout = 200;
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0,
      useDebouncedValue_1.useDebouncedValue)(mockValue, mockTimeout, { initializeWithNull: true });
    }).result;
    (0, react_hooks_1.act)(function () {
      jest.advanceTimersByTime(mockTimeout - 5);
    });
    expect(result.current[0]).toBe(null);
    (0, react_hooks_1.act)(function () {
      // accounting for timing issues as it's not exactly accurate
      jest.advanceTimersByTime(5);
    });
    expect(result.current[0]).toBe(mockValue);
  });
  it.each([
    "string",
    2,
    ["mock_item_1", "mock_item_2"],
    { another_key: "another_value", key: "value" },
  ])("should work with different types of values", function (mockValue) {
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0,
      useDebouncedValue_1.useDebouncedValue)(mockValue, 200, { initializeWithNull: true });
    }).result;
    (0, react_hooks_1.act)(function () {
      jest.runAllTimers();
    });
    expect(result.current[0]).toBe(mockValue);
  });
});
