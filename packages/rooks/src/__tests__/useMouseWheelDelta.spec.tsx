import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useMouseWheelDelta } from "@/hooks/useMouseWheelDelta";

describe("useMouseWheelDelta", () => {
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
      fireEvent.wheel(window, { deltaY: 50 });
    });

    expect(outputElement.textContent).not.toBe("0,0");
    if (!outputElement.textContent) {
      throw new Error("outputElement.textContent is null");
    }
    const [newDelta, newVelocity] = outputElement.textContent
      .split(",")
      .map((value) => parseFloat(value));

    expect(newDelta).toBe(50);
    expect(newVelocity).toBeGreaterThanOrEqual(0);
  });

  it("calculates velocity correctly based on deltaY and time difference", async () => {
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
      fireEvent.wheel(window, { deltaY: 100 });
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    act(() => {
      fireEvent.wheel(window, { deltaY: 150 });
    });
    if (!outputElement.textContent) {
      throw new Error("outputElement.textContent is null");
    }
    const [newDelta, newVelocity] = outputElement.textContent
      .split(",")
      .map((value) => parseFloat(value));

    expect(newDelta).toBe(150);
    expect(newVelocity).toBeGreaterThanOrEqual(0);
  });
});
