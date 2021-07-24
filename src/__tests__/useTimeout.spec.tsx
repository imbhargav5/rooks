/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useTimeout } from "../hooks/useTimeout";

describe("use-timeout base", () => {
  let mockCallback = jest.fn();
  const TIMEOUT_MS = 1_000;

  test.only("start", () => {
    const { result, rerender } = renderHook(() =>
      useTimeout(mockCallback, TIMEOUT_MS)
    );

    jest.useFakeTimers();
    expect(mockCallback).not.toHaveBeenCalled();

    // test memo
    const clearBeforeRerender = result.current.clear;
    const startBeforeRerender = result.current.start;
    rerender();
    const clearAfterRender = result.current.clear;
    const startAfterRender = result.current.start;
    expect(clearBeforeRerender).toBe(clearAfterRender);
    expect(startBeforeRerender).toBe(startAfterRender);

    act(() => {
      result.current.start();
    });

    act(() => {
      expect(result.current.isActive).toBe(true);
      jest.runAllTimers();
    });

    expect(mockCallback).toHaveBeenCalled();
    expect(result.current.isActive).toBe(false);

    // should be reactive against new state setter
    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
  });
});
