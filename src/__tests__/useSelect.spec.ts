import { renderHook, act } from "@testing-library/react-hooks";
import { useSelect } from "../hooks/useSelect";

describe("useSelect", () => {
  test("should return correct value at index", () => {
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
});
