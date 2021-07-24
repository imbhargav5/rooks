import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useQueueState } from "../hooks/useQueueState";

const { act } = TestRenderer;

describe("useQueueState", () => {
  it("should be defined", () => {
    expect(useQueueState).toBeDefined();
  });
  it("should initialize correctly", () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });
  it("should return length correctly", () => {
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    const [, controls] = result.current;
    expect(controls.length).toBe(3);
  });
  it.only("should enqueue correctly", () => {
    const { result, rerender } = renderHook(() => useQueueState([1, 2, 3]));
    // test memo
    const enqueueBeforeRerender = result.current[1].enqueue;
    rerender();
    const enqueueAfterRerender = result.current[1].enqueue;
    expect(enqueueBeforeRerender).toBe(enqueueAfterRerender);

    act(() => {
      result.current[1].enqueue(7);
    });
    const [list, controls] = result.current;
    expect(list).toEqual([1, 2, 3, 7]);
    expect(controls.length).toBe(4);
    // test memo reactivity
    act(() => {
      result.current[1].enqueue(8);
    });
    const [list2] = result.current;
    expect(list2).toEqual([1, 2, 3, 7, 8]);
  });
  it("should peek and dequeue correctly", () => {
    const { result, rerender } = renderHook(() => useQueueState([1, 2, 3]));
    // memo
    const enqueueBeforeRerender = result.current[1].enqueue;
    const peekBeforeRerender = result.current[1].peek;
    rerender();
    const enqueueAfterRerender = result.current[1].enqueue;
    const peekAfterRerender = result.current[1].peek;
    expect(enqueueBeforeRerender).toBe(enqueueAfterRerender);
    expect(peekBeforeRerender).toBe(peekAfterRerender);

    // after memo, should work
    act(() => {
      result.current[1].enqueue(7);
    });
    act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toEqual(1);

    // run 2nd times should work: should be reactive because of list deps
    act(() => {
      result.current[1].dequeue();
    });
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toEqual(3);
    expect(result.current[1].length).toEqual(3);
  });
  it("handles empty arrays", () => {
    const { result } = renderHook(() => useQueueState([]));
    act(() => {
      result.current[1].dequeue();
    });
    act(() => {
      result.current[1].dequeue();
    });
    const [, controls] = result.current;
    expect(controls.peek()).toEqual(undefined);
    expect(controls.length).toEqual(0);
    act(() => {
      result.current[1].enqueue(7);
    });
    act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toEqual(7);
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toEqual(11);
    act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toBeUndefined();
    expect(result.current[1].length).toEqual(0);
  });
});
