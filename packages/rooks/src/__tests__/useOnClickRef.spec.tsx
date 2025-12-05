import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { useOnClickRef } from "@/hooks/useOnClickRef";
import { cleanup } from "@testing-library/react";

describe("useOnClickRef", () => {
  let onClick: () => void;

  beforeEach(() => {
    onClick = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should call the onClick callback on 'click' event", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useOnClickRef(onClick));
    const ref = result.current;
    const element = document.createElement("div");

    // Simulate the ref being attached to an element
    act(() => {
      ref(element);
    });

    // Trigger the 'click' event
    act(() => {
      const clickEvent = new MouseEvent("click", { bubbles: true });
      element.dispatchEvent(clickEvent);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should call the onClick callback on 'touchend' event", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useOnClickRef(onClick));
    const ref = result.current;
    const element = document.createElement("div");

    // Simulate the ref being attached to an element
    act(() => {
      ref(element);
    });

    // Trigger the 'touchend' event
    act(() => {
      const touchEndEvent = new TouchEvent("touchend", { bubbles: true });
      element.dispatchEvent(touchEndEvent);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should remove event listeners on cleanup", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useOnClickRef(onClick));
    const ref = result.current;
    const element = document.createElement("div");

    // Simulate the ref being attached to an element
    act(() => {
      ref(element);
    });

    // Check if event listeners are removed on unmount
    const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchend",
      expect.any(Function)
    );
  });
});
