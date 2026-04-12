import { renderHook, act } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";
import { useTextSelection } from "@/hooks/useTextSelection";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fireSelectionChange() {
  const event = new Event("selectionchange", { bubbles: false });
  document.dispatchEvent(event);
}

function fireMouseDown(target: EventTarget, relatedTarget?: Node) {
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  if (relatedTarget) {
    Object.defineProperty(event, "target", {
      value: relatedTarget,
      writable: false,
    });
  }
  target.dispatchEvent(event);
}

interface MockSelectionOptions {
  anchorNode?: Node;
  focusNode?: Node;
  anchorOffset?: number;
  focusOffset?: number;
  isCollapsed?: boolean;
  rangeCount?: number;
}

function mockWindowSelection(
  text: string,
  options: MockSelectionOptions = {}
) {
  const fakeRect: DOMRect = {
    x: 10,
    y: 20,
    width: 100,
    height: 20,
    top: 20,
    right: 110,
    bottom: 40,
    left: 10,
    toJSON: () => ({}),
  };
  const fakeRange = {
    getBoundingClientRect: vi.fn(() => fakeRect),
  };
  const fakeSelection = {
    toString: () => text,
    isCollapsed: options.isCollapsed ?? !text,
    anchorNode: options.anchorNode ?? document.body,
    focusNode: options.focusNode ?? document.body,
    anchorOffset: options.anchorOffset ?? 0,
    focusOffset: options.focusOffset ?? text.length,
    rangeCount: options.rangeCount ?? (text ? 1 : 0),
    getRangeAt: vi.fn(() => fakeRange),
  };
  vi.spyOn(window, "getSelection").mockReturnValue(
    fakeSelection as unknown as Selection
  );
  return { fakeSelection, fakeRange, fakeRect };
}

function mockEmptySelection() {
  const fakeSelection = {
    toString: () => "",
    isCollapsed: true,
    anchorNode: null,
    focusNode: null,
    anchorOffset: 0,
    focusOffset: 0,
    rangeCount: 0,
    getRangeAt: vi.fn(),
  };
  vi.spyOn(window, "getSelection").mockReturnValue(
    fakeSelection as unknown as Selection
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useTextSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmptySelection();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -- existence --

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTextSelection).toBeDefined();
  });

  // -- initial state --

  it("should return a tuple", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(1);
  });

  it("should start with empty selection state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());
    const [state] = result.current;
    expect(state).toEqual({
      text: "",
      rect: null,
      startOffset: 0,
      endOffset: 0,
      anchorNode: null,
      focusNode: null,
    });
  });

  // -- selectionchange event --

  it("should update text when selectionchange fires", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("hello world");
      fireSelectionChange();
    });

    expect(result.current[0].text).toBe("hello world");
  });

  it("should expose anchorOffset as startOffset", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("foo", { anchorOffset: 3, focusOffset: 6 });
      fireSelectionChange();
    });

    expect(result.current[0].startOffset).toBe(3);
  });

  it("should expose focusOffset as endOffset", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("foo", { anchorOffset: 3, focusOffset: 6 });
      fireSelectionChange();
    });

    expect(result.current[0].endOffset).toBe(6);
  });

  it("should expose anchorNode", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());
    const node = document.createTextNode("hello");

    act(() => {
      mockWindowSelection("hello", { anchorNode: node });
      fireSelectionChange();
    });

    expect(result.current[0].anchorNode).toBe(node);
  });

  it("should expose focusNode", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());
    const node = document.createTextNode("world");

    act(() => {
      mockWindowSelection("world", { focusNode: node });
      fireSelectionChange();
    });

    expect(result.current[0].focusNode).toBe(node);
  });

  it("should populate rect when selection has ranges", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("selected");
      fireSelectionChange();
    });

    expect(result.current[0].rect).not.toBeNull();
    expect(result.current[0].rect?.width).toBe(100);
    expect(result.current[0].rect?.height).toBe(20);
  });

  it("should reset to empty state when selection becomes empty", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    // Select something first
    act(() => {
      mockWindowSelection("some text");
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("some text");

    // Clear selection
    act(() => {
      mockEmptySelection();
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("");
    expect(result.current[0].rect).toBeNull();
    expect(result.current[0].anchorNode).toBeNull();
  });

  it("should update on subsequent selections", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("first");
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("first");

    act(() => {
      mockWindowSelection("second");
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("second");
  });

  // -- event listener lifecycle --

  it("should add selectionchange listener on mount", () => {
    expect.hasAssertions();
    const addSpy = vi.spyOn(document, "addEventListener");

    renderHook(() => useTextSelection());

    expect(addSpy).toHaveBeenCalledWith(
      "selectionchange",
      expect.any(Function)
    );
  });

  it("should remove selectionchange listener on unmount", () => {
    expect.hasAssertions();
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useTextSelection());
    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "selectionchange",
      expect.any(Function)
    );
  });

  it("should add mousedown listener on mount", () => {
    expect.hasAssertions();
    const addSpy = vi.spyOn(document, "addEventListener");

    renderHook(() => useTextSelection());

    expect(addSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });

  it("should remove mousedown listener on unmount", () => {
    expect.hasAssertions();
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useTextSelection());
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });

  // -- collapsed / empty selection edge cases --

  it("should return empty state when selection is collapsed", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("", { isCollapsed: true });
      fireSelectionChange();
    });

    expect(result.current[0].text).toBe("");
    expect(result.current[0].rect).toBeNull();
  });

  it("should return empty state when getSelection returns null", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useTextSelection());

    act(() => {
      vi.spyOn(window, "getSelection").mockReturnValue(null);
      fireSelectionChange();
    });

    expect(result.current[0].text).toBe("");
  });

  // -- target scoping --

  it("should accept a target ref parameter", () => {
    expect.hasAssertions();
    function TestHook() {
      const ref = useRef<HTMLDivElement>(null);
      return useTextSelection(ref);
    }
    const { result } = renderHook(() => TestHook());
    expect(result.current).toHaveLength(1);
  });

  it("should ignore selections outside the target element", () => {
    expect.hasAssertions();

    const target = document.createElement("div");
    document.body.appendChild(target);
    const outsideNode = document.createTextNode("outside");
    document.body.appendChild(outsideNode);

    function TestHook() {
      const ref = useRef<HTMLDivElement>(null);
      // Manually point ref at target
      (ref as React.MutableRefObject<HTMLDivElement>).current = target;
      return useTextSelection(ref);
    }

    const { result } = renderHook(() => TestHook());

    act(() => {
      // Selection nodes are outside the target
      mockWindowSelection("outside text", {
        anchorNode: outsideNode,
        focusNode: outsideNode,
      });
      fireSelectionChange();
    });

    expect(result.current[0].text).toBe("");

    document.body.removeChild(target);
    document.body.removeChild(outsideNode);
  });

  it("should track selections inside the target element", () => {
    expect.hasAssertions();

    const target = document.createElement("div");
    document.body.appendChild(target);
    const insideNode = document.createTextNode("inside text");
    target.appendChild(insideNode);

    function TestHook() {
      const ref = useRef<HTMLDivElement>(null);
      (ref as React.MutableRefObject<HTMLDivElement>).current = target;
      return useTextSelection(ref);
    }

    const { result } = renderHook(() => TestHook());

    act(() => {
      mockWindowSelection("inside text", {
        anchorNode: insideNode,
        focusNode: insideNode,
      });
      fireSelectionChange();
    });

    expect(result.current[0].text).toBe("inside text");

    document.body.removeChild(target);
  });

  it("should clear state on mousedown outside target when text is selected", () => {
    expect.hasAssertions();

    const target = document.createElement("div");
    const outside = document.createElement("button");
    document.body.appendChild(target);
    document.body.appendChild(outside);
    const insideNode = document.createTextNode("selected");
    target.appendChild(insideNode);

    function TestHook() {
      const ref = useRef<HTMLDivElement>(null);
      (ref as React.MutableRefObject<HTMLDivElement>).current = target;
      return useTextSelection(ref);
    }

    const { result } = renderHook(() => TestHook());

    // First select some text inside the target
    act(() => {
      mockWindowSelection("selected", {
        anchorNode: insideNode,
        focusNode: insideNode,
      });
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("selected");

    // Then click outside the target
    act(() => {
      // Dispatch mousedown on a node outside the target
      const mousedownEvent = new MouseEvent("mousedown", { bubbles: true });
      // Override target to be the outside element
      Object.defineProperty(mousedownEvent, "target", {
        value: outside,
        writable: false,
      });
      document.dispatchEvent(mousedownEvent);
    });

    expect(result.current[0].text).toBe("");
    expect(result.current[0].rect).toBeNull();

    document.body.removeChild(target);
    document.body.removeChild(outside);
  });

  it("should NOT clear state on mousedown inside target", () => {
    expect.hasAssertions();

    const target = document.createElement("div");
    document.body.appendChild(target);
    const insideNode = document.createTextNode("stay");
    target.appendChild(insideNode);

    function TestHook() {
      const ref = useRef<HTMLDivElement>(null);
      (ref as React.MutableRefObject<HTMLDivElement>).current = target;
      return useTextSelection(ref);
    }

    const { result } = renderHook(() => TestHook());

    act(() => {
      mockWindowSelection("stay", {
        anchorNode: insideNode,
        focusNode: insideNode,
      });
      fireSelectionChange();
    });
    expect(result.current[0].text).toBe("stay");

    // Click inside the target — should NOT clear
    act(() => {
      const mousedownEvent = new MouseEvent("mousedown", { bubbles: true });
      Object.defineProperty(mousedownEvent, "target", {
        value: target,
        writable: false,
      });
      document.dispatchEvent(mousedownEvent);
    });

    expect(result.current[0].text).toBe("stay");

    document.body.removeChild(target);
  });

  // -- multiple instances --

  it("should support multiple independent hook instances", () => {
    expect.hasAssertions();
    const { result: r1 } = renderHook(() => useTextSelection());
    const { result: r2 } = renderHook(() => useTextSelection());

    act(() => {
      mockWindowSelection("shared");
      fireSelectionChange();
    });

    expect(r1.current[0].text).toBe("shared");
    expect(r2.current[0].text).toBe("shared");
  });
});
