import { renderHook, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useMouseMoveDelta } from "@/hooks/useMouseMoveDelta";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useMouseMoveDelta", () => {
  it("should return initial delta values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouseMoveDelta());

    expect(result.current.deltaX).toBe(0);
    expect(result.current.deltaY).toBe(0);
    expect(result.current.velocityX).toBe(0);
    expect(result.current.velocityY).toBe(0);
  });

  it("should update delta values and velocity on mouse move", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouseMoveDelta());

    act(() => {
      fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    });

    expect(result.current.deltaX).toBe(0);
    expect(result.current.deltaY).toBe(0);
    expect(result.current.velocityX).toBe(0);
    expect(result.current.velocityY).toBe(0);
    await wait(64);
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    });

    expect(result.current.deltaX).toBe(50);
    expect(result.current.deltaY).toBe(50);
    expect(result.current.velocityX).toBeGreaterThan(0);
    expect(result.current.velocityY).toBeGreaterThan(0);
  });

  it("should reset delta values after not moving", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouseMoveDelta());

    act(() => {
      fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    });

    await wait(64);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    });

    expect(result.current.deltaX).toBe(0);
    expect(result.current.deltaY).toBe(0);
    expect(result.current.velocityX).toBe(0);
    expect(result.current.velocityY).toBe(0);

    await wait(64);

    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    });

    expect(result.current.deltaX).toBe(50);
    expect(result.current.deltaY).toBe(150);
    expect(result.current.velocityX).toBeGreaterThan(0);
    expect(result.current.velocityY).toBeGreaterThan(0);
  });
});
