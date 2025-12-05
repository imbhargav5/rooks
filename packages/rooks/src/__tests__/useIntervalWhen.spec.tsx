import { vi } from "vitest";
/**
 */
import { renderHook, cleanup } from "@testing-library/react";
import { useState } from "react";
import TestRenderer from "react-test-renderer";
import { useIntervalWhen } from "@/hooks/useIntervalWhen";

const { act } = TestRenderer;
type UseHook = (
  when: boolean,
  eager?: boolean
) => {
  currentValue: number;
};
describe.skip("useIntervalWhen", () => {
  let useHook: UseHook = () => ({
    currentValue: 5,
  });

  const EAGER = true;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "setInterval");
    useHook = function (when: boolean, eager = false) {
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
    void cleanup();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIntervalWhen).toBeDefined();
  });
  it("should start timer when started with start function", () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const { result } = renderHook(() => useHook(true));
    void act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);
    vi.useRealTimers();
  });

  it("should call the callback eagerly", () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const { result } = renderHook(() => useHook(true, EAGER));
    // The value was already incremented because we use useIntervalWhen in EAGER mode
    expect(result.current.currentValue).toBe(1);
    void act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    // The value was incremented twice: one time by the setInterval and one time due to the EAGER
    expect(result.current.currentValue).toBe(2);
    vi.useRealTimers();
  });

  it("should not start the timer when the condition is false", () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const { result } = renderHook(() => useHook(false));
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(0);
    expect(result.current.currentValue).toBe(0);
    vi.useRealTimers();
  });
  it("should stop the timer when the condition becomes false", () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ when }) => useHook(when), {
      initialProps: { when: true },
    });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);

    rerender({ when: false });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current.currentValue).toBe(1);
    vi.useRealTimers();
  });
  it("should resume the timer when the condition becomes true again", () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ when }) => useHook(when), {
      initialProps: { when: true },
    });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(result.current.currentValue).toBe(1);

    rerender({ when: false });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current.currentValue).toBe(1);

    rerender({ when: true });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current.currentValue).toBe(2);
    vi.useRealTimers();
  });
});
