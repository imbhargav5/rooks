import { vi } from "vitest";
/**
 */
import { renderHook } from "@testing-library/react";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";

describe("useDebouncedEffect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDebouncedEffect).toBeDefined();
  });

  it("should debounce the effect execution", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(mockEffect, [value], 500),
      { initialProps: { value: 0 } }
    );

    // Effect should not be called immediately
    expect(mockEffect).not.toHaveBeenCalled();

    // Advance timers
    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Change dependency
    rerender({ value: 1 });
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Advance timers again
    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(2);
  });

  it("should cancel pending effect on rapid dependency changes", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(mockEffect, [value], 500),
      { initialProps: { value: 0 } }
    );

    // Change dependency multiple times rapidly
    rerender({ value: 1 });
    vi.advanceTimersByTime(100);
    rerender({ value: 2 });
    vi.advanceTimersByTime(100);
    rerender({ value: 3 });
    vi.advanceTimersByTime(100);

    // Effect should not have been called yet
    expect(mockEffect).not.toHaveBeenCalled();

    // Advance timers to complete the debounce (400ms more to reach 500ms from last change)
    vi.advanceTimersByTime(400);

    // Effect should be called only once with the latest value
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it("should call cleanup function from effect", () => {
    expect.hasAssertions();
    const mockCleanup = vi.fn();
    const mockEffect = vi.fn(() => mockCleanup);
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(mockEffect, [value], 500),
      { initialProps: { value: 0 } }
    );

    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Change dependency to trigger cleanup
    rerender({ value: 1 });
    expect(mockCleanup).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(2);
  });

  it("should cancel pending effect on unmount", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { unmount } = renderHook(() =>
      useDebouncedEffect(mockEffect, [], 500)
    );

    // Effect should not be called immediately
    expect(mockEffect).not.toHaveBeenCalled();

    // Unmount before debounce completes
    unmount();

    // Advance timers
    vi.advanceTimersByTime(500);

    // Effect should not be called after unmount
    expect(mockEffect).not.toHaveBeenCalled();
  });

  it("should work with leading option", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(mockEffect, [value], 500, { leading: true }),
      { initialProps: { value: 0 } }
    );

    // With leading option, effect should be called immediately
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Change dependency
    rerender({ value: 1 });
    expect(mockEffect).toHaveBeenCalledTimes(2);
  });

  it("should work with trailing option set to false", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useDebouncedEffect(mockEffect, [value], 500, { trailing: false }),
      { initialProps: { value: 0 } }
    );

    expect(mockEffect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    // With trailing: false, effect should not be called
    expect(mockEffect).not.toHaveBeenCalled();

    // Change dependency
    rerender({ value: 1 });
    vi.advanceTimersByTime(500);
    expect(mockEffect).not.toHaveBeenCalled();
  });

  it("should respect default delay of 500ms", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    renderHook(() => useDebouncedEffect(mockEffect, []));

    expect(mockEffect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(499);
    expect(mockEffect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockEffect).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple dependencies", () => {
    expect.hasAssertions();
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ value1, value2 }) =>
        useDebouncedEffect(mockEffect, [value1, value2], 500),
      { initialProps: { value1: 0, value2: "a" } }
    );

    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Change first dependency
    rerender({ value1: 1, value2: "a" });
    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(2);

    // Change second dependency
    rerender({ value1: 1, value2: "b" });
    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(3);

    // Change both dependencies
    rerender({ value1: 2, value2: "c" });
    vi.advanceTimersByTime(500);
    expect(mockEffect).toHaveBeenCalledTimes(4);
  });
});


