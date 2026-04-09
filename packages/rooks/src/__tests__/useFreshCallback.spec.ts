import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { vi } from "vitest";
import { useFreshCallback } from "@/hooks/useFreshCallback";

describe("useFreshCallback", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshCallback).toBeDefined();
  });

  it("should call the latest callback after rerenders", () => {
    expect.hasAssertions();
    const spy = vi.fn();

    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      const callback = useFreshCallback(() => {
        spy(count);
      });

      return { callback, setCount };
    });

    act(() => {
      result.current.callback();
    });

    act(() => {
      result.current.setCount(2);
    });

    act(() => {
      result.current.callback();
    });

    expect(spy).toHaveBeenNthCalledWith(1, 0);
    expect(spy).toHaveBeenNthCalledWith(2, 2);
  });
});
