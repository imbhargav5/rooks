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
});
