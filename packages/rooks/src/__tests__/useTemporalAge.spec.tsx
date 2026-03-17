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

  // --- Additional edge case tests ---

  it("should handle exact birthday (full year anniversary)", () => {
    expect.hasAssertions();
    // Current date is 2024-06-15
    const { result } = renderHook(() =>
      useTemporalAge({ date: "2000-06-15", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(24);
    expect(result.current!.months).toBe(0);
    expect(result.current!.days).toBe(0);
  });

  it("should handle leap year birthday (Feb 29)", () => {
    expect.hasAssertions();
    // 2024 is a leap year, current date is June 15, 2024
    const { result } = renderHook(() =>
      useTemporalAge({ date: "2000-02-29", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(24);
    expect(result.current!.months).toBe(3);
    expect(result.current!.days).toBe(17);
  });

  it("should handle very old age (100+ years)", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "1920-01-01", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(104);
    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(14);
  });

  it("should handle born yesterday", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-06-14", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(0);
    expect(result.current!.days).toBe(1);
  });

  it("should handle born one month ago", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-05-15", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(1);
    expect(result.current!.days).toBe(0);
  });

  it("should handle born one year ago", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2023-06-15", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(1);
    expect(result.current!.months).toBe(0);
    expect(result.current!.days).toBe(0);
  });

  it("should handle born on Dec 31", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2023-12-31", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(15);
  });

  it("should handle born on Jan 1", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-01-01", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(5);
    expect(result.current!.days).toBe(14);
  });

  it("should produce consistent years between duration and convenience field", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "1985-07-20", timeZone: "UTC" })
    );

    expect(result.current!.duration.years).toBe(result.current!.years);
    expect(result.current!.duration.months).toBe(result.current!.months);
    expect(result.current!.duration.days).toBe(result.current!.days);
  });

  it("should give same result for string and PlainDate inputs", () => {
    expect.hasAssertions();

    const stringHook = renderHook(() =>
      useTemporalAge({ date: "1995-03-10", timeZone: "UTC" })
    );
    const plainDateHook = renderHook(() =>
      useTemporalAge({
        date: Temporal.PlainDate.from("1995-03-10"),
        timeZone: "UTC",
      })
    );

    expect(stringHook.result.current!.years).toBe(
      plainDateHook.result.current!.years
    );
    expect(stringHook.result.current!.months).toBe(
      plainDateHook.result.current!.months
    );
    expect(stringHook.result.current!.days).toBe(
      plainDateHook.result.current!.days
    );
  });

  it("should handle non-UTC timezone where local date differs", () => {
    expect.hasAssertions();
    // 2024-06-15 23:00 UTC = 2024-06-16 01:00 in Europe/Athens (UTC+3)
    vi.setSystemTime(new Date("2024-06-15T23:00:00.000Z"));

    const utcHook = renderHook(() =>
      useTemporalAge({ date: "2024-06-15", timeZone: "UTC" })
    );
    const athensHook = renderHook(() =>
      useTemporalAge({ date: "2024-06-15", timeZone: "Europe/Athens" })
    );

    // In UTC it's still June 15 → 0 days old
    expect(utcHook.result.current!.days).toBe(0);
    // In Athens it's already June 16 → 1 day old
    expect(athensHook.result.current!.days).toBe(1);
  });

  it("should update age at timezone-specific day boundary", () => {
    expect.hasAssertions();
    // 2024-06-15T20:59:59.500Z → in America/New_York (UTC-4) this is 16:59:59.500
    // Day boundary for NY is at 2024-06-16T04:00:00Z
    vi.setSystemTime(new Date("2024-06-16T03:59:59.500Z"));

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-06-15", timeZone: "America/New_York" })
    );

    // In NY it's still June 15 → 0 days
    expect(result.current!.days).toBe(0);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now it's 04:00:00 UTC = midnight in NY = June 16 → 1 day
    expect(result.current!.days).toBe(1);
  });

  it("should handle multiple day boundary transitions", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-06-15T23:59:59.000Z"));

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-06-14", timeZone: "UTC" })
    );

    expect(result.current!.days).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current!.days).toBe(2);

    // Advance one full day
    act(() => {
      vi.advanceTimersByTime(86_400_000);
    });

    expect(result.current!.days).toBe(3);
  });

  it("should not create new timers after unmount", () => {
    expect.hasAssertions();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

    const { unmount } = renderHook(() =>
      useTemporalAge({ date: "1990-01-01", timeZone: "UTC" })
    );

    unmount();

    const callsAfterUnmount = setTimeoutSpy.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(86_400_000);
    });

    expect(setTimeoutSpy.mock.calls.length).toBe(callsAfterUnmount);
  });

  it("should handle birthday at end of month (Jan 31)", () => {
    expect.hasAssertions();
    // From Jan 31 to June 15 = 4 months and 15 days
    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-01-31", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(4);
    expect(result.current!.days).toBe(15);
  });

  it("should handle age calculation across year boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2025-01-15T12:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2024-11-20", timeZone: "UTC" })
    );

    expect(result.current!.years).toBe(0);
    expect(result.current!.months).toBe(1);
    expect(result.current!.days).toBe(26);
  });

  it("should return non-null on the client", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useTemporalAge({ date: "2000-01-01", timeZone: "UTC" })
    );

    expect(result.current).not.toBeNull();
  });
});
