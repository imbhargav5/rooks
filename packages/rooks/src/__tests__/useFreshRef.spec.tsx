import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCallback, useEffect, useState } from "react";
import { useFreshRef } from "@/hooks/useFreshRef";

describe("useFreshRef", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshRef).toBeDefined();
  });

  it("should return a ref with the initial value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useFreshRef(42));
    expect(result.current.current).toBe(42);
  });

  it("should update ref.current when value changes", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useFreshRef(value),
      { initialProps: { value: "hello" } }
    );
    expect(result.current.current).toBe("hello");

    rerender({ value: "world" });
    expect(result.current.current).toBe("world");
  });

  it("should return a stable ref object across re-renders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useFreshRef(value),
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
      ({ fn }) => useFreshRef(fn),
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
      ({ obj }) => useFreshRef(obj),
      { initialProps: { obj: obj1 } }
    );
    expect(result.current.current).toBe(obj1);

    rerender({ obj: obj2 });
    expect(result.current.current).toBe(obj2);
  });

  it("should work with null and undefined values", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ value }) => useFreshRef<string | null | undefined>(value),
      { initialProps: { value: "test" as string | null | undefined } }
    );
    expect(result.current.current).toBe("test");

    rerender({ value: null });
    expect(result.current.current).toBeNull();

    rerender({ value: undefined });
    expect(result.current.current).toBeUndefined();
  });

  it("should solve stale closure problem with useCallback", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const increment = () => {
        setCount(count + 1);
      };
      const ref = useFreshRef(increment);

      // handler is memoized once but ref.current always has latest increment
      const handler = useCallback(() => {
        ref.current();
      }, [ref]);

      return { count, handler, ref };
    });

    // handler stays stable across renders
    const handlerBefore = result.current.handler;

    act(() => {
      result.current.handler();
    });
    expect(result.current.count).toBe(1);

    const handlerAfter = result.current.handler;
    expect(handlerAfter).toBe(handlerBefore);

    act(() => {
      result.current.handler();
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.handler();
    });
    expect(result.current.count).toBe(3);
  });

  it("should keep ref stable while handler is memoized", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const increment = () => setCount(count + 1);
      const ref = useFreshRef(increment);
      const handler = useCallback(() => ref.current(), [ref]);
      return { count, handler, ref };
    });

    const refs: Array<typeof result.current.ref> = [];
    const handlers: Array<typeof result.current.handler> = [];

    refs.push(result.current.ref);
    handlers.push(result.current.handler);

    act(() => {
      result.current.handler();
    });

    refs.push(result.current.ref);
    handlers.push(result.current.handler);

    act(() => {
      result.current.handler();
    });

    refs.push(result.current.ref);
    handlers.push(result.current.handler);

    // All refs should be the same object
    expect(refs.every((r) => r === refs[0])).toBe(true);
    // All handlers should be the same function (memoized)
    expect(handlers.every((h) => h === handlers[0])).toBe(true);
  });

  describe("with fake timers", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should allow interval callback to use fresh state", () => {
      expect.hasAssertions();
      const { result, unmount } = renderHook(() => {
        const [currentValue, setCurrentValue] = useState(0);
        function increment() {
          setCurrentValue(currentValue + 1);
        }
        const freshIncrementRef = useFreshRef(increment);

        useEffect(() => {
          const intervalId = setInterval(() => {
            freshIncrementRef.current();
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

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(2);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(3);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(4);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.currentValue).toBe(5);

      unmount();
    });
  });
});
