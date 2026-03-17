/**
 * @vitest-environment jsdom
 */
import { Temporal } from "@js-temporal/polyfill";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { useTemporalCountdown } from "@/hooks/useTemporalCountdown";

describe("useTemporalCountdown", () => {
  const originalTemporal = (
    globalThis as typeof globalThis & {
      Temporal?: typeof Temporal;
    }
  ).Temporal;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    (
      globalThis as typeof globalThis & { Temporal?: typeof Temporal }
    ).Temporal = Temporal;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();

    if (originalTemporal) {
      (
        globalThis as typeof globalThis & { Temporal?: typeof Temporal }
      ).Temporal = originalTemporal;
    } else {
      delete (globalThis as typeof globalThis & { Temporal?: typeof Temporal })
        .Temporal;
    }
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTemporalCountdown).toBeDefined();
  });

  it("should return remaining duration until target", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 10_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current).not.toBeNull();
    expect(result.current!.done).toBe(false);
    expect(result.current!.remaining.total("second")).toBe(10);
  });

  it("should tick down at second precision", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 3_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.remaining.total("second")).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.remaining.total("second")).toBe(2);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.remaining.total("second")).toBe(1);
  });

  it("should mark done when target is reached", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 1_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.done).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.done).toBe(true);
    expect(result.current!.remaining.total("second")).toBe(0);
  });

  it("should return done immediately if target is in the past", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() - 5_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.done).toBe(true);
    expect(result.current!.remaining.total("second")).toBe(0);
  });

  it("should accept an ISO string as target", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalCountdown({ target: "2024-01-01T00:00:05Z" })
    );

    expect(result.current!.remaining.total("second")).toBe(5);
    expect(result.current!.done).toBe(false);
  });

  it("should accept epoch milliseconds as target", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalCountdown({ target: Date.now() + 7_000 })
    );

    expect(result.current!.remaining.total("second")).toBe(7);
  });

  it("should tick at minute precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:30.000Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 120_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target, precision: "minute" })
    );

    const initialSeconds = result.current!.remaining.total("second");

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    const afterTickSeconds = result.current!.remaining.total("second");
    expect(afterTickSeconds).toBeLessThan(initialSeconds);
  });

  it("should clear timers on unmount", () => {
    expect.hasAssertions();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 60_000
    );

    const { unmount } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  // --- Additional edge case tests ---

  it("should return a Temporal.Duration instance for remaining", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 5_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.remaining).toBeInstanceOf(Temporal.Duration);
  });

  it("should return zero duration (not negative) for past target", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() - 10_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.remaining.total("millisecond")).toBe(0);
    expect(result.current!.done).toBe(true);
  });

  it("should stop ticking after target is reached", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 2_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(result.current!.done).toBe(true);

    const doneSnapshot = result.current;

    // Advance more time — result should not change
    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(result.current!.done).toBe(true);
    expect(result.current!.remaining.total("second")).toBe(0);
  });

  it("should handle target exactly at current time", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.done).toBe(true);
    expect(result.current!.remaining.total("second")).toBe(0);
  });

  it("should count down a large duration (1 hour)", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 3_600_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.remaining.total("second")).toBe(3_600);
    expect(result.current!.done).toBe(false);
  });

  it("should align sub-second start to the next second boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.700Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 5_000
    );

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalCountdown({ target }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(300);
  });

  it("should tick down through multiple seconds sequentially", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 5_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    for (let expected = 4; expected >= 0; expected--) {
      act(() => {
        vi.advanceTimersByTime(1_000);
      });

      expect(result.current!.remaining.total("second")).toBe(expected);
    }

    expect(result.current!.done).toBe(true);
  });

  it("should accept an ISO string with timezone offset", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalCountdown({ target: "2024-01-01T01:00:00+01:00" })
    );

    // 01:00+01:00 = 00:00 UTC = now, so should be done
    expect(result.current!.done).toBe(true);
  });

  it("should handle very short countdown (sub-second)", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.800Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 500
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current!.done).toBe(false);

    // Advance to next second boundary (200ms away), which overshoots target
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // After the tick, time is at 00:00:01.000, target was at 00:00:01.300
    // So we're not done yet necessarily — depends on exact timing
    // But after 500 more ms we should be done
    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.done).toBe(true);
  });

  it("should handle minute precision countdown to exact minute", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 60_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target, precision: "minute" })
    );

    expect(result.current!.remaining.total("second")).toBe(60);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current!.done).toBe(true);
  });

  it("should not update between precision boundaries for minute precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 180_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target, precision: "minute" })
    );

    const initial = result.current!.remaining.total("second");

    // Advance 30 seconds — should not trigger a tick at minute precision
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    // At minute precision, the first tick is at 60s boundary
    expect(result.current!.remaining.total("second")).toBe(initial);
  });

  it("should return remaining duration with millisecond precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 2_500
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    // Remaining should include milliseconds
    const ms = result.current!.remaining.total("millisecond");
    expect(ms).toBe(2_500);
  });

  it("should not create new timers after unmount", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 10_000
    );

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const { unmount } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    unmount();

    const callsAfterUnmount = setTimeoutSpy.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    // No new setTimeout calls should have been made after unmount
    expect(setTimeoutSpy.mock.calls.length).toBe(callsAfterUnmount);
  });

  it("should return non-null on the client", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 5_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(result.current).not.toBeNull();
  });

  it("should have done as a boolean type", () => {
    expect.hasAssertions();
    const target = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 5_000
    );

    const { result } = renderHook(() =>
      useTemporalCountdown({ target })
    );

    expect(typeof result.current!.done).toBe("boolean");
  });
});
