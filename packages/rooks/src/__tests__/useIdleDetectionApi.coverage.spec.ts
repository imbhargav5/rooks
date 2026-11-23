import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIdleDetectionApi } from "@/hooks/useIdleDetectionApi";

class MockDetector extends EventTarget {
  static permission: "granted" | "denied" = "granted";
  static startError: unknown = null;
  static instance: MockDetector | null = null;
  userState: "active" | "idle" | null = "active";
  screenState: "locked" | "unlocked" | null = "unlocked";
  listeners = new Set<() => void>();
  constructor() {
    super();
    MockDetector.instance = this;
  }
  static async requestPermission() {
    return MockDetector.permission;
  }
  async start() {
    if (MockDetector.startError) throw MockDetector.startError;
  }
  addEventListener(_t: string, l: any) {
    this.listeners.add(l);
  }
  removeEventListener(_t: string, l: any) {
    this.listeners.delete(l);
  }
  fire() {
    this.listeners.forEach((l) => l());
  }
}

describe("useIdleDetectionApi coverage", () => {
  afterEach(() => {
    delete (window as any).IdleDetector;
    MockDetector.permission = "granted";
    MockDetector.startError = null;
    MockDetector.instance = null;
    vi.useRealTimers();
  });

  describe("native API", () => {
    beforeEach(() => {
      (window as any).IdleDetector = MockDetector;
    });

    it("starts without permission request and reacts to change events", async () => {
      const onIdleChange = vi.fn();
      const { result } = renderHook(() =>
        useIdleDetectionApi({ onIdleChange })
      );
      expect(result.current.isSupported).toBe(true);
      await act(async () => {
        await result.current.start();
      });
      expect(result.current.isPermissionGranted).toBe(true);
      const d = MockDetector.instance!;
      d.userState = "idle";
      d.screenState = "locked";
      act(() => d.fire());
      expect(result.current.isIdle).toBe(true);
      expect(result.current.userState).toBe("idle");
      expect(result.current.screenState).toBe("locked");
      expect(onIdleChange).toHaveBeenCalledWith({
        isIdle: true,
        userState: "idle",
        screenState: "locked",
      });
      // second start is a no-op
      const first = MockDetector.instance;
      await act(async () => {
        await result.current.start();
      });
      expect(MockDetector.instance).toBe(first);
    });

    it("falls back to defaults when detector states are null", async () => {
      const { result } = renderHook(() => useIdleDetectionApi());
      await act(async () => {
        await result.current.start();
      });
      const d = MockDetector.instance!;
      d.userState = null;
      act(() => d.fire());
      expect(result.current.isIdle).toBe(false);
      expect(result.current.userState).toBe("active");
    });

    it("requests permission and grants", async () => {
      const { result } = renderHook(() =>
        useIdleDetectionApi({ requestPermission: true })
      );
      await act(async () => {
        await result.current.start();
      });
      expect(result.current.isPermissionGranted).toBe(true);
      expect(MockDetector.instance!.listeners.size).toBe(1);
    });

    it("reports error when permission is denied", async () => {
      MockDetector.permission = "denied";
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useIdleDetectionApi({ requestPermission: true, onError })
      );
      await act(async () => {
        await result.current.start();
      });
      expect(result.current.isPermissionGranted).toBe(false);
      expect(onError).toHaveBeenCalledWith(new Error("Permission denied"));
      expect(MockDetector.instance!.listeners.size).toBe(0);
    });

    it("reports Error thrown by detector start", async () => {
      MockDetector.startError = new Error("nope");
      const onError = vi.fn();
      const { result } = renderHook(() => useIdleDetectionApi({ onError }));
      await act(async () => {
        await result.current.start();
      });
      expect(onError).toHaveBeenCalledWith(new Error("nope"));
    });

    it("wraps non-Error failures", async () => {
      MockDetector.startError = "str";
      const onError = vi.fn();
      const { result } = renderHook(() => useIdleDetectionApi({ onError }));
      await act(async () => {
        await result.current.start();
      });
      expect(onError.mock.calls[0][0].message).toBe(
        "Failed to start idle detection"
      );
    });

    it("tolerates failure without onError", async () => {
      MockDetector.startError = new Error("x");
      const { result } = renderHook(() => useIdleDetectionApi());
      await act(async () => {
        await result.current.start();
      });
      expect(result.current.isIdle).toBe(false);
    });

    it("stop removes listener and resets state", async () => {
      const { result } = renderHook(() => useIdleDetectionApi());
      await act(async () => {
        await result.current.start();
      });
      const d = MockDetector.instance!;
      d.userState = "idle";
      act(() => d.fire());
      expect(result.current.isIdle).toBe(true);
      act(() => result.current.stop());
      expect(d.listeners.size).toBe(0);
      expect(result.current.isIdle).toBe(false);
      expect(result.current.userState).toBe("active");
      // stop again is a no-op
      act(() => result.current.stop());
    });

    it("autoStarts and cleans up on unmount", async () => {
      const { unmount } = renderHook(() =>
        useIdleDetectionApi({ autoStart: true })
      );
      await act(async () => {});
      const d = MockDetector.instance!;
      expect(d.listeners.size).toBe(1);
      unmount();
      expect(d.listeners.size).toBe(0);
    });
  });

  describe("polyfill", () => {
    it("goes idle after threshold, wakes on activity, tracks visibility", async () => {
      vi.useFakeTimers();
      const onIdleChange = vi.fn();
      const { result } = renderHook(() =>
        useIdleDetectionApi({ threshold: 1000, onIdleChange })
      );
      expect(result.current.isSupported).toBe(false);
      await act(async () => {
        await result.current.start();
      });
      expect(result.current.isPermissionGranted).toBe(true);

      // threshold is clamped to 60s
      act(() => {
        vi.advanceTimersByTime(59000);
      });
      expect(result.current.isIdle).toBe(false);
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(result.current.isIdle).toBe(true);
      expect(result.current.userState).toBe("idle");

      act(() => {
        document.dispatchEvent(new Event("mousemove"));
      });
      expect(result.current.isIdle).toBe(false);
      expect(result.current.userState).toBe("active");

      // activity while active resets timer without notifying
      const calls = onIdleChange.mock.calls.length;
      act(() => {
        document.dispatchEvent(new Event("keydown"));
      });
      expect(onIdleChange.mock.calls.length).toBe(calls);

      Object.defineProperty(document, "hidden", {
        value: true,
        configurable: true,
      });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(result.current.screenState).toBe("locked");
      Object.defineProperty(document, "hidden", {
        value: false,
        configurable: true,
      });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(result.current.screenState).toBe("unlocked");

      act(() => result.current.stop());
      expect(result.current.isIdle).toBe(false);
      // timers cleared: no idle after stop
      act(() => {
        vi.advanceTimersByTime(120000);
      });
      expect(result.current.isIdle).toBe(false);
    });

    it("autoStart works and unmount stops listeners", async () => {
      const onIdleChange = vi.fn();
      const { unmount } = renderHook(() =>
        useIdleDetectionApi({ autoStart: true, onIdleChange })
      );
      await act(async () => {});
      unmount();
      onIdleChange.mockClear();
      document.dispatchEvent(new Event("visibilitychange"));
      expect(onIdleChange).not.toHaveBeenCalled();
    });
  });
});
