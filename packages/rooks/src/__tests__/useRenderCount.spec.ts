import { renderHook } from "@testing-library/react";
import { act } from "react-test-renderer";
import { useCounter } from "..";
import { useRenderCount } from "../hooks/useRenderCount";

describe("useRenderCount", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useRenderCount).toBeDefined();
  });
  it("should return 1 for first render", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
  });

  it("should increment when component rerenders", () => {
    expect.hasAssertions();
    const useCustomHook = () => {
      const counter = useCounter(0);
      const renderCount = useRenderCount();

      return {
        renderCount,
        counter,
      };
    };
    const { result } = renderHook(useCustomHook);
    expect(result.current.counter.value).toBe(0);
    expect(result.current.renderCount).toBe(1);
    act(() => {
      result.current.counter.increment();
    });
    expect(result.current.counter.value).toBe(1);
    expect(result.current.renderCount).toBe(2);
    act(() => {
      result.current.counter.incrementBy(5);
    });
    expect(result.current.counter.value).toBe(6);
    expect(result.current.renderCount).toBe(3);
  });
});
