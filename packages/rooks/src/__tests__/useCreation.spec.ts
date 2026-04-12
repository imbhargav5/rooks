import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useCreation } from "@/hooks/useCreation";

describe("useCreation", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCreation).toBeDefined();
  });

  it("should call the factory on initial render", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({ id: 1 }));
    renderHook(() => useCreation(factory, []));
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should return the value produced by the factory", () => {
    expect.hasAssertions();
    const value = { id: 42 };
    const { result } = renderHook(() => useCreation(() => value, []));
    expect(result.current).toBe(value);
  });

  it("should not call the factory again when deps have not changed", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({ id: 1 }));
    const { rerender } = renderHook(() => useCreation(factory, [1, "a"]));
    rerender();
    rerender();
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should return the same reference across re-renders when deps are stable", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useCreation(() => ({ id: 1 }), [])
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("should call the factory again when deps change", () => {
    expect.hasAssertions();
    const factory = vi.fn((n: number) => ({ value: n }));
    let dep = 1;
    const { result, rerender } = renderHook(() =>
      useCreation(() => factory(dep), [dep])
    );
    expect(result.current).toEqual({ value: 1 });

    dep = 2;
    rerender();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(result.current).toEqual({ value: 2 });
  });

  it("should produce a new reference when deps change", () => {
    expect.hasAssertions();
    let dep = 1;
    const { result, rerender } = renderHook(() =>
      useCreation(() => ({ value: dep }), [dep])
    );
    const first = result.current;

    dep = 2;
    rerender();
    expect(result.current).not.toBe(first);
    expect(result.current).toEqual({ value: 2 });
  });

  it("should use Object.is semantics for dep comparison (NaN equals NaN)", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({}));
    const { rerender } = renderHook(() =>
      useCreation(factory, [NaN])
    );
    rerender();
    rerender();
    // NaN is the same dep in two consecutive renders: factory called once
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should recompute when one dep in a multi-dep array changes", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({}));
    let a = 1;
    let b = "hello";
    const { rerender } = renderHook(() => useCreation(factory, [a, b]));
    expect(factory).toHaveBeenCalledTimes(1);

    b = "world";
    rerender();
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("should work with primitive return types", () => {
    expect.hasAssertions();
    let counter = 0;
    const { result, rerender } = renderHook(() =>
      useCreation(() => ++counter, [])
    );
    expect(result.current).toBe(1);
    rerender();
    // counter should still be 1 — factory not re-invoked
    expect(result.current).toBe(1);
  });

  it("should work with function return types", () => {
    expect.hasAssertions();
    const fn = () => 42;
    const { result } = renderHook(() => useCreation(() => fn, []));
    expect(result.current).toBe(fn);
    expect(result.current()).toBe(42);
  });

  it("should handle changing dep array length", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({}));
    let deps: unknown[] = [1];
    const { rerender } = renderHook(() => useCreation(factory, deps));
    expect(factory).toHaveBeenCalledTimes(1);

    deps = [1, 2];
    rerender();
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
