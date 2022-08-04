/**
 * @jest-environment jsdom
 */
import { renderHook, cleanup, act } from "@testing-library/react-hooks";
import { useCallback, useEffect, useState } from "react";
import { useFreshRef } from "../hooks/useFreshRef";

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("useFreshRef", () => {
  let useHook: () => { currentValue: number };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
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
        const intervalId = setInterval(tick, 1_000);

        return () => {
          clearInterval(intervalId);
        };
      }, []);

      return { currentValue };
    };
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshRef).toBeDefined();
  });
  it("should increment correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(useHook);
    act(() => {
      jest.advanceTimersByTime(5_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(5);
  });

  test("should use stale state", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const increment = () => {
        setCount(count + 1);
      };

      const handler = useCallback(() => {
        increment();
      }, []);

      return {
        count,
        handler,
      } as const;
    });
    const handlers: Array<() => void> = [];
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    expect(result.current.count).toEqual(1);
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    expect(result.current.count).toEqual(1);
    expect(handlers.every((function_) => function_ === handlers[0])).toBe(true);
  });

  test("should use the latest state via fresh ref and return stable ref object won’t and won't change on re-renders", async () => {
    expect.assertions(8);
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const increment = () => {
        setCount(count + 1);
      };
      const ref = useFreshRef<typeof increment>(increment);

      const handler = useCallback(() => {
        ref.current();
      }, [ref]);

      return { count, handler, ref } as const;
    });
    const handlers: Array<() => void> = [];
    const references: Array<typeof result.current.ref> = [];
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    references.push(result.current.ref);
    expect(result.current.count).toEqual(1);
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    references.push(result.current.ref);
    expect(result.current.count).toEqual(2);
    act(() => {
      result.current.handler();
    });
    handlers.push(result.current.handler);
    references.push(result.current.ref);
    handlers.forEach((function_) => {
      expect(function_).toBe(handlers[0]);
    });
    references.forEach((ref) => {
      expect(ref).toBe(references[0]);
    });
  });
});
