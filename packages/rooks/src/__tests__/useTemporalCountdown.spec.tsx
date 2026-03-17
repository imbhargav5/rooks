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
});
