/**
 * @vitest-environment jsdom
 */
import { Temporal } from "@js-temporal/polyfill";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { useTemporalNow } from "@/hooks/useTemporalNow";

describe("useTemporalNow", () => {
  const originalTemporal = (
    globalThis as typeof globalThis & {
      Temporal?: typeof Temporal;
    }
  ).Temporal;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.250Z"));
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
    expect(useTemporalNow).toBeDefined();
  });

  it("should return the current instant after hydration", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalNow());

    expect(result.current?.toString()).toBe(
      Temporal.Instant.fromEpochMilliseconds(Date.now()).toString()
    );
  });

  it("should update on the next second boundary", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalNow());

    expect(result.current?.epochMilliseconds).toBe(1_704_067_200_250);

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(result.current?.epochMilliseconds).toBe(1_704_067_201_000);
  });

  it("should align minute precision to the next minute boundary", async () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:15.100Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ precision: "minute" })
    );

    act(() => {
      vi.advanceTimersByTime(44_900);
    });

    expect(result.current?.epochMilliseconds).toBe(1_704_067_260_000);
  });

  it("should align day precision using the provided time zone", async () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T23:59:59.500Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDate", precision: "day", timeZone: "UTC" })
    );

    expect(result.current?.toString()).toBe("2024-01-01");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current?.toString()).toBe("2024-01-02");
  });

  it("should derive zoned and plain values", async () => {
    expect.hasAssertions();

    const zoned = renderHook(() =>
      useTemporalNow({ kind: "zoned", timeZone: "UTC" })
    );
    const plainDateTime = renderHook(() =>
      useTemporalNow({ kind: "plainDateTime", timeZone: "UTC" })
    );
    const plainDate = renderHook(() =>
      useTemporalNow({ kind: "plainDate", timeZone: "UTC" })
    );

    expect(zoned.result.current?.toString()).toContain("+00:00[UTC]");
    expect(plainDateTime.result.current?.toString()).toBe(
      "2024-01-01T00:00:00.25"
    );
    expect(plainDate.result.current?.toString()).toBe("2024-01-01");
  });

  it("should clear timers on unmount", async () => {
    expect.hasAssertions();
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useTemporalNow());

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  // --- Additional edge case tests ---

  it("should return a Temporal.Instant instance by default", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalNow());

    expect(result.current).toBeInstanceOf(Temporal.Instant);
  });

  it("should return a Temporal.ZonedDateTime instance for zoned kind", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalNow({ kind: "zoned", timeZone: "UTC" })
    );

    expect(result.current).toBeInstanceOf(Temporal.ZonedDateTime);
  });

  it("should return a Temporal.PlainDateTime instance for plainDateTime kind", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDateTime", timeZone: "UTC" })
    );

    expect(result.current).toBeInstanceOf(Temporal.PlainDateTime);
  });

  it("should return a Temporal.PlainDate instance for plainDate kind", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDate", timeZone: "UTC" })
    );

    expect(result.current).toBeInstanceOf(Temporal.PlainDate);
  });

  it("should accumulate multiple second-precision ticks", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const { result } = renderHook(() => useTemporalNow());

    const initial = result.current?.epochMilliseconds;

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current?.epochMilliseconds).toBe(initial! + 3_000);
  });

  it("should schedule full 1000ms when at exact second boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalNow({ precision: "second" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(1_000);
  });

  it("should schedule full 60000ms when at exact minute boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalNow({ precision: "minute" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(60_000);
  });

  it("should align sub-second start to the next second boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.700Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalNow({ precision: "second" }));

    const calls = setTimeoutSpy.mock.calls;
    const lastDelay = calls[calls.length - 1]?.[1];
    expect(lastDelay).toBe(300);
  });

  it("should handle zoned kind with non-UTC timezone", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "zoned", timeZone: "America/New_York" })
    );

    expect(result.current?.toString()).toContain("America/New_York");
  });

  it("should handle plainDateTime with non-UTC timezone", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T05:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDateTime", timeZone: "America/New_York" })
    );

    // EST is UTC-5, so 05:00 UTC = 00:00 EST
    expect(result.current?.toString()).toBe("2024-01-01T00:00:00");
  });

  it("should handle plainDate with non-UTC timezone showing different date", () => {
    expect.hasAssertions();
    // 2024-01-01 23:00 UTC = 2024-01-02 in UTC+2
    vi.setSystemTime(new Date("2024-01-01T23:00:00.000Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDate", timeZone: "Europe/Athens" })
    );

    // Athens is UTC+2 in winter, so 23:00 UTC = 01:00 next day
    expect(result.current?.toString()).toBe("2024-01-02");
  });

  it("should reschedule timer after each tick", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    renderHook(() => useTemporalNow({ precision: "second" }));

    const callsBefore = setTimeoutSpy.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it("should handle day precision across multiple day boundaries", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T23:59:59.000Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "plainDate", precision: "day", timeZone: "UTC" })
    );

    expect(result.current?.toString()).toBe("2024-01-01");

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current?.toString()).toBe("2024-01-02");

    // Advance a full day
    act(() => {
      vi.advanceTimersByTime(86_400_000);
    });

    expect(result.current?.toString()).toBe("2024-01-03");
  });

  it("should not share state between two independent hook instances", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    const instant = renderHook(() => useTemporalNow({ precision: "second" }));
    const minute = renderHook(() => useTemporalNow({ precision: "minute" }));

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    // second-precision hook should have updated
    expect(instant.result.current?.epochMilliseconds).toBe(
      1_704_067_200_000 + 1_000
    );

    // minute-precision hook should not have updated yet (needs 60s)
    expect(minute.result.current?.epochMilliseconds).toBe(1_704_067_200_000);
  });

  it("should handle midnight rollover for instant kind", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T23:59:59.500Z"));

    const { result } = renderHook(() => useTemporalNow({ precision: "second" }));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const zoned = result.current?.toZonedDateTimeISO("UTC");
    expect(zoned?.hour).toBe(0);
    expect(zoned?.dayOfYear).toBe(2);
  });

  it("should produce consistent instant and zoned values for the same time", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-06-15T12:30:00.000Z"));

    const instantHook = renderHook(() => useTemporalNow());
    const zonedHook = renderHook(() =>
      useTemporalNow({ kind: "zoned", timeZone: "UTC" })
    );

    expect(instantHook.result.current?.epochMilliseconds).toBe(
      zonedHook.result.current?.epochMilliseconds
    );
  });

  it("should update minute precision at exact minute boundary", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T00:00:45.000Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ precision: "minute" })
    );

    const initial = result.current?.epochMilliseconds;

    // Advance to next minute boundary (15s away)
    act(() => {
      vi.advanceTimersByTime(15_000);
    });

    expect(result.current?.epochMilliseconds).toBeGreaterThan(initial!);
  });

  it("should return non-null on the client", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTemporalNow());

    expect(result.current).not.toBeNull();
  });

  it("should handle day precision with zoned kind", () => {
    expect.hasAssertions();
    vi.setSystemTime(new Date("2024-01-01T23:59:59.500Z"));

    const { result } = renderHook(() =>
      useTemporalNow({ kind: "zoned", precision: "day", timeZone: "UTC" })
    );

    expect(result.current?.toPlainDate().toString()).toBe("2024-01-01");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current?.toPlainDate().toString()).toBe("2024-01-02");
  });
});
