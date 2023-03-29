import { renderHook, act } from "@testing-library/react-hooks";

import { useUndoRedoState } from "@/hooks/useUndoRedoState";

describe("useUndoRedoState", () => {
  it("should initialize with the initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0));
    expect(result.current[0]).toBe(0);
  });

  it("should update the state using setState", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => {
      result.current[1](1);
    });
    expect(result.current[0]).toBe(1);
  });

  it("should undo the state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => {
      result.current[1](1);
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(0);
  });

  it("should redo the state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => {
      result.current[1](1);
    });
    act(() => {
      result.current[2].undo();
    });
    act(() => {
      result.current[2].redo();
    });
    expect(result.current[0]).toBe(1);
  });

  it("should limit the history based on maxDepth", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0, { maxDepth: 2 }));
    act(() => {
      result.current[1](1);
    });
    act(() => {
      result.current[1](2);
    });
    act(() => {
      result.current[1](3);
    });
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(2);
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(1); // Should not undo further
  });

  it("should work with function initializer for setState", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useUndoRedoState(0));
    act(() => {
      result.current[1]((prevState) => prevState + 1);
    });
    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[1]((prevState) => prevState + 1);
    });
    expect(result.current[0]).toBe(2);
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[2].undo();
    });
    expect(result.current[0]).toBe(0);
    act(() => {
      result.current[2].redo();
    });
    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[2].redo();
    });
    expect(result.current[0]).toBe(2);
  });
});
