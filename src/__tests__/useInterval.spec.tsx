/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useState } from "react";
import TestRenderer from "react-test-renderer";
import { useInterval } from "../hooks/useInterval";

const { act } = TestRenderer;

describe("useInterval", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let useHook = function () {
    const [currentValue, setCurrentValue] = useState(0);
    function increment() {
      setCurrentValue(currentValue + 1);
    }

    const intervalHandler = useInterval(() => {
      increment();
    }, 1_000);

    return { currentValue, intervalHandler };
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
    useHook = function () {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }

      const intervalHandler = useInterval(() => {
        increment();
      }, 1_000);

      return { currentValue, intervalHandler };
    };
  });

  afterEach(() => {
    void cleanup();
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(useInterval).toBeDefined();
  });
  it("should start timer when started with start function", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    void act(() => {
      result.current.intervalHandler.start();
    });
    void act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });

  it("should start timer when started with start function in array destructuring", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    void act(() => {
      const [start] = result.current.intervalHandler;
      start();
    });
    void act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });
});
