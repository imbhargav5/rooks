import { renderHook } from "@testing-library/react";
import { useState } from "react";
import { useCreation } from "@/hooks/useCreation";

describe("useCreation", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCreation).toBeDefined();
  });

  it("calls factory on initialization and returns value", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({ id: 1 }));
    const { result } = renderHook(() => useCreation(factory, []));

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({ id: 1 });
  });

  it("does NOT call factory again on rerender when deps are unchanged", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({ id: 1 }));
    const { result, rerender } = renderHook(() => useCreation(factory, []));

    const firstValue = result.current;
    rerender();
    rerender();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(firstValue);
  });

  it("returns a stable reference across rerenders when deps do not change", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({ stable: true }));
    const { result, rerender } = renderHook(() => useCreation(factory, [42]));

    const ref1 = result.current;
    rerender();
    const ref2 = result.current;

    expect(ref1).toBe(ref2);
  });

  it("calls factory again when a dep changes", () => {
    expect.hasAssertions();
    let dep = 1;
    const factory = vi.fn(() => ({ dep }));
    const { result, rerender } = renderHook(() => useCreation(factory, [dep]));

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({ dep: 1 });

    dep = 2;
    rerender();

    expect(factory).toHaveBeenCalledTimes(2);
    expect(result.current).toEqual({ dep: 2 });
  });

  it("returns a new reference when deps change", () => {
    expect.hasAssertions();
    let dep = "a";
    const { result, rerender } = renderHook(() =>
      useCreation(() => ({ value: dep }), [dep])
    );

    const first = result.current;
    dep = "b";
    rerender();

    expect(result.current).not.toBe(first);
    expect(result.current).toEqual({ value: "b" });
  });

  it("supports class instance creation and keeps same instance while deps unchanged", () => {
    expect.hasAssertions();

    class Counter {
      count = 0;
      increment() {
        this.count++;
      }
    }

    const { result, rerender } = renderHook(() =>
      useCreation(() => new Counter(), [])
    );

    const instance = result.current;
    instance.increment();
    rerender();

    expect(result.current).toBe(instance);
    expect(result.current.count).toBe(1);
  });

  it("creates a fresh class instance when deps change", () => {
    expect.hasAssertions();

    class Greeter {
      constructor(public name: string) {}
    }

    let name = "Alice";
    const { result, rerender } = renderHook(() =>
      useCreation(() => new Greeter(name), [name])
    );

    const first = result.current;
    expect(first.name).toBe("Alice");

    name = "Bob";
    rerender();

    expect(result.current).not.toBe(first);
    expect(result.current.name).toBe("Bob");
  });

  it("works with multiple deps — only recreates when one of them changes", () => {
    expect.hasAssertions();
    let a = 1;
    let b = 2;
    const factory = vi.fn(() => a + b);
    const { result, rerender } = renderHook(() =>
      useCreation(factory, [a, b])
    );

    expect(result.current).toBe(3);
    rerender();
    expect(factory).toHaveBeenCalledTimes(1);

    a = 10;
    rerender();
    expect(factory).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(12);
  });

  it("works with state changes that affect deps", () => {
    expect.hasAssertions();

    const factory = vi.fn((v: number) => ({ value: v }));

    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const created = useCreation(() => factory(count), [count]);
      return { count, setCount, created };
    });

    expect(result.current.created).toEqual({ value: 0 });
    expect(factory).toHaveBeenCalledTimes(1);

    const { act } = require("@testing-library/react");
    act(() => {
      result.current.setCount(5);
    });

    expect(factory).toHaveBeenCalledTimes(2);
    expect(result.current.created).toEqual({ value: 5 });
  });

  it("handles empty deps array — factory called exactly once", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => Symbol("unique"));
    const { result, rerender } = renderHook(() => useCreation(factory, []));

    const sym = result.current;
    rerender();
    rerender();
    rerender();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(sym);
  });

  it("uses Object.is semantics for dep comparison (NaN equals NaN)", () => {
    expect.hasAssertions();
    const factory = vi.fn(() => ({}));
    // NaN === NaN is false but Object.is(NaN, NaN) is true
    const { rerender } = renderHook(() => useCreation(factory, [NaN]));

    expect(factory).toHaveBeenCalledTimes(1);
    rerender();

    // NaN dep has not changed per Object.is, so factory should NOT be called again
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
