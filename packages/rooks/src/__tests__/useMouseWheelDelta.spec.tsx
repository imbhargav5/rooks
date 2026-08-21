import React from "react";
import { vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useMouseWheelDelta } from "@/hooks/useMouseWheelDelta";

describe("useMouseWheelDelta", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMouseWheelDelta).toBeDefined();
  });

  it("returns initial deltaY and velocity values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useMouseWheelDelta());

    expect(result.current.delta).toBe(0);
    expect(result.current.velocity).toBe(0);
  });

  it("updates deltaY and velocity when wheel event is triggered", () => {
    expect.hasAssertions();
    const TestComponent = () => {
      const { delta, velocity } = useMouseWheelDelta();

      return (
        <div data-testid="output">
          {delta},{velocity}
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const outputElement = getByTestId("output");
    act(() => {
      fireEvent.wheel(document, { deltaY: 50 });
    });
    expect(outputElement.textContent).not.toBe("0,0");
    if (!outputElement.textContent) {
      throw new Error("outputElement.textContent is null");
    }
    const [newDelta, newVelocity] = outputElement.textContent
      .split(",")
      .map((value) => parseFloat(value));

    expect(newDelta).toBe(50);
    expect(newVelocity).toBe(0);
    vi.advanceTimersByTime(64);
    act(() => {
      fireEvent.wheel(document, { deltaY: 60 });
    });

    expect(outputElement.textContent).not.toBe("0,0");
    if (!outputElement.textContent) {
      throw new Error("outputElement.textContent is null");
    }
    const [newDelta2, newVelocity2] = outputElement.textContent
      .split(",")
      .map((value) => parseFloat(value));

    expect(newDelta2).toBe(60);
    expect(newVelocity2).toBe(0.9375);
  });

  it("calculates velocity correctly based on deltaY and time difference", () => {
    expect.hasAssertions();
    const TestComponent = () => {
      const { delta: deltaY, velocity } = useMouseWheelDelta();

      return (
        <div data-testid="output">
          {deltaY},{velocity}
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const outputElement = getByTestId("output");

    act(() => {
      fireEvent.wheel(document, { deltaY: 100 });
    });

    vi.advanceTimersByTime(100);
    act(() => {
      fireEvent.wheel(document, { deltaY: 150 });
    });
    if (!outputElement.textContent) {
      throw new Error("outputElement.textContent is null");
    }
    const [newDelta, newVelocity] = outputElement.textContent
      .split(",")
      .map((value) => parseFloat(value));

    expect(newDelta).toBe(150);
    expect(newVelocity).toBe(1.5);
  });
});
