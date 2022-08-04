import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useQueueState } from "../hooks/useQueueState";

const { act } = TestRenderer;

describe("useQueueState", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useQueueState).toBeDefined();
  });
  it("should initialize correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });
  it("should return length correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useQueueState([1, 2, 3]));
    const [, controls] = result.current;
    expect(controls).toHaveLength(3);
  });
  it("should enqueue correctly", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() => useQueueState([1, 2, 3]));
    // test memo
    const enqueueBeforeRerender = result.current[1].enqueue;
    rerender();
    const enqueueAfterRerender = result.current[1].enqueue;
    expect(enqueueBeforeRerender).toBe(enqueueAfterRerender);

    void act(() => {
      result.current[1].enqueue(7);
    });
    const [list, controls] = result.current;
    expect(list).toEqual([1, 2, 3, 7]);
    expect(controls).toHaveLength(4);
    // test memo reactivity
    void act(() => {
      result.current[1].enqueue(8);
    });
    const [list2] = result.current;
    expect(list2).toEqual([1, 2, 3, 7, 8]);
  });
  it("should peek and dequeue correctly", () => {
    expect.hasAssertions();
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
    void act(() => {
      result.current[1].enqueue(7);
    });
    void act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toBe(1);

    // run 2nd times should work: should be reactive because of list deps
    void act(() => {
      result.current[1].dequeue();
    });
    void act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toBe(3);
    expect(result.current[1]).toHaveLength(3);
  });
  it("handles empty arrays", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useQueueState<number>([]));
    void act(() => {
      result.current[1].dequeue();
    });
    void act(() => {
      result.current[1].dequeue();
    });
    const [, controls] = result.current;
    expect(controls.peek()).toBeUndefined();
    expect(controls).toHaveLength(0);
    void act(() => {
      result.current[1].enqueue(7);
    });
    void act(() => {
      result.current[1].enqueue(11);
    });
    expect(result.current[1].peek()).toBe(7);
    void act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toBe(11);
    void act(() => {
      result.current[1].dequeue();
    });
    expect(result.current[1].peek()).toBeUndefined();
    expect(result.current[1]).toHaveLength(0);
  });
});
