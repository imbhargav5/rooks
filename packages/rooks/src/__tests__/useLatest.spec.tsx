import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEffect, useState } from "react";
import { useLatest } from "@/hooks/useLatest";

describe("useLatest", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useLatest).toBeDefined();
  });

  it("should return a ref with the initial value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useLatest(42));
    expect(result.current.current).toBe(42);
  });

  it("should update ref.current synchronously when value changes", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useLatest(value),
      { initialProps: { value: "hello" } }
    );
    expect(result.current.current).toBe("hello");

    rerender({ value: "world" });
    expect(result.current.current).toBe("world");
  });

  it("should return a stable ref object across re-renders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useLatest(value),
      { initialProps: { value: 1 } }
    );
    const refBefore = result.current;

    rerender({ value: 2 });
    const refAfter = result.current;

    expect(refBefore).toBe(refAfter);
  });

  it("should work with function values", () => {
    expect.hasAssertions();
    const fn1 = () => "first";
    const fn2 = () => "second";

    const { result, rerender } = renderHook(
      ({ fn }) => useLatest(fn),
      { initialProps: { fn: fn1 } }
    );
    expect(result.current.current).toBe(fn1);
    expect(result.current.current()).toBe("first");

    rerender({ fn: fn2 });
    expect(result.current.current).toBe(fn2);
    expect(result.current.current()).toBe("second");
  });

  it("should work with object values", () => {
    expect.hasAssertions();
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };

    const { result, rerender } = renderHook(
      ({ obj }) => useLatest(obj),
      { initialProps: { obj: obj1 } }
    );
    expect(result.current.current).toBe(obj1);

    rerender({ obj: obj2 });
    expect(result.current.current).toBe(obj2);
  });

  it("should work with null and undefined values", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useLatest<string | null | undefined>(value),
      { initialProps: { value: "test" as string | null | undefined } }
    );
    expect(result.current.current).toBe("test");

    rerender({ value: null });
    expect(result.current.current).toBeNull();

    rerender({ value: undefined });
    expect(result.current.current).toBeUndefined();
  });

  it("should solve the stale closure problem in callbacks", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const latestCount = useLatest(count);

      function handleClick() {
        // Always reads the latest count, no stale closure
        setCount(latestCount.current + 1);
      }

      return { count, handleClick };
    });

    act(() => {
      result.current.handleClick();
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.handleClick();
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.handleClick();
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

    it("should allow interval callback to use the latest value without re-registering the interval", () => {
      expect.hasAssertions();
      const { result, unmount } = renderHook(() => {
        const [currentValue, setCurrentValue] = useState(0);
        function increment() {
          setCurrentValue(currentValue + 1);
        }
        const latestIncrement = useLatest(increment);

        useEffect(() => {
          const intervalId = setInterval(() => {
            latestIncrement.current();
          }, 1_000);
          return () => clearInterval(intervalId);
        }, []); // empty deps — interval registered once, always uses latest

        return { currentValue };
      });

      expect(result.current.currentValue).toBe(0);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(1);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(2);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(3);

      unmount();
    });
  });
});
