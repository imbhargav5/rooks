import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useCounter } from "../hooks/useCounter";

describe("useCounter", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCounter).toBeDefined();
  });

  describe("initialization", () => {
    it("should initialize with provided value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      expect(result.current.value).toBe(5);
    });

    it("should initialize with zero", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      expect(result.current.value).toBe(0);
    });

    it("should initialize with negative values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(-10));

      expect(result.current.value).toBe(-10);
    });

    it("should initialize with decimal values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(3.14));

      expect(result.current.value).toBe(3.14);
    });
  });

  describe("increment", () => {
    it("should increment by 1", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(1);
    });

    it("should increment multiple times", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.value).toBe(3);
    });

    it("should increment from negative values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(-5));

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(-4);
    });

    it("should increment from decimal values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(1.5));

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(2.5);
    });
  });

  describe("decrement", () => {
    it("should decrement by 1", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(4);
    });

    it("should decrement multiple times", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.value).toBe(7);
    });

    it("should decrement to negative values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(-1);
    });

    it("should decrement from decimal values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(3.7));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(2.7);
    });
  });

  describe("incrementBy", () => {
    it("should increment by specified amount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.incrementBy(5);
      });

      expect(result.current.value).toBe(5);
    });

    it("should increment by zero (no change)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.incrementBy(0);
      });

      expect(result.current.value).toBe(10);
    });

    it("should increment by negative amount (decrement)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.incrementBy(-3);
      });

      expect(result.current.value).toBe(7);
    });

    it("should increment by decimal amount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(1.1));

      act(() => {
        result.current.incrementBy(2.3);
      });

      expect(result.current.value).toBeCloseTo(3.4);
    });

    it("should handle multiple incrementBy operations", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.incrementBy(5);
        result.current.incrementBy(3);
        result.current.incrementBy(-2);
      });

      expect(result.current.value).toBe(6);
    });
  });

  describe("decrementBy", () => {
    it("should decrement by specified amount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrementBy(3);
      });

      expect(result.current.value).toBe(7);
    });

    it("should decrement by zero (no change)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrementBy(0);
      });

      expect(result.current.value).toBe(5);
    });

    it("should decrement by negative amount (increment)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrementBy(-3);
      });

      expect(result.current.value).toBe(8);
    });

    it("should decrement by decimal amount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5.5));

      act(() => {
        result.current.decrementBy(1.2);
      });

      expect(result.current.value).toBeCloseTo(4.3);
    });

    it("should handle multiple decrementBy operations", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(20));

      act(() => {
        result.current.decrementBy(5);
        result.current.decrementBy(3);
        result.current.decrementBy(2);
      });

      expect(result.current.value).toBe(10);
    });

    it("should decrement to negative values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrementBy(10);
      });

      expect(result.current.value).toBe(-5);
    });
  });

  describe("reset", () => {
    it("should reset to initial value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.value).toBe(7);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(5);
    });

    it("should reset to zero when initialized with zero", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.incrementBy(15);
      });

      expect(result.current.value).toBe(15);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(0);
    });

    it("should reset to negative initial value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(-3));

      act(() => {
        result.current.incrementBy(10);
      });

      expect(result.current.value).toBe(7);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(-3);
    });

    it("should reset to decimal initial value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(2.5));

      act(() => {
        result.current.incrementBy(10);
      });

      expect(result.current.value).toBe(12.5);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(2.5);
    });

    it("should reset multiple times", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(7));

      act(() => {
        result.current.increment();
        result.current.reset();
        result.current.increment();
        result.current.reset();
      });

      expect(result.current.value).toBe(7);
    });
  });

  describe("combined operations", () => {
    it("should handle complex sequence of operations", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment(); // 11
        result.current.decrementBy(5); // 6
        result.current.incrementBy(3); // 9
        result.current.decrement(); // 8
        result.current.reset(); // 10
        result.current.incrementBy(-2); // 8
      });

      expect(result.current.value).toBe(8);
    });

    it("should maintain consistency across re-renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useCounter(0));

      act(() => {
        result.current.incrementBy(5);
      });

      rerender();

      expect(result.current.value).toBe(5);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(4);
    });
  });

  describe("function reference stability", () => {
    it("should maintain stable function references", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useCounter(0));

      const initialHandlers = {
        increment: result.current.increment,
        decrement: result.current.decrement,
        incrementBy: result.current.incrementBy,
        decrementBy: result.current.decrementBy,
        reset: result.current.reset,
      };

      rerender();

      expect(result.current.increment).toBe(initialHandlers.increment);
      expect(result.current.decrement).toBe(initialHandlers.decrement);
      expect(result.current.incrementBy).toBe(initialHandlers.incrementBy);
      expect(result.current.decrementBy).toBe(initialHandlers.decrementBy);
      expect(result.current.reset).toBe(initialHandlers.reset);
    });

    it("should update reset function when initial value changes", () => {
      expect.hasAssertions();
      let initialValue = 0;
      const { result, rerender } = renderHook(() => useCounter(initialValue));

      const initialReset = result.current.reset;

      act(() => {
        result.current.incrementBy(5);
      });

      initialValue = 10;
      rerender();

      expect(result.current.reset).not.toBe(initialReset);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe(10);
    });
  });

  describe("edge cases", () => {
    it("should handle very large numbers", () => {
      expect.hasAssertions();
      const largeNumber = Number.MAX_SAFE_INTEGER;
      const { result } = renderHook(() => useCounter(largeNumber));

      expect(result.current.value).toBe(largeNumber);
    });

    it("should handle very small numbers", () => {
      expect.hasAssertions();
      const smallNumber = Number.MIN_SAFE_INTEGER;
      const { result } = renderHook(() => useCounter(smallNumber));

      expect(result.current.value).toBe(smallNumber);
    });

    it("should handle infinity", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(Infinity));

      expect(result.current.value).toBe(Infinity);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(Infinity);
    });

    it("should handle negative infinity", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(-Infinity));

      expect(result.current.value).toBe(-Infinity);

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(-Infinity);
    });
  });

  describe("return value structure", () => {
    it("should return an object with correct properties", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useCounter(0));

      expect(result.current).toHaveProperty("value");
      expect(result.current).toHaveProperty("increment");
      expect(result.current).toHaveProperty("decrement");
      expect(result.current).toHaveProperty("incrementBy");
      expect(result.current).toHaveProperty("decrementBy");
      expect(result.current).toHaveProperty("reset");

      expect(typeof result.current.increment).toBe("function");
      expect(typeof result.current.decrement).toBe("function");
      expect(typeof result.current.incrementBy).toBe("function");
      expect(typeof result.current.decrementBy).toBe("function");
      expect(typeof result.current.reset).toBe("function");
      expect(typeof result.current.value).toBe("number");
    });
  });
});