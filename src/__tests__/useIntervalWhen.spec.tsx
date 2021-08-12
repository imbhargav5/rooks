/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useState } from "react";
import TestRenderer from "react-test-renderer";
import { useIntervalWhen } from "../hooks/useIntervalWhen";

const { act } = TestRenderer;

describe("useIntervalWhen", () => {
  let useHook;
  const EAGER = true;

  beforeEach(() => {
    useHook = function (when, eager = false) {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      useIntervalWhen(
        () => {
          increment();
        },
        1_000,
        when,
        eager
      );

      return { currentValue };
    };
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  it("should be defined", () => {
    expect(useIntervalWhen).toBeDefined();
  });
  it("should start timer when started with start function", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook(true));
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    jest.useRealTimers();
  });

  it("should call the callback eagerly", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook(true, EAGER));
    // The value was already incremented because we use useIntervalWhen in EAGER mode
    expect(result.current.currentValue).toBe(1);
    act(() => {
      jest.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    // The value was incremented twice: one time by the setInterval and one time due to the EAGER
    expect(result.current.currentValue).toBe(2);
    jest.useRealTimers();
  });
});
