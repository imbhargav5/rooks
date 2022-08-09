/**
 * @jest-environment jsdom
 */
import { cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useUndoState } from "@/hooks/useUndoState";
import type { UseUndoStateOptions } from "@/types/types";

const { act } = TestRenderer;

describe("useUndoState", () => {
  afterEach(cleanup);
  let useHook = function (defaultValue: number, options?: UseUndoStateOptions) {
    const [value, setValue, undo] = useUndoState<number>(defaultValue, options);
    function increment() {
      setValue((current) => (current || 0) + 1);
    }

    return { increment, undo, value };
  };

  beforeEach(() => {
    useHook = function (defaultValue, options) {
      const [value, setValue, undo] = useUndoState(defaultValue, options);
      function increment() {
        setValue((current) => (current || 0) + 1);
      }

      return { increment, undo, value };
    };
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useUndoState).toBeDefined();
  });

  it("should honor default value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));
    expect(result.current.value).toBe(42);
  });

  it("should show latest value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(43);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("should show previous value after undo", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
      result.current.increment();
      result.current.undo();
    });

    expect(result.current.value).toBe(43);
  });

  it("should show initial value after multiple undo", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42));

    void act(() => {
      result.current.increment();
      result.current.increment();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });

    expect(result.current.value).toBe(42);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("should respect maxSize option", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useHook(42, { maxSize: 2 }));

    void act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.increment();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });

    expect(result.current.value).toBe(44);
  });
});

// figure out tests
