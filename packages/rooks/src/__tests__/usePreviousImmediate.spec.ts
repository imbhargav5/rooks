import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { usePreviousImmediate } from "@/hooks/usePreviousImmediate";

describe("usePreviousImmediate", () => {
  let useHook = (): {
    increment: () => void;
    previousValue: number | null;
    value: number;
  } => {
    return {
      increment: () => {},
      previousValue: 5,
      value: 6,
    };
  };

  beforeEach(() => {
    useHook = function () {
      const [value, setValue] = useState(0);
      const previousValue = usePreviousImmediate(value);
      const increment = () => {
        setValue(value + 1);
      };

      return { increment, previousValue, value };
    };
  });
  it("isDefined", async () => {
    expect.hasAssertions();
    expect(usePreviousImmediate).toBeDefined();
  });
  it("initially returns null", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook());
    expect(result.current.previousValue).toBeNull();
  });

  it("holds the previous value", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook());
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
    expect(result.current.previousValue).toBe(0);
  });

  it("tracks the previous value across multiple increments", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook());

    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
    expect(result.current.previousValue).toBe(0);

    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(2);
    expect(result.current.previousValue).toBe(1);

    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(3);
    expect(result.current.previousValue).toBe(2);
  });

  it("works with string values", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ val }) => {
        const previousValue = usePreviousImmediate(val);
        return { previousValue, val };
      },
      { initialProps: { val: "first" } }
    );

    expect(result.current.previousValue).toBeNull();

    rerender({ val: "second" });
    expect(result.current.previousValue).toBe("first");

    rerender({ val: "third" });
    expect(result.current.previousValue).toBe("second");
  });

  it("returns the previous render's value even when value is unchanged on re-render", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(
      ({ val }) => {
        const previousValue = usePreviousImmediate(val);
        return { previousValue, val };
      },
      { initialProps: { val: 42 } }
    );

    expect(result.current.previousValue).toBeNull();

    // Re-render with the same value — the effect still runs (no dep array)
    // so previousRef gets set to 42, and on the next render it returns 42.
    rerender({ val: 42 });
    expect(result.current.previousValue).toBe(42);

    rerender({ val: 42 });
    expect(result.current.previousValue).toBe(42);
  });
});
