import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import { useIntervalWhen } from "@/hooks/useIntervalWhen";

describe("useIntervalWhen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIntervalWhen).toBeDefined();
  });

  describe("basic interval behavior", () => {
    it("should call callback after interval duration when condition is true", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should call callback multiple times over multiple intervals", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 500, true));

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should not call callback before interval elapses", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true));

      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("when condition", () => {
    it("should not start interval when condition is false", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, false));

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(callback).not.toHaveBeenCalled();
    });

    it("should stop interval when condition becomes false", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ when }) => useIntervalWhen(callback, 1_000, when),
        { initialProps: { when: true } }
      );

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      rerender({ when: false });

      act(() => {
        vi.advanceTimersByTime(3_000);
      });
      // Should not have been called again
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should resume interval when condition becomes true again", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ when }) => useIntervalWhen(callback, 1_000, when),
        { initialProps: { when: true } }
      );

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // Pause
      rerender({ when: false });
      act(() => {
        vi.advanceTimersByTime(3_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // Resume
      rerender({ when: true });
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe("startImmediate", () => {
    it("should call callback immediately when startImmediate is true", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true, true));

      // Should have been called immediately, before any timer advance
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call callback immediately when startImmediate is false", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true, false));

      expect(callback).not.toHaveBeenCalled();
    });

    it("should call immediately and then on interval when startImmediate is true", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true, true));

      // Immediate call
      expect(callback).toHaveBeenCalledTimes(1);

      // Interval call
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should not call immediately when condition is false even if startImmediate is true", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, false, true));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should clear interval on unmount", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      const { unmount } = renderHook(() =>
        useIntervalWhen(callback, 1_000, true)
      );

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      unmount();

      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      // No more calls after unmount
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("callback freshness", () => {
    it("should always call the latest callback", () => {
      expect.hasAssertions();
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { rerender } = renderHook(
        ({ cb }) => useIntervalWhen(cb, 1_000, true),
        { initialProps: { cb: callback1 } }
      );

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      rerender({ cb: callback2 });

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("should use fresh state in callback via functional updater", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => {
        const [count, setCount] = useState(0);
        useIntervalWhen(() => setCount((c) => c + 1), 1_000, true);
        return count;
      });

      expect(result.current).toBe(0);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current).toBe(1);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current).toBe(2);

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current).toBe(3);
    });
  });

  describe("interval duration changes", () => {
    it("should reset interval when duration changes", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ ms }) => useIntervalWhen(callback, ms, true),
        { initialProps: { ms: 1_000 } }
      );

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // Change to 500ms interval
      rerender({ ms: 500 });

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe("defaults", () => {
    it("should default when to true", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000));

      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should default startImmediate to false", () => {
      expect.hasAssertions();
      const callback = vi.fn();
      renderHook(() => useIntervalWhen(callback, 1_000, true));

      // Should not have been called immediately
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
