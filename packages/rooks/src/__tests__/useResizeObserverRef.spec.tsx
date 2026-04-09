import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useResizeObserverRef } from "@/hooks/useResizeObserverRef";

const observe = vi.fn();
const disconnect = vi.fn();
let resizeCallback: ResizeObserverCallback | null = null;

describe("useResizeObserverRef", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resizeCallback = null;

    global.ResizeObserver = vi.fn().mockImplementation(function (
      callback: ResizeObserverCallback
    ) {
      resizeCallback = callback;
      return {
        observe,
        disconnect,
      };
    }) as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should observe the attached element", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useResizeObserverRef(callback));
    const element = document.createElement("div");

    act(() => {
      result.current[0](element);
    });

    expect(observe).toHaveBeenCalledWith(element, { box: "content-box" });
  });

  it("should forward resize entries to the latest callback", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { result } = renderHook(() => useResizeObserverRef(callback));
    const element = document.createElement("div");

    act(() => {
      result.current[0](element);
    });

    const entry = {
      target: element,
      contentRect: { width: 240, height: 120 },
    } as ResizeObserverEntry;
    const observer = {} as ResizeObserver;

    act(() => {
      resizeCallback?.([entry], observer);
    });

    expect(callback).toHaveBeenCalledWith([entry], observer);
  });

  it("should disconnect the observer on unmount", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useResizeObserverRef(vi.fn()));
    const element = document.createElement("div");

    act(() => {
      result.current[0](element);
    });

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
