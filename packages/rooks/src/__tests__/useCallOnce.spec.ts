import React from "react";
import { useCallOnce } from "@/hooks/useCallOnce";
import { renderHook } from "@testing-library/react";

describe("useCallOnce", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCallOnce).toBeDefined();
  });

  it("should call the callback once", () => {
    expect.hasAssertions();

    const cb = jest.fn();

    renderHook(() => useCallOnce(cb));

    expect(cb).toBeCalledTimes(1);
  });

  it("should call the callback once even during rerenders", () => {
    expect.hasAssertions();

    const cb = jest.fn();

    const { rerender, unmount } = renderHook(() => useCallOnce(cb));

    rerender();
    rerender();
    unmount();

    expect(cb).toBeCalledTimes(1);
  });

  it("should return value", () => {
    expect.hasAssertions();

    const cb = jest.fn(() => "value");

    const { result } = renderHook(() => useCallOnce(cb));

    expect(result.current).toBe("value");
  });
});
