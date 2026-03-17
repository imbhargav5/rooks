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
});
