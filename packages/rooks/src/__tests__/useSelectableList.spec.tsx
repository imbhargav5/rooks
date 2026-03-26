import { renderHook } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { useSelectableList } from "@/hooks/useSelectableList";

const { act } = TestRenderer;

const list = ["apple", "banana", "cherry", "date", "elderberry"];

describe("useSelectableList", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSelectableList).toBeDefined();
  });

  describe("initialization", () => {
    it("should initialize with default selection at index 0", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list));
      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBe("apple");
    });

    it("should initialize with custom initial index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 2));
      const [selection] = result.current;
      expect(selection[0]).toBe(2);
      expect(selection[1]).toBe("cherry");
    });

    it("should initialize with empty list", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList([]));
      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBeUndefined();
    });
  });

  describe("matchSelection", () => {
    it("should return true for the selected index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 1));
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ index: 1 })).toBe(true);
    });

    it("should return false for an unselected index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 1));
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ index: 0 })).toBe(false);
      expect(matchSelection({ index: 2 })).toBe(false);
    });

    it("should return true for the selected value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 1));
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ value: "banana" })).toBe(true);
    });

    it("should return false for an unselected value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 1));
      const [, { matchSelection }] = result.current;
      expect(matchSelection({ value: "apple" })).toBe(false);
      expect(matchSelection({ value: "cherry" })).toBe(false);
    });
  });

  describe("updateSelection", () => {
    it("should update selection by index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ index: 3 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(3);
      expect(selection[1]).toBe("date");
    });

    it("should update selection by value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ value: "cherry" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(2);
      expect(selection[1]).toBe("cherry");
    });

    it("should warn when value does not exist in list", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ value: "nonexistent" })();
      });

      // Selection should remain unchanged
      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBe("apple");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("updateSelection failed")
      );
      warnSpy.mockRestore();
    });

    it("should allow updating to different indices sequentially", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ index: 1 })();
      });
      expect(result.current[0][0]).toBe(1);
      expect(result.current[0][1]).toBe("banana");

      act(() => {
        result.current[1].updateSelection({ index: 4 })();
      });
      expect(result.current[0][0]).toBe(4);
      expect(result.current[0][1]).toBe("elderberry");
    });
  });

  describe("toggleSelection", () => {
    it("should select a different index", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 0));

      act(() => {
        result.current[1].toggleSelection({ index: 2 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(2);
      expect(selection[1]).toBe("cherry");
    });

    it("should not deselect current index when allowUnselected is false", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() =>
        useSelectableList(list, 0, false)
      );

      act(() => {
        result.current[1].toggleSelection({ index: 0 })();
      });

      // Selection should remain unchanged
      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBe("apple");
      expect(warnSpy).toHaveBeenCalledWith(
        "allowUnselected is false. Cannot unselect item"
      );
      warnSpy.mockRestore();
    });

    it("should deselect current index when allowUnselected is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useSelectableList(list, 0, true)
      );

      act(() => {
        result.current[1].toggleSelection({ index: 0 })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(-1);
    });

    it("should toggle selection by value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list, 0));

      act(() => {
        result.current[1].toggleSelection({ value: "date" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(3);
      expect(selection[1]).toBe("date");
    });

    it("should deselect by value when allowUnselected is true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useSelectableList(list, 0, true)
      );

      act(() => {
        result.current[1].toggleSelection({ value: "apple" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(-1);
    });

    it("should not deselect by value when allowUnselected is false", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() =>
        useSelectableList(list, 0, false)
      );

      act(() => {
        result.current[1].toggleSelection({ value: "apple" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBe("apple");
      expect(warnSpy).toHaveBeenCalledWith(
        "allowUnselected is false. Cannot unselect item"
      );
      warnSpy.mockRestore();
    });

    it("should warn when toggling a value that does not exist in list", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      // Also suppress the console.log("as") debug statement in the hook
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].toggleSelection({ value: "nonexistent" })();
      });

      const [selection] = result.current;
      expect(selection[0]).toBe(0);
      expect(selection[1]).toBe("apple");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("toggleSelection failed")
      );
      warnSpy.mockRestore();
      logSpy.mockRestore();
    });
  });

  describe("warnings", () => {
    it("should warn when both index and value are provided to matchSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      result.current[1].matchSelection({ index: 0, value: "apple" });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Expected either")
      );
      warnSpy.mockRestore();
    });

    it("should warn when both index and value are provided to updateSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ index: 0, value: "apple" })();
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Expected either")
      );
      warnSpy.mockRestore();
    });

    it("should warn when both index and value are provided to toggleSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].toggleSelection({ index: 0, value: "apple" })();
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Expected either")
      );
      warnSpy.mockRestore();
    });

    it("should warn when neither index nor value is provided to matchSelection", () => {
      expect.hasAssertions();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useSelectableList(list));

      result.current[1].matchSelection({});

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("are all undefined")
      );
      warnSpy.mockRestore();
    });
  });

  describe("only one item selected at a time", () => {
    it("should replace previous selection when a new one is made", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useSelectableList(list));

      act(() => {
        result.current[1].updateSelection({ index: 1 })();
      });
      expect(result.current[1].matchSelection({ index: 0 })).toBe(false);
      expect(result.current[1].matchSelection({ index: 1 })).toBe(true);

      act(() => {
        result.current[1].updateSelection({ index: 3 })();
      });
      expect(result.current[1].matchSelection({ index: 1 })).toBe(false);
      expect(result.current[1].matchSelection({ index: 3 })).toBe(true);
    });
  });
});
