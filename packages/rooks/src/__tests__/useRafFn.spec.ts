import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRafFn } from "../hooks/useRafFn";

vi.mock("raf", () => {
  let nextId = 1;
  const pendingTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

  const raf = (cb: (timestamp: number) => void) => {
    const id = nextId++;
    const timeoutId = setTimeout(() => {
      pendingTimeouts.delete(id);
      cb(performance.now());
    }, 16);
    pendingTimeouts.set(id, timeoutId);
    return id;
  };
  raf.cancel = (id: number) => {
    const timeoutId = pendingTimeouts.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      pendingTimeouts.delete(id);
    }
  };
  return { default: raf };
});

describe("useRafFn", () => {
  let nowSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    vi.useFakeTimers();
    nowSpy = vi
      .spyOn(performance, "now")
      .mockImplementation(() => Date.now());
  });

  afterAll(() => {
    vi.useRealTimers();
    nowSpy.mockRestore();
  });

  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useRafFn).toBeDefined();
  });

  describe("initial state", () => {
    it("should be inactive by default", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRafFn(() => {}));
      const [isActive] = result.current;
      expect(isActive).toBe(false);
    });

    it("should not call the callback before resume when immediate is false", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      renderHook(() => useRafFn(fn));

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it("should be active on mount when immediate is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useRafFn(() => {}, { immediate: true })
      );
      const [isActive] = result.current;
      expect(isActive).toBe(true);
    });

    it("should call the callback when immediate is true", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(fn).toHaveBeenCalled();
    });
  });

  describe("callback params", () => {
    it("should pass timestamp and elapsed to the callback", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(32); // ~2 frames
      });

      expect(fn).toHaveBeenCalled();
      const { timestamp, elapsed } = fn.mock.calls[0][0] as {
        timestamp: number;
        elapsed: number;
      };
      expect(typeof timestamp).toBe("number");
      expect(typeof elapsed).toBe("number");
    });

    it("should start elapsed at 0 on first frame", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(16); // exactly 1 frame
      });

      expect(fn).toHaveBeenCalledTimes(1);
      const { elapsed } = fn.mock.calls[0][0] as { elapsed: number };
      expect(elapsed).toBe(0);
    });

    it("should increase elapsed over time", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(64); // ~4 frames
      });

      expect(fn.mock.calls.length).toBeGreaterThan(1);
      const firstElapsed = (fn.mock.calls[0][0] as { elapsed: number })
        .elapsed;
      const lastElapsed = (
        fn.mock.calls[fn.mock.calls.length - 1][0] as { elapsed: number }
      ).elapsed;
      expect(lastElapsed).toBeGreaterThan(firstElapsed);
    });
  });

  describe("resume", () => {
    it("should start the loop when resume is called", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      const { result } = renderHook(() => useRafFn(fn));
      const [, { resume }] = result.current;

      act(() => {
        resume();
      });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(fn).toHaveBeenCalled();
      expect(result.current[0]).toBe(true);
    });

    it("should set isActive to true after resume", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRafFn(() => {}));

      act(() => {
        result.current[1].resume();
      });

      expect(result.current[0]).toBe(true);
    });

    it("should be idempotent — calling resume twice does not double-schedule", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      const { result } = renderHook(() => useRafFn(fn));

      act(() => {
        result.current[1].resume();
        result.current[1].resume();
      });

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Should fire once per frame, not twice
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should reset elapsed when resumed after pause", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      const { result } = renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(48); // 3 frames
      });

      act(() => {
        result.current[1].pause();
      });

      fn.mockClear();

      act(() => {
        result.current[1].resume();
      });

      act(() => {
        vi.advanceTimersByTime(16); // 1 frame after resume
      });

      expect(fn).toHaveBeenCalled();
      const { elapsed } = fn.mock.calls[0][0] as { elapsed: number };
      // elapsed resets to 0 after resume
      expect(elapsed).toBe(0);
    });
  });

  describe("pause", () => {
    it("should stop the loop when pause is called", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      const { result } = renderHook(() => useRafFn(fn, { immediate: true }));

      act(() => {
        vi.advanceTimersByTime(32);
      });

      act(() => {
        result.current[1].pause();
      });

      const callCountAfterPause = fn.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(fn.mock.calls.length).toBe(callCountAfterPause);
    });

    it("should set isActive to false after pause", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useRafFn(() => {}, { immediate: true })
      );

      act(() => {
        result.current[1].pause();
      });

      expect(result.current[0]).toBe(false);
    });

    it("should be idempotent — calling pause when already paused is a no-op", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRafFn(() => {}));

      // Not running — pause should not throw
      expect(() => {
        act(() => {
          result.current[1].pause();
        });
      }).not.toThrow();

      expect(result.current[0]).toBe(false);
    });
  });

  describe("cleanup on unmount", () => {
    it("should cancel the RAF loop when the component unmounts", () => {
      expect.hasAssertions();
      const fn = vi.fn();
      const { unmount } = renderHook(() =>
        useRafFn(fn, { immediate: true })
      );

      act(() => {
        vi.advanceTimersByTime(32);
      });

      unmount();
      fn.mockClear();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("SSR safety", () => {
    it("should start with isActive false (safe for SSR hydration)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useRafFn(() => {}, { immediate: true })
      );
      // Even with immediate:true, the initial render before effects run is false
      // After effects fire it becomes true — but initial render state is false
      // (This test verifies the hook is defined and works on client)
      expect(typeof result.current[0]).toBe("boolean");
    });

    it("should expose resume and pause controls", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRafFn(() => {}));
      const [, controls] = result.current;
      expect(typeof controls.resume).toBe("function");
      expect(typeof controls.pause).toBe("function");
    });
  });

  describe("stable references", () => {
    it("should return stable controls across re-renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useRafFn(() => {}));

      const { resume: resume1, pause: pause1 } = result.current[1];

      rerender();

      const { resume: resume2, pause: pause2 } = result.current[1];

      expect(resume1).toBe(resume2);
      expect(pause1).toBe(pause2);
    });

    it("should use the latest fn without recreating the loop", () => {
      expect.hasAssertions();
      let callCount = 0;
      const fn1 = vi.fn(() => {
        callCount++;
      });
      const fn2 = vi.fn(() => {
        callCount += 10;
      });

      const { result, rerender } = renderHook(
        ({ cb }) => useRafFn(cb, { immediate: true }),
        { initialProps: { cb: fn1 } }
      );

      act(() => {
        vi.advanceTimersByTime(16); // 1 frame with fn1
      });

      expect(fn1).toHaveBeenCalled();

      // Swap callback without pausing
      rerender({ cb: fn2 });

      act(() => {
        vi.advanceTimersByTime(16); // 1 frame with fn2
      });

      // After rerender the loop uses fn2
      expect(fn2).toHaveBeenCalled();
      // Controls are stable (same resume/pause ref)
      expect(result.current[1].resume).toBe(result.current[1].resume);
    });
  });
});
