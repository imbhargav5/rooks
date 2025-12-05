import { vi } from "vitest";
/**
 */
import React from "react";
import { renderHook } from "@testing-library/react";
import type { DebouncedFunc } from "lodash";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { act, fireEvent, render, waitFor } from "@testing-library/react";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe.skip("useDebounce", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDebounce).toBeDefined();
  });
});

describe.skip("useDebounce behavior", () => {
  const DEBOUNCE_WAIT = 500;
  let useCustomDebounce: () => { cb: DebouncedFunc<() => void>; value: number };
  beforeEach(() => {
    useCustomDebounce = function () {
      const [value, setValue] = useState(0);
      function log() {
        setValue(value + 1);
      }
      const callback = useDebounce(log, DEBOUNCE_WAIT);

      return { cb: callback, value };
    };
  });
  it("runs only once if cb is called repeatedly in wait period", async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(useCustomDebounce);
    result.current.cb();
    result.current.cb();
    result.current.cb();
    await waitForNextUpdate();
    expect(result.current.value).toBe(1);
  });
  it("should apply default options", async () => {
    expect.assertions(2);
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 32));
    result.current();
    expect(callback).not.toHaveBeenCalled();
    await wait(64);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it("should support a `leading` option", async () => {
    expect.assertions(2);
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebounce(callback, 32, { leading: true })
    );
    result.current();
    expect(callback).toHaveBeenCalledTimes(1);
    await wait(64);
    result.current();
    expect(callback).toHaveBeenCalledTimes(2);
  });
  it("should support a `trailing` option", async () => {
    expect.assertions(4);
    const withTrailing = vi.fn();
    const { result: withTrailingResult } = renderHook(() =>
      useDebounce(withTrailing, 32, { trailing: true })
    );
    const withoutTrailing = vi.fn();
    const { result: withoutTrailingResult } = renderHook(() =>
      useDebounce(withTrailing, 32, { trailing: false })
    );
    withTrailingResult.current();
    expect(withTrailing).toHaveBeenCalledTimes(0);
    withoutTrailingResult.current();
    expect(withoutTrailing).toHaveBeenCalledTimes(0);
    await wait(64);
    expect(withTrailing).toHaveBeenCalledTimes(1);
    expect(withoutTrailing).toHaveBeenCalledTimes(0);
  });

  it("should not have stale closure problems", async () => {
    expect.assertions(2);
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
    expect(fn).toHaveBeenCalledWith(100);
  });

  it("should cancel on unmount", async () => {
    expect.assertions(1);

    const fn = vi.fn();

    function Child() {
      const debounced = useDebounce(fn, 64);

      return (
        <div>
          <button
            onClick={() => {
              debounced();
            }}
          >
            debounce
          </button>
        </div>
      );
    }

    function App() {
      const [mounted, setMounted] = useState(true);

      return (
        <div>
          <button
            onClick={() => {
              setMounted(false);
            }}
          >
            unmount
          </button>
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
    await wait(100);

    expect(fn).not.toHaveBeenCalled();
  });

  it("should work with inline functions", async () => {
    expect.assertions(2);
    const fn = vi.fn();
    function App() {
      const [value, setValue] = useState(0);
      const [done, setDone] = useState(false);

      const debounced = useDebounce(() => {
        fn(value);
        setValue(value + 1);
        setDone(true);
      }, 64);

      return (
        <div>
          <button
            onClick={() => {
              debounced();
              setValue(value + 100);
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
    act(() => {
      fireEvent.click(rendered.getByRole("button", { name: /inc/i }));
    });
    act(() => {
      fireEvent.click(rendered.getByRole("button", { name: /inc/i }));
    });
    await waitFor(() => rendered.getByText("done: true"));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(300);
  });
});
