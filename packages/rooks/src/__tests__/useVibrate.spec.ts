import { vi } from "vitest";
import { useVibrate } from "@/hooks/useVibrate";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

describe("useVibrate", () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    "vibrate"
  );

  beforeEach(() => {
    Object.defineProperty(navigator, "vibrate", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Unmount before restoring so effect cleanups still see the mock
    cleanup();
    if (originalDescriptor) {
      Object.defineProperty(navigator, "vibrate", originalDescriptor);
    } else {
      delete (navigator as { vibrate?: unknown }).vibrate;
    }
  });

  it("should start vibration when isEnabled is true", async () => {
    expect.hasAssertions();
    const { rerender } = renderHook(
      ({ isEnabled, pattern }) => useVibrate({ isEnabled, pattern }),
      {
        initialProps: { isEnabled: true, pattern: [200, 100, 200] },
      }
    );

    await waitFor(() => expect(navigator.vibrate).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200])
    );

    rerender({ isEnabled: true, pattern: [100, 50, 100] });

    expect(navigator.vibrate).toHaveBeenCalledTimes(3);
    expect(navigator.vibrate).toHaveBeenLastCalledWith([100, 50, 100]);
  });

  it("should stop vibration when isEnabled is false", async () => {
    expect.hasAssertions();
    const { rerender } = renderHook(
      ({ isEnabled, pattern }) => useVibrate({ isEnabled, pattern }),
      {
        initialProps: { isEnabled: true, pattern: [200, 100, 200] },
      }
    );

    await waitFor(() => expect(navigator.vibrate).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200])
    );

    rerender({ isEnabled: false, pattern: [200, 100, 200] });

    expect(navigator.vibrate).toHaveBeenCalledTimes(3);
    expect(navigator.vibrate).toHaveBeenLastCalledWith(0);
  });

  it("should stop vibration when the component is unmounted", () => {
    expect.hasAssertions();
    const { unmount } = renderHook(
      ({ isEnabled, pattern }) => useVibrate({ isEnabled, pattern }),
      {
        initialProps: { isEnabled: true, pattern: [200, 100, 200] },
      }
    );

    unmount();

    expect(navigator.vibrate).toHaveBeenCalledTimes(2);
    expect(navigator.vibrate).toHaveBeenLastCalledWith(0);
  });

  it("should warn when the Vibration API is not supported", async () => {
    expect.hasAssertions();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Temporarily remove the vibrate function to simulate unsupported API
    Object.defineProperty(navigator, "vibrate", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    renderHook(({ isEnabled, pattern }) => useVibrate({ isEnabled, pattern }), {
      initialProps: { isEnabled: true, pattern: [200, 100, 200] },
    });

    await waitFor(() => expect(warnSpy).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(warnSpy).toHaveBeenCalledWith(
        "Vibration API not supported by the current browser"
      )
    );
    warnSpy.mockRestore();
  });
});
