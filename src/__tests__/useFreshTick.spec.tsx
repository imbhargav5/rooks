/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { useEffect, useState } from "react";
import TestRenderer from "react-test-renderer";
import { useFreshTick } from "../hooks/useFreshTick";

const { act } = TestRenderer;

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("useFreshTick", () => {
  let useHook;
  let intervalCallback = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers("modern");
    jest.spyOn(global, "setInterval");
    useHook = function () {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        intervalCallback();
        setCurrentValue(currentValue + 1);
      }
      const freshTick = useFreshTick(increment);
      useEffect(() => {
        const intervalId = setInterval(() => {
          freshTick();
        }, 1_000);

        return () => clearInterval(intervalId);
      }, []);

      return { currentValue };
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    void cleanup();
  });

  it("should be defined", () => {
    expect(useFreshTick).toBeDefined();
  });
  it("should increment correctly", () => {
    const { result, unmount } = renderHook(() => useHook());
    void act(() => {
      jest.advanceTimersByTime(5_000);
    });
    unmount();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(intervalCallback).toHaveBeenCalledTimes(5);
    void act(() => {
      expect(result.current.currentValue).toBe(5);
    });
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
