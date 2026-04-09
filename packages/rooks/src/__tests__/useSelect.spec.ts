import { renderHook, act } from "@testing-library/react";
import { useSelect } from "@/hooks/useSelect";

describe("useSelect", () => {
  it("should return correct value at index", () => {
    expect.hasAssertions();
    let array = [1, 2];
    const { result, rerender } = renderHook(() => useSelect(array, 0));

    // test memo
    const incrementByBeforeRerender = result.current.setItem;
    rerender();
    const incrementByAfterRerender = result.current.setItem;
    expect(incrementByBeforeRerender).toBe(incrementByAfterRerender);

    // assertions
    expect(result.current.index).toBe(0);
    expect(result.current.item).toBe(1);

    // should be reactive to the latest memo list
    act(() => {
      array = [1, 2, 5];
      rerender();
    });

    act(() => {
      result.current.setItem(5);
    });

    // assertions
    expect(result.current.index).toBe(2);
    expect(result.current.item).toBe(5);
  });

  it("should update the selected index directly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSelect(["all", "open", "done"], 0));

    act(() => {
      result.current.setIndex(1);
    });

    expect(result.current.index).toBe(1);
    expect(result.current.item).toBe("open");
  });
});
