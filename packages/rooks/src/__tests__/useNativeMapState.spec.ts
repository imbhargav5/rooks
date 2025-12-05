import { useNativeMapState } from "@/hooks/useNativeMapState";
import { renderHook, act } from "@testing-library/react";

describe("useNativeMapState", () => {
  it("should initialize with an empty map by default", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNativeMapState<string, number>());

    expect(result.current[0]).toBeInstanceOf(Map);
    expect(result.current[0].size).toBe(0);
  });

  it("should initialize with the provided initial map state", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([
      ["a", 1],
      ["b", 2],
    ]);
    const { result } = renderHook(() => useNativeMapState(initialMap));

    expect(result.current[0]).toEqual(initialMap);
    expect(result.current[0].size).toBe(2);
  });

  it("should set a key-value pair", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNativeMapState<string, number>());
    const [_, controls] = result.current;

    act(() => {
      controls.set("a", 1);
    });

    expect(result.current[0].get("a")).toBe(1);
  });

  it("should remove a key-value pair", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([["a", 1]]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    act(() => {
      controls.remove("a");
    });

    expect(result.current[0].has("a")).toBe(false);
  });

  it("should clear the map", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([
      ["a", 1],
      ["b", 2],
    ]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    act(() => {
      controls.clear();
    });

    expect(result.current[0].size).toBe(0);
  });

  it("should check if a key exists in the map", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([["a", 1]]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    expect(controls.has("a")).toBe(true);
    expect(controls.has("b")).toBe(false);
  });

  it("should get the value associated with a key", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([["a", 1]]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    expect(controls.get("a")).toBe(1);
    expect(controls.get("b")).toBeUndefined();
  });

  it("should set multiple key-value pairs", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNativeMapState<string, number>());
    const [_, controls] = result.current;

    act(() => {
      controls.setMultiple([
        ["a", 1],
        ["b", 2],
      ]);
    });

    expect(result.current[0].get("a")).toBe(1);
    expect(result.current[0].get("b")).toBe(2);
  });

  it("should remove multiple key-value pairs", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    act(() => {
      controls.removeMultiple(["a", "c"]);
    });

    expect(result.current[0].has("a")).toBe(false);
    expect(result.current[0].has("b")).toBe(true);
    expect(result.current[0].has("c")).toBe(false);
  });

  it("should check if some keys exist in the map", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([["a", 1]]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    expect(controls.hasSome(["a", "b"])).toBe(true);
    expect(controls.hasSome(["b", "c"])).toBe(false);
  });

  it("should check if every key exists in the map", () => {
    expect.hasAssertions();
    const initialMap = new Map<string, number>([
      ["a", 1],
      ["b", 2],
    ]);
    const { result } = renderHook(() => useNativeMapState(initialMap));
    const [_, controls] = result.current;

    expect(controls.hasEvery(["a", "b"])).toBe(true);
    expect(controls.hasEvery(["a", "b", "c"])).toBe(false);
  });
});
