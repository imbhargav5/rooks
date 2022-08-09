import { renderHook, act } from "@testing-library/react";
import { useSetState } from "../hooks/useSetState";

describe("useSetState", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSetState).toBeDefined();
  });

  it("should initialize the state with the initialSetValue", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSetState(new Set([1, 2, 3])));

    expect(result.current[0]).toEqual(new Set([1, 2, 3]));
  });

  it("should add values to the set", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSetState(new Set([1, 2, 3])));

    act(() => {
      result.current[1].add(4);
    });
    expect(result.current[0]).toEqual(new Set([1, 2, 3, 4]));
  });

  it("should delete values from the set", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSetState(new Set([1, 2, 3])));

    act(() => {
      result.current[1].delete(2);
    });

    expect(result.current[0]).toEqual(new Set([1, 3]));
  });

  it("should clear the set", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSetState(new Set([1, 2, 3])));

    act(() => {
      result.current[1].clear();
    });
    expect(result.current[0]).toEqual(new Set());
  });
});
