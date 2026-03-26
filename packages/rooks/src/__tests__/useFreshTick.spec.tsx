import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEffect, useState } from "react";
import { useFreshTick } from "@/hooks/useFreshTick";

describe("useFreshTick", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshTick).toBeDefined();
  });

  it("should return a function", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useFreshTick(callback));
    expect(typeof result.current).toBe("function");
  });

  it("should call the callback when tick is invoked", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useFreshTick(callback));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should forward arguments to the callback", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useFreshTick(callback));

    act(() => {
      result.current("hello", "world");
    });

    expect(callback).toHaveBeenCalledWith("hello", "world");
  });

  it("should always call the latest callback", () => {
    expect.hasAssertions();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useFreshTick(cb),
      { initialProps: { cb: callback1 } }
    );

    act(() => {
      result.current();
    });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(0);

    rerender({ cb: callback2 });

    act(() => {
      result.current();
    });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should solve the stale closure problem", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const increment = () => setCount(count + 1);
      const freshIncrement = useFreshTick(increment);
      return { count, freshIncrement };
    });

    act(() => {
      result.current.freshIncrement();
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.freshIncrement();
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.freshIncrement();
    });
    expect(result.current.count).toBe(3);
  });

  describe("with fake timers", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should work correctly with setInterval", () => {
      expect.hasAssertions();
      const intervalCallback = vi.fn();
      const { result, unmount } = renderHook(() => {
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
      });

      expect(result.current.currentValue).toBe(0);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(1);
      expect(intervalCallback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(2);
      expect(intervalCallback).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(3);
      expect(intervalCallback).toHaveBeenCalledTimes(3);

      unmount();
    });

    it("should stop calling after unmount", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      const { unmount } = renderHook(() => {
        const freshTick = useFreshTick(callback);
        useEffect(() => {
          const intervalId = setInterval(() => {
            freshTick();
          }, 1_000);
          return () => clearInterval(intervalId);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
      });

      act(() => {
        vi.advanceTimersByTime(2_000);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      unmount();

      act(() => {
        vi.advanceTimersByTime(3_000);
      });
      // No more calls after unmount since interval was cleared
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
