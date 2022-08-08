/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import type { DebouncedFunc } from "lodash";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useDebounce", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDebounce).toBeDefined();
  });
});

describe("useDebounce behavior", () => {
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
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 32));
    result.current();
    expect(callback).not.toHaveBeenCalled();
    await wait(64);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it("should support a `leading` option", async () => {
    expect.assertions(2);
    const callback = jest.fn();
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
    const withTrailing = jest.fn();
    const { result: withTrailingResult } = renderHook(() =>
      useDebounce(withTrailing, 32, { trailing: true })
    );
    const withoutTrailing = jest.fn();
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
});
