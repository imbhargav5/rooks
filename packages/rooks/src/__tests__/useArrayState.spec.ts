import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useArrayState } from "../hooks/useArrayState";

describe("useArrayState", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useArrayState).toBeDefined();
  });

  it("should initialize correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it("should push correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].push(4);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });

  it("should pop correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].pop();
    });

    expect(result.current[0]).toEqual([1, 2]);
  });

  it("should unshift correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].unshift(0);
    });
    expect(result.current[0]).toEqual([0, 1, 2, 3]);
  });

  it("should shift correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].shift();
    });
    expect(result.current[0]).toEqual([2, 3]);
  });

  it("should reverse correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].reverse();
    });

    expect(result.current[0]).toEqual([3, 2, 1]);
  });

  it("should concat correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].concat([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should fill correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useArrayState([1, 2, 3]));

    act(() => {
      result.current[1].fill(0);
    });

    expect(result.current[0]).toEqual([0, 0, 0]);
  });
});
