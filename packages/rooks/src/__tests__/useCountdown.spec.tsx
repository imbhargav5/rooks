import { vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "@/hooks/useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is defined", () => {
    expect.hasAssertions();
    expect(useCountdown).toBeDefined();
  });

  it("counts down at the configured interval", () => {
    expect.hasAssertions();
    const endTime = new Date(Date.now() + 3_000);

    const { result } = renderHook(() => useCountdown(endTime));

    expect(result.current).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current).toBe(2);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(result.current).toBe(0);
  });

  it("calls onDown on each tick and onEnd when the countdown finishes", () => {
    expect.hasAssertions();
    const onDown = vi.fn();
    const onEnd = vi.fn();
    const endTime = new Date(Date.now() + 2_000);

    renderHook(() =>
      useCountdown(endTime, {
        interval: 1_000,
        onDown,
        onEnd,
      })
    );

    expect(onDown).toHaveBeenCalledTimes(1);
    expect(onEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(onDown.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(onEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(onEnd.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
