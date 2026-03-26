import { renderHook } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { useMultiSelectableList } from "@/hooks/useMultiSelectableList";

const { act } = TestRenderer;

const list = ["apple", "banana", "cherry", "date", "elderberry"];

describe("useMultiSelectableList", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMultiSelectableList).toBeDefined();
  });

  describe("initialization", () => {
    it("should initialize with default selection at index 0", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useMultiSelectableList(list));
      const [selection] = result.current;
      expect(selection[0]).toEqual([0]);
      expect(selection[1]).toEqual(["apple"]);
    });

    it("should initialize with custom initial indices", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [1, 3])
      );
      const [selection] = result.current;
      expect(selection[0]).toEqual([1, 3]);
      expect(selection[1]).toEqual(["banana", "date"]);
    });

    it("should initialize with empty list", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useMultiSelectableList([]));
      const [selection] = result.current;
      expect(selection[0]).toEqual([0]);
      expect(selection[1]).toEqual([]);
    });

    it("should initialize with multiple initial indices", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2, 4])
      );
      const [selection] = result.current;
      expect(selection[0]).toEqual([0, 2, 4]);
      expect(selection[1]).toEqual(["apple", "cherry", "elderberry"]);
    });
  });

  describe("matchSelection", () => {
    it("should return true for a selected index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2])
      );
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ index: 0 })).toBe(true);
      expect(matchSelection({ index: 2 })).toBe(true);
    });

    it("should return false for an unselected index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2])
      );
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ index: 1 })).toBe(false);
      expect(matchSelection({ index: 3 })).toBe(false);
    });

    it("should return true for a selected value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2])
      );
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ value: "apple" })).toBe(true);
      expect(matchSelection({ value: "cherry" })).toBe(true);
    });

    it("should return false for an unselected value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2])
      );
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ value: "banana" })).toBe(false);
      expect(matchSelection({ value: "date" })).toBe(false);
    });

    it("should return false when neither index nor value is provided", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useMultiSelectableList(list));
      const [, { matchSelection }] = result.current;
      expect(matchSelection({})).toBe(false);
    });
  });

  describe("toggleSelection", () => {
    it("should add an unselected index to selection", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0])
      );

      act(() => {
        result.current[1].toggleSelection({ index: 2 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([0, 2]);
      expect(selection[1]).toEqual(["apple", "cherry"]);
    });

    it("should remove a selected index from selection", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2], true)
      );

      act(() => {
        result.current[1].toggleSelection({ index: 0 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([2]);
      expect(selection[1]).toEqual(["cherry"]);
    });

    it("should toggle selection by value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0])
      );

      act(() => {
        result.current[1].toggleSelection({ value: "cherry" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([0, 2]);
      expect(selection[1]).toEqual(["apple", "cherry"]);
    });

    it("should remove selection by value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0, 2], true)
      );

      act(() => {
        result.current[1].toggleSelection({ value: "apple" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([2]);
      expect(selection[1]).toEqual(["cherry"]);
    });

    it("should not allow deselecting last item when allowUnselected is false", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], false)
      );

      act(() => {
        result.current[1].toggleSelection({ index: 0 })();
      });

      // Selection should remain unchanged
      const [selection] = result.current;
      expect(selection[0]).toEqual([0]);
      expect(selection[1]).toEqual(["apple"]);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it("should allow deselecting last item when allowUnselected is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], true)
      );

      act(() => {
        result.current[1].toggleSelection({ index: 0 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([]);
      expect(selection[1]).toEqual([]);
    });

    it("should support toggling multiple items sequentially", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0])
      );

      act(() => {
        result.current[1].toggleSelection({ index: 1 })();
      });
      act(() => {
        result.current[1].toggleSelection({ index: 3 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([0, 1, 3]);
      expect(selection[1]).toEqual(["apple", "banana", "date"]);
    });
  });

  describe("updateSelections", () => {
    it("should update selections by indices", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0])
      );

      act(() => {
        result.current[1].updateSelections({ indices: [1, 3, 4] })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([1, 3, 4]);
      expect(selection[1]).toEqual(["banana", "date", "elderberry"]);
    });

    it("should update selections by values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0])
      );

      act(() => {
        result.current[1].updateSelections({
          values: ["banana", "elderberry"],
        })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([1, 4]);
      expect(selection[1]).toEqual(["banana", "elderberry"]);
    });

    it("should not allow empty indices when allowUnselected is false", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], false)
      );

      act(() => {
        result.current[1].updateSelections({ indices: [] })();
      });

      // Selection should remain unchanged
      const [selection] = result.current;
      expect(selection[0]).toEqual([0]);
      expect(warnSpy).toHaveBeenCalledWith(
        "updateSelections failed. indices is an empty list."
      );
      warnSpy.mockRestore();
    });

    it("should allow empty indices when allowUnselected is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], true)
      );

      act(() => {
        result.current[1].updateSelections({ indices: [] })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([]);
      expect(selection[1]).toEqual([]);
    });

    it("should warn when values do not exist in list and allowUnselected is false", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], false)
      );

      act(() => {
        result.current[1].updateSelections({
          values: ["nonexistent"],
        })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([0]);
      expect(warnSpy).toHaveBeenCalledWith(
        "updateSelections failed. Do the values exist in the list?"
      );
      warnSpy.mockRestore();
    });

    it("should allow empty selection by non-existent values when allowUnselected is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useMultiSelectableList(list, [0], true)
      );

      act(() => {
        result.current[1].updateSelections({
          values: ["nonexistent"],
        })();
      });

      const [selection] = result.current;
      expect(selection[0]).toEqual([]);
      expect(selection[1]).toEqual([]);
    });
  });

  describe("warnings", () => {
    it("should warn when both index and value are provided to matchSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useMultiSelectableList(list));

      result.current[1].matchSelection({ index: 0, value: "apple" });

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it("should warn when both index and value are provided to toggleSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useMultiSelectableList(list));

      act(() => {
        result.current[1].toggleSelection({ index: 0, value: "apple" })();
      });

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it("should warn when both indices and values are provided to updateSelections", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useMultiSelectableList(list));

      act(() => {
        result.current[1].updateSelections({
          indices: [0],
          values: ["apple"],
        })();
      });

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it("should warn when neither index nor value are provided to toggleSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useMultiSelectableList(list));

      act(() => {
        result.current[1].toggleSelection({})();
      });

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
