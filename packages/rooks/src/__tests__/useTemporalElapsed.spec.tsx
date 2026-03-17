/**
 * @vitest-environment jsdom
 */
import { Temporal } from "@js-temporal/polyfill";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { useTemporalElapsed } from "@/hooks/useTemporalElapsed";

describe("useTemporalElapsed", () => {
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
    expect(useTemporalElapsed).toBeDefined();
  });

  it("should return zero duration initially when since is now", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current).not.toBeNull();
    expect(result.current!.total("second")).toBe(0);
  });

  it("should return elapsed duration from a past instant", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(
      Date.now() - 30_000
    );

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current!.total("second")).toBe(30);
  });

  it("should tick and increase elapsed time", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current!.total("second")).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.total("second")).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(result.current!.total("second")).toBe(3);
  });

  it("should accept an ISO string as since", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:10.000Z"));

    const { result } = renderHook(() =>
      useTemporalElapsed({ since: "2024-01-01T00:00:00Z" })
    );

    expect(result.current!.total("second")).toBe(10);
  });

  it("should accept epoch milliseconds as since", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalElapsed({ since: Date.now() - 5_000 })
    );

    expect(result.current!.total("second")).toBe(5);
  });

  it("should default to mount time when since is omitted", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalElapsed());

    expect(result.current).not.toBeNull();
    expect(result.current!.total("second")).toBe(0);

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(result.current!.total("second")).toBe(2);
  });

  it("should tick at minute precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:30.000Z"));

    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since, precision: "minute" })
    );

    expect(result.current!.total("second")).toBe(0);

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current!.total("second")).toBe(30);
  });

  it("should clear timers on unmount", () => {
    expect.hasAssertions();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useTemporalElapsed());

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  // --- Additional edge case tests ---

  it("should return a Temporal.Duration instance", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current).toBeInstanceOf(Temporal.Duration);
  });

  it("should return zero duration when since is in the future", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(
      Date.now() + 10_000
    );

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current!.total("second")).toBe(0);
  });

  it("should accumulate multiple seconds of elapsed time", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    for (let i = 1; i <= 5; i++) {
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current!.total("second")).toBe(i);
    }
  });

  it("should handle large elapsed time (1 hour)", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(
      Date.now() - 3_600_000
    );

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current!.total("second")).toBe(3_600);
  });

  it("should align sub-second start to the next second boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.600Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalElapsed({ precision: "second" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(400);
  });

  it("should schedule full 1000ms at exact second boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalElapsed({ precision: "second" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(1_000);
  });

  it("should schedule full 60000ms at exact minute boundary for minute precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalElapsed({ precision: "minute" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(60_000);
  });

  it("should not update between precision boundaries for minute precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since, precision: "minute" })
    );

    // 30 seconds in — no minute boundary crossed, no update
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current!.total("second")).toBe(0);
  });

  it("should report elapsed in milliseconds accurately", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(
      Date.now() - 2_500
    );

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    expect(result.current!.total("millisecond")).toBe(2_500);
  });

  it("should handle since at Unix epoch", () => {
    expect.hasAssertions();
    const since = Temporal.Instant.fromEpochMilliseconds(0);

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    // From epoch to 2024-01-01T00:00:00Z
    expect(result.current!.total("second")).toBe(1_704_067_200);
  });

  it("should not create new timers after unmount", () => {
    expect.hasAssertions();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const { unmount } = renderHook(() => useTemporalElapsed());

    unmount();

    const callsAfterUnmount = setTimeoutSpy.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(setTimeoutSpy.mock.calls.length).toBe(callsAfterUnmount);
  });

  it("should reschedule timer after each tick", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalElapsed({ precision: "second" }));

    const callsBefore = setTimeoutSpy.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it("should handle elapsed with no options defaulting to second precision", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.500Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalElapsed());

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    // 500ms into the second, so 500ms to next boundary
    expect(lastDelay).toBe(500);
  });

  it("should provide consistent elapsed values across ticks", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const since = Temporal.Instant.fromEpochMilliseconds(Date.now());

    const { result } = renderHook(() =>
      useTemporalElapsed({ since })
    );

    const values: number[] = [];

    for (let i = 0; i < 3; i++) {
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      values.push(result.current!.total("second"));
    }

    // Each value should be strictly increasing
    expect(values[0]).toBeLessThan(values[1]!);
    expect(values[1]).toBeLessThan(values[2]!);
  });

  it("should accept ISO string with timezone offset as since", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T01:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalElapsed({ since: "2024-01-01T01:00:00+01:00" })
    );

    // 01:00+01:00 = 00:00 UTC, current time is 01:00 UTC, so 1 hour elapsed
    expect(result.current!.total("second")).toBe(3_600);
  });

  it("should return non-null on the client", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalElapsed());

    expect(result.current).not.toBeNull();
  });

  it("should return zero when since equals current time exactly", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalElapsed({ since: Date.now() })
    );

    expect(result.current!.total("millisecond")).toBe(0);
  });
});
