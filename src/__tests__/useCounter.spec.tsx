import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useCounter } from "../hooks/useCounter";

const { act } = TestRenderer;

describe("useCounter", () => {
  it("should be defined", () => {
    expect(useCounter).toBeDefined();
  });
  it("should initialize correctly", () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.value).toBe(0);
  });
  it("should increment", () => {
    const { result, rerender } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(1);

    // test memo
    const incrementBeforeRerender = result.current.increment;
    rerender();
    const incrementAfterRerender = result.current.increment;
    expect(incrementAfterRerender).toBe(incrementBeforeRerender);

    act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(2);
  });
  it("should decrement", () => {
    const { result, rerender } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.value).toBe(-1);

    // test memo
    const decrementBeforeRerender = result.current.decrement;
    rerender();
    const decrementAfterRerender = result.current.decrement;
    expect(decrementAfterRerender).toBe(decrementBeforeRerender);

    act(() => {
      result.current.decrement();
    });

    expect(result.current.value).toBe(-2);
  });
  it("should incrementBy", () => {
    const { result, rerender } = renderHook(() => useCounter(5));

    act(() => {
      result.current.incrementBy(7);
    });

    expect(result.current.value).toBe(12);

    // test memo
    const incrementByBeforeRerender = result.current.incrementBy;
    rerender();
    const incrementByAfterRerender = result.current.incrementBy;
    expect(incrementByBeforeRerender).toBe(incrementByAfterRerender);

    act(() => {
      result.current.incrementBy(14);
    });

    expect(result.current.value).toBe(26);
  });
  it("should decrementBy", () => {
    const { result, rerender } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrementBy(7);
    });

    expect(result.current.value).toBe(-2);

    // test memo
    const decrementByBeforeRerender = result.current.decrementBy;
    rerender();
    const decrementByAfterRerender = result.current.decrementBy;
    expect(decrementByBeforeRerender).toBe(decrementByAfterRerender);

    act(() => {
      result.current.decrementBy(-7);
    });

    expect(result.current.value).toBe(5);
  });
});
