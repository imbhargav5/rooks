/**
 * @vitest-environment jsdom
 */
import { Temporal } from "@js-temporal/polyfill";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { useTemporalAge } from "@/hooks/useTemporalAge";

describe("useTemporalAge", () => {
  const originalTemporal = (
    globalThis as typeof globalThis & {
      Temporal?: typeof Temporal;
    }
  ).Temporal;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
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
    expect(useTemporalAge).toBeDefined();
  });

  it("should return age in years, months, and days", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "1990-03-25", timeZone: "UTC" })
    );

    expect(result.current).not.toBeNull();
    expect(result.current!.years).toBe(34);
    expect(result.current!.months).toBe(2);
    expect(result.current!.days).toBe(21);
  });

  it("should accept a Temporal.PlainDate", () => {
    expect.hasAssertions();

    const birthDate = Temporal.PlainDate.from("2000-01-01");

    const { result } = renderHook(() =>
      useTemporalAge({ date: birthDate, timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(24);
    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(14);
  });

  it("should return zero duration for today's date", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-06-15", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(0);
    expect(result.current!.days).toBe(0);
  });

  it("should update at day boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-06-15T23:59:59.500Z"));

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-01-01", timeZone: "UTC" })
    );

    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(14);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(15);
  });

  it("should provide a duration object", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2020-06-15", timeZone: "UTC" })
    );

    expect(result.current!.duration).toBeInstanceOf(Temporal.Duration);
    expect(result.current!.duration.years).toBe(4);
  });

  it("should clear timers on unmount", () => {
    expect.hasAssertions();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() =>
      useTemporalAge({ date: "1990-01-01", timeZone: "UTC" })
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
