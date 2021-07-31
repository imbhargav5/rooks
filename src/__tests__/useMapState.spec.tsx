import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useMapState } from "../hooks/useMapState";

const { act } = TestRenderer;

describe("useMapState", () => {
  describe("with object", () => {
    it("should be defined", () => {
      expect(useMapState).toBeDefined();
    });
    it("should initialize correctly", () => {
      const { result } = renderHook(() => useMapState({ a: 1 }));
      expect(result.current[0]).toEqual({ a: 1 });
    });
    it("should set a new value correctly", () => {
      const { result, rerender } = renderHook(() => useMapState({ a: 1 }));

      // test memo
      const setBeforeRerender = result.current[1].set;
      rerender();
      const setAfterRerender = result.current[1].set;
      expect(setBeforeRerender).toBe(setAfterRerender);

      act(() => {
        result.current[1].set("b", 2);
      });

      expect(result.current[0]).toEqual({ a: 1, b: 2 });

      // test memo after rerender
      act(() => {
        result.current[1].set("c", 2);
      });
      expect(result.current[0]).toEqual({ a: 1, b: 2, c: 2 });
    });
    it("should update old value correctly", () => {
      const { result } = renderHook(() => useMapState({ a: 1 }));
      act(() => {
        result.current[1].set("a", 2);
      });
      expect(result.current[0]).toEqual({ a: 2 });
    });
    it("should set multiple new values correctly", () => {
      const { result, rerender } = renderHook(() => useMapState({ a: 1 }));
      // test memo
      const setMultipleBeforeRerender = result.current[1].setMultiple;
      rerender();
      const setMultipleAfterRerender = result.current[1].setMultiple;
      expect(setMultipleBeforeRerender).toBe(setMultipleAfterRerender);

      // should reflect to new value
      act(() => {
        result.current[1].set("d", 4);
        result.current[1].setMultiple({
          b: 2,
          c: 3,
        });
      });

      expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });
    it("should update old value correctly", () => {
      const { result, rerender } = renderHook(() => useMapState({ a: 1 }));
      act(() => {
        result.current[1].setMultiple({
          a: 2,
          b: 3,
        });
      });

      // test memo
      const hasBeforeRerender = result.current[1].has;
      rerender();
      const hasAfterRerender = result.current[1].has;
      expect(hasBeforeRerender).toBe(hasAfterRerender);

      expect(result.current[0]).toEqual({ a: 2, b: 3 });
      expect(result.current[1].has("a")).toBeTruthy();
      expect(result.current[1].has("b")).toBeTruthy();

      // test recreate fn usecallback

      act(() => {
        result.current[1].set("c", 4);
      });
      expect(result.current[1].has("c")).toBeTruthy();
    });
    it("should remove existing values correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState({ a: 1, b: 3 })
      );

      // test memo
      const hasBeforeRerender = result.current[1].has;
      rerender();
      const hasAfterRerender = result.current[1].has;
      expect(hasBeforeRerender).toBe(hasAfterRerender);
      act(() => {
        result.current[1].set("c", 2);
      });

      act(() => {
        result.current[1].remove("a");
      });
      expect(result.current[0]).toEqual({ b: 3, c: 2 });

      act(() => {
        result.current[1].remove("c");
      });
      expect(result.current[0]).toEqual({ b: 3 });
    });
    it("should work when value to remove does not exist", () => {
      const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
      act(() => {
        result.current[1].remove("d");
      });
      expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 });
    });
    it("should remove multiple existing values correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState({ a: 1, b: 3, c: 5 })
      );
      // test memo
      const removeMultipleBeforeRerender = result.current[1].removeMultiple;
      rerender();
      const removeMultipleAfterRerender = result.current[1].removeMultiple;
      expect(removeMultipleBeforeRerender).toBe(removeMultipleAfterRerender);

      // load new items
      act(() => {
        result.current[1].set("e", 6);
      });
      expect(result.current[0]).toEqual({ a: 1, b: 3, c: 5, e: 6 });

      // should be reactive against new value
      act(() => {
        result.current[1].removeMultiple("a", "c");
      });
      expect(result.current[0]).toEqual({ b: 3, e: 6 });
    });
    it("should work when value to removeMultiple does not exist", () => {
      const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
      act(() => {
        result.current[1].removeMultiple("d", "e");
      });
      expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 });
    });
    it("should work when some values to removeMultiple does not exist", () => {
      const { result } = renderHook(() => useMapState({ a: 1, b: 2, c: 3 }));
      act(() => {
        result.current[1].removeMultiple("a", "e");
      });
      expect(result.current[0]).toEqual({ b: 2, c: 3 });
    });
    it("should removeAll values", () => {
      const { result, rerender } = renderHook(() =>
        useMapState({ a: 1, b: 2, c: 3 })
      );
      // test memo
      const removeAllBeforeRerender = result.current[1].removeAll;
      rerender();
      const removeAllAfterRerender = result.current[1].removeAll;
      expect(removeAllBeforeRerender).toBe(removeAllAfterRerender);

      act(() => {
        result.current[1].removeAll();
      });
      expect(result.current[0]).toEqual({});
    });
  });

  describe("with map", () => {
    it("should be defined", () => {
      expect(useMapState).toBeDefined();
    });
    it("should initialize correctly", () => {
      const { result } = renderHook(() => useMapState(new Map([["a", 1]])));
      expect([...result.current]).toEqual([["a", 1]]);
    });
    it("should set a new value correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(new Map([["a", 1]]))
      );

      // test memo
      const setBeforeRerender = result.current.set;
      rerender();
      const setAfterRerender = result.current.set;
      expect(setBeforeRerender).toBe(setAfterRerender);

      act(() => {
        result.current.set("b", 2);
      });

      expect([...result.current]).toEqual([
        ["a", 1],
        ["b", 2],
      ]);

      // test memo after rerender
      act(() => {
        result.current.set("c", 2);
      });
      expect([...result.current]).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 2],
      ]);
    });
    it("should update old value correctly", () => {
      const { result } = renderHook(() => useMapState(new Map([["a", 1]])));
      act(() => {
        result.current.set("a", 2);
      });
      expect([...result.current]).toEqual([["a", 2]]);
    });
    it("should set multiple new values correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(new Map([["a", 1]]))
      );
      // test memo
      const setMultipleBeforeRerender = result.current.setMultiple;
      rerender();
      const setMultipleAfterRerender = result.current.setMultiple;
      expect(setMultipleBeforeRerender).toBe(setMultipleAfterRerender);

      // should reflect to new value
      act(() => {
        result.current.set("d", 4);
        result.current.setMultiple(
          new Map([
            ["b", 2],
            ["c", 3],
          ])
        );
      });

      expect([...result.current]).toEqual([
        ["a", 1],
        ["d", 4],
        ["b", 2],
        ["c", 3],
      ]);
    });
    it("should update old value correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(new Map([["a", 1]]))
      );
      act(() => {
        result.current.setMultiple(
          new Map([
            ["a", 2],
            ["b", 3],
          ])
        );
      });

      expect([...result.current]).toEqual([
        ["a", 2],
        ["b", 3],
      ]);

      // test recreate fn usecallback

      act(() => {
        result.current.set("c", 4);
      });
      expect(result.current.has("c")).toBe(true);
    });
    it("should remove existing values correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 3],
          ])
        )
      );

      act(() => {
        result.current.set("c", 2);
      });

      act(() => {
        result.current.delete("a");
      });
      expect([...result.current]).toEqual([
        ["b", 3],
        ["c", 2],
      ]);

      act(() => {
        result.current.delete("c");
      });
      expect([...result.current]).toEqual([["b", 3]]);
    });
    it("should work when value to remove does not exist", () => {
      const { result } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        )
      );
      act(() => {
        result.current.delete("d");
      });
      expect([...result.current]).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
    });
    it("should delete multiple existing values correctly", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 3],
            ["c", 5],
          ])
        )
      );
      // test memo
      const deleteMultipleBeforeRerender = result.current.deleteMultiple;
      rerender();
      const removeMultipleAfterRerender = result.current.deleteMultiple;
      expect(deleteMultipleBeforeRerender).toBe(removeMultipleAfterRerender);

      // load new items
      act(() => {
        result.current.set("e", 6);
      });
      expect([...result.current]).toEqual([
        ["a", 1],
        ["b", 3],
        ["c", 5],
        ["e", 6],
      ]);

      // should be reactive against new value
      act(() => {
        result.current.deleteMultiple("a", "c");
      });
      expect([...result.current]).toEqual([
        ["b", 3],
        ["e", 6],
      ]);
    });
    it("should work when value to removeMultiple does not exist", () => {
      const { result } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        )
      );
      act(() => {
        result.current.deleteMultiple("d", "e");
      });
      expect([...result.current]).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
    });
    it("should work when some values to removeMultiple does not exist", () => {
      const { result } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        )
      );
      act(() => {
        result.current.deleteMultiple("a", "e");
      });
      expect([...result.current]).toEqual([
        ["b", 2],
        ["c", 3],
      ]);
    });
    it("should clear values", () => {
      const { result, rerender } = renderHook(() =>
        useMapState(
          new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
          ])
        )
      );
      // test memo
      const removeAllBeforeRerender = result.current.clear;
      rerender();
      const clearAfterRerender = result.current.clear;
      expect(removeAllBeforeRerender).toBe(clearAfterRerender);

      act(() => {
        result.current.clear();
      });
      expect([...result.current]).toEqual([]);
    });
  });
});
