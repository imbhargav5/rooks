/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useEffect, useState } from "react";
import TestRenderer from "react-test-renderer";
import { useFreshRef } from "../hooks/useFreshRef";

const { act } = TestRenderer;

describe("useFreshRef", () => {
  let useHook;

  beforeEach(() => {
    useHook = function () {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      const freshIncrementRef = useFreshRef(increment);
      useEffect(() => {
        function tick() {
          if (freshIncrementRef.current) {
            freshIncrementRef.current();
          }
        }
        const intervalId = setInterval(tick, 1000);
        return () => {
          clearInterval(intervalId);
        };
      }, []);

      return { currentValue };
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useFreshRef).toBeDefined();
  });
  it("should increment correctly", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHook());
    act(() => {
      jest.advanceTimersByTime(5_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(5);
    jest.useRealTimers();
  });
});
