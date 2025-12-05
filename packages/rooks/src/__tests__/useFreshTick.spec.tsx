import { vi } from "vitest";
/**
 */
import { renderHook, cleanup } from "@testing-library/react";
import { useEffect, useState } from "react";
import TestRenderer from "react-test-renderer";
import { useFreshTick } from "@/hooks/useFreshTick";

const { act } = TestRenderer;

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("useFreshTick", () => {
  const intervalCallback = vi.fn();
  let useHook = function () {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { currentValue };
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "setInterval");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return { currentValue };
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    void cleanup();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshTick).toBeDefined();
  });
  it("should increment correctly", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useHook());
    void act(() => {
      vi.advanceTimersByTime(5_000);
    });
    unmount();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(intervalCallback).toHaveBeenCalledTimes(5);
    void act(() => {
      expect(result.current.currentValue).toBe(5);
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.todo(
    "should start timer when started with start function in array destructuring"
  );
});
