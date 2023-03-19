/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useOnHoverRef } from "@/hooks/useOnHoverRef";
import { cleanup, fireEvent } from "@testing-library/react";

describe("useOnHoverRef", () => {
  let onMouseEnter: () => void, onMouseLeave: () => void;

  beforeEach(() => {
    onMouseEnter = jest.fn();
    onMouseLeave = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("should call onMouseEnter when the mouse enters the target element", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useOnHoverRef(onMouseEnter, onMouseLeave)
    );
    const ref = result.current;
    const target = document.createElement("div");

    act(() => {
      ref(target);
    });
    act(() => {
      const mouseEnterEvent = new MouseEvent("mouseenter");
      fireEvent(target, mouseEnterEvent);
    });

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  it("should call onMouseLeave when the mouse leaves the target element", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useOnHoverRef(onMouseEnter, onMouseLeave)
    );
    const ref = result.current;
    const target = document.createElement("div");

    act(() => {
      ref(target);
    });

    act(() => {
      const mouseLeaveEvent = new MouseEvent("mouseleave");
      fireEvent(target, mouseLeaveEvent);
    });

    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("should clean up event listeners when the component is unmounted", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() =>
      useOnHoverRef(onMouseEnter, onMouseLeave)
    );
    const ref = result.current;
    const target = document.createElement("div");

    act(() => {
      ref(target);
    });

    const mouseEnterSpy = jest.spyOn(target, "removeEventListener");
    const mouseLeaveSpy = jest.spyOn(target, "removeEventListener");

    unmount();

    expect(mouseEnterSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function)
    );
    expect(mouseLeaveSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function)
    );

    mouseEnterSpy.mockRestore();
    mouseLeaveSpy.mockRestore();
    // expect(onMouseLeave).toHaveBeenCalledTimes(0);
  });
});
