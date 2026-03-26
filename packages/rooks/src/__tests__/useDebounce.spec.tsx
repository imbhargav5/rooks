import { vi } from "vitest";
import React, { useState } from "react";
import { renderHook, act, render, fireEvent, waitFor } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDebounce).toBeDefined();
  });

  it("should return a function", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useDebounce(() => {}, 100));
    expect(typeof result.current).toBe("function");
  });
});

describe("useDebounce behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not call callback immediately", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback after wait period", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should only call once if invoked repeatedly within wait period", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer on repeated calls", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(callback).not.toHaveBeenCalled();

    // Call again — should reset the 500ms wait
    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Still not called because timer was reset
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should support the leading option", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 500, { leading: true })
    );

    // Should fire immediately on first call
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // Should not fire again during wait period
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // After wait, trailing call fires
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should support trailing: false option", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 500, { leading: true, trailing: false })
    );

    // Should fire immediately on leading edge
    act(() => {
      result.current();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    // Call again during wait
    act(() => {
      result.current();
    });

    // After wait period, no trailing call
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should support the maxWait option", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 500, { maxWait: 1_000 })
    );

    // Keep calling repeatedly to reset the debounce timer
    act(() => {
      result.current();
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    act(() => {
      result.current();
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    act(() => {
      result.current();
    });

    // Not yet at maxWait
    expect(callback).not.toHaveBeenCalled();

    // Advance past maxWait — should force invocation
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should have cancel method", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should have flush method that forces immediate execution", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      result.current.flush();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel pending calls on unmount", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("should forward arguments to the callback", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 500)
    );

    act(() => {
      result.current("hello", 42);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledWith("hello", 42);
  });

  it("should use the latest arguments when called multiple times", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 500)
    );

    act(() => {
      result.current("first");
    });
    act(() => {
      result.current("second");
    });
    act(() => {
      result.current("third");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });
});

describe("useDebounce with components", () => {
  it("should not have stale closure problems", async () => {
    expect.hasAssertions();
    const fn = vi.fn();
    function App() {
      const [value, setValue] = useState(0);
      const [done, setDone] = useState(false);

      function doSomething() {
        fn(value);
        setDone(true);
      }

      const debounced = useDebounce(doSomething, 64);

      return (
        <div>
          <button
            onClick={() => {
              debounced();
              setValue(100);
            }}
          >
            inc
          </button>
          <h1>value: {String(value)}</h1>
          <h2>done: {String(done)}</h2>
        </div>
      );
    }

    const rendered = render(<App />);
    await waitFor(() => rendered.getByText("value: 0"));
    act(() => {
      fireEvent.click(rendered.getByRole("button", { name: /inc/i }));
    });
    await waitFor(() => rendered.getByText("value: 100"));
    await waitFor(() => rendered.getByText("done: true"));

    expect(fn).toHaveBeenCalledTimes(1);
    // useFreshRef ensures the callback sees the latest state (100, not 0)
    expect(fn).toHaveBeenCalledWith(100);
  });

  it("should cancel on component unmount", async () => {
    expect.hasAssertions();
    const fn = vi.fn();

    function Child() {
      const debounced = useDebounce(fn, 64);
      return (
        <div>
          <button onClick={() => debounced()}>debounce</button>
        </div>
      );
    }

    function App() {
      const [mounted, setMounted] = useState(true);
      return (
        <div>
          <button onClick={() => setMounted(false)}>unmount</button>
          {mounted && <Child />}
        </div>
      );
    }

    const rendered = render(<App />);
    act(() => {
      fireEvent.click(rendered.getByRole("button", { name: /debounce/i }));
    });
    act(() => {
      fireEvent.click(rendered.getByRole("button", { name: /unmount/i }));
    });
    // Wait past debounce period
    await new Promise((r) => setTimeout(r, 100));

    expect(fn).not.toHaveBeenCalled();
  });
});
