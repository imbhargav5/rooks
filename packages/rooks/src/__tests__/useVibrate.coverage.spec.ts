import { vi } from "vitest";
import { renderHook, cleanup } from "@testing-library/react";
import { useVibrate } from "@/hooks/useVibrate";

describe("useVibrate coverage", () => {
  const original = Object.getOwnPropertyDescriptor(navigator, "vibrate");
  let vibrate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      value: vibrate,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
    if (original) Object.defineProperty(navigator, "vibrate", original);
    else delete (navigator as any).vibrate;
    vi.restoreAllMocks();
  });

  it("vibrates with the pattern when enabled and stops on unmount", () => {
    const { unmount } = renderHook(() =>
      useVibrate({ isEnabled: true, pattern: [200, 100] })
    );
    expect(vibrate).toHaveBeenCalledWith([200, 100]);
    unmount();
    expect(vibrate).toHaveBeenLastCalledWith(0);
  });

  it("calls vibrate(0) when disabled", () => {
    renderHook(() => useVibrate({ isEnabled: false, pattern: 100 }));
    expect(vibrate).toHaveBeenCalledWith(0);
    expect(vibrate).not.toHaveBeenCalledWith(100);
  });

  it("re-vibrates when enabled state changes", () => {
    const { rerender } = renderHook(
      ({ isEnabled }) => useVibrate({ isEnabled, pattern: 50 }),
      { initialProps: { isEnabled: true } }
    );
    rerender({ isEnabled: false });
    expect(vibrate).toHaveBeenLastCalledWith(0);
  });

  it("warns when the API is unsupported", () => {
    delete (navigator as any).vibrate;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useVibrate({ isEnabled: true, pattern: 100 }));
    expect(warn).toHaveBeenCalledWith(
      "Vibration API not supported by the current browser"
    );
  });

  it("warns when vibrate is not a function", () => {
    (navigator as any).vibrate = undefined;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useVibrate({ isEnabled: true, pattern: 100 }));
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
