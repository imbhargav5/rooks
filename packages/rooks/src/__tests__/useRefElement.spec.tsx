import { act, renderHook } from "@testing-library/react";
import { useRefElement } from "@/hooks/useRefElement";

describe("useRefElement", () => {
  it("should expose the current element after the callback ref is called", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRefElement<HTMLButtonElement>());
    const button = document.createElement("button");

    act(() => {
      result.current[0](button);
    });

    expect(result.current[1]).toBe(button);
  });

  it("should clear the current element when the ref receives null", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useRefElement<HTMLDivElement>());
    const div = document.createElement("div");

    act(() => {
      result.current[0](div);
    });

    expect(result.current[1]).toBe(div);

    act(() => {
      result.current[0](null);
    });

    expect(result.current[1]).toBeNull();
  });

  it("should keep the callback ref stable across rerenders", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useRefElement<HTMLDivElement>()
    );

    const firstRef = result.current[0];
    rerender();

    expect(result.current[0]).toBe(firstRef);
  });
});
