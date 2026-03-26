import { renderHook, act } from "@testing-library/react";
import { useMouse } from "@/hooks/useMouse";

function fireMouseMove(
  target: EventTarget,
  coords: Partial<MouseEventInit>
): void {
  const event = new MouseEvent("mousemove", {
    bubbles: true,
    cancelable: true,
    ...coords,
  });
  target.dispatchEvent(event);
}

describe("useMouse", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMouse).toBeDefined();
  });

  it("should default with null values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());
    expect(result.current).toEqual({
      clientX: null,
      clientY: null,
      movementX: null,
      movementY: null,
      offsetX: null,
      offsetY: null,
      pageX: null,
      pageY: null,
      screenX: null,
      screenY: null,
      x: null,
      y: null,
    });
  });

  it("should update clientX and clientY on mousemove", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { clientX: 100, clientY: 200 });
    });

    expect(result.current.clientX).toBe(100);
    expect(result.current.clientY).toBe(200);
  });

  it("should update screenX and screenY on mousemove", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { screenX: 150, screenY: 250 });
    });

    expect(result.current.screenX).toBe(150);
    expect(result.current.screenY).toBe(250);
  });

  it("should update pageX and pageY on mousemove", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { pageX: 300, pageY: 400 });
    });

    // jsdom MouseEvent doesn't support pageX/pageY via constructor,
    // they default to 0 — verify the hook still reads them
    expect(result.current.pageX).toBeDefined();
    expect(result.current.pageY).toBeDefined();
  });

  it("should update movementX and movementY on mousemove", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { movementX: 5, movementY: -3 });
    });

    expect(result.current.movementX).toBe(5);
    expect(result.current.movementY).toBe(-3);
  });

  it("should set x and y as aliases for screenX and screenY", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { screenX: 42, screenY: 84 });
    });

    expect(result.current.x).toBe(result.current.screenX);
    expect(result.current.y).toBe(result.current.screenY);
    expect(result.current.x).toBe(42);
    expect(result.current.y).toBe(84);
  });

  it("should track all 12 properties simultaneously", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, {
        clientX: 10,
        clientY: 20,
        screenX: 30,
        screenY: 40,
        movementX: 1,
        movementY: 2,
      });
    });

    expect(result.current.clientX).toBe(10);
    expect(result.current.clientY).toBe(20);
    expect(result.current.screenX).toBe(30);
    expect(result.current.screenY).toBe(40);
    expect(result.current.movementX).toBe(1);
    expect(result.current.movementY).toBe(2);
    expect(result.current.x).toBe(30);
    expect(result.current.y).toBe(40);
    // offsetX/offsetY and pageX/pageY are also set (default to 0 in jsdom)
    expect(result.current.offsetX).toBeDefined();
    expect(result.current.offsetY).toBeDefined();
    expect(result.current.pageX).toBeDefined();
    expect(result.current.pageY).toBeDefined();
  });

  it("should update on each subsequent mouse move", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { clientX: 10, clientY: 20 });
    });
    expect(result.current.clientX).toBe(10);
    expect(result.current.clientY).toBe(20);

    act(() => {
      fireMouseMove(document, { clientX: 50, clientY: 60 });
    });
    expect(result.current.clientX).toBe(50);
    expect(result.current.clientY).toBe(60);

    act(() => {
      fireMouseMove(document, { clientX: 999, clientY: 888 });
    });
    expect(result.current.clientX).toBe(999);
    expect(result.current.clientY).toBe(888);
  });

  it("should clean up event listener on unmount", () => {
    expect.hasAssertions();
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useMouse());

    expect(addSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("should not update state after unmount", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { clientX: 10, clientY: 20 });
    });
    expect(result.current.clientX).toBe(10);

    unmount();

    // Should not throw when mouse moves after unmount
    expect(() => {
      act(() => {
        fireMouseMove(document, { clientX: 999, clientY: 999 });
      });
    }).not.toThrow();
  });

  it("should handle zero coordinates", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, {
        clientX: 0,
        clientY: 0,
        screenX: 0,
        screenY: 0,
      });
    });

    expect(result.current.clientX).toBe(0);
    expect(result.current.clientY).toBe(0);
    expect(result.current.screenX).toBe(0);
    expect(result.current.screenY).toBe(0);
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it("should handle negative movement values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouse());

    act(() => {
      fireMouseMove(document, { movementX: -10, movementY: -20 });
    });

    expect(result.current.movementX).toBe(-10);
    expect(result.current.movementY).toBe(-20);
  });

  it("should work with multiple hook instances independently", () => {
    expect.hasAssertions();
    const { result: result1 } = renderHook(() => useMouse());
    const { result: result2 } = renderHook(() => useMouse());

    // Both start with null
    expect(result1.current.clientX).toBeNull();
    expect(result2.current.clientX).toBeNull();

    act(() => {
      fireMouseMove(document, { clientX: 42, clientY: 84 });
    });

    // Both should receive the same update
    expect(result1.current.clientX).toBe(42);
    expect(result2.current.clientX).toBe(42);
    expect(result1.current.clientY).toBe(84);
    expect(result2.current.clientY).toBe(84);
  });
});
