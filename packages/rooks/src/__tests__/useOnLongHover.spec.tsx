import { vi } from "vitest";
/**
 */
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { useOnLongHover } from "@/hooks/useOnLongHover";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useOnLongHover", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnLongHover).toBeDefined();
  });
});

describe("useOnLongHover behavior", () => {
  const LONG_HOVER_DURATION = 300;
  let callback: vi.Mock;

  beforeEach(() => {
    callback = vi.fn();
  });

  it("triggers long hover callback when the element is hovered for the specified duration", async () => {
    expect.assertions(1);

    const TestComponent = () => {
      const longHoverRef = useOnLongHover(callback, {
        duration: LONG_HOVER_DURATION,
      });
      return <div ref={longHoverRef}>Long Hover Me</div>;
    };

    const { getByText } = render(<TestComponent />);
    const div = getByText("Long Hover Me");

    act(() => {
      fireEvent.mouseEnter(div);
    });
    await wait(LONG_HOVER_DURATION + 50);
    act(() => {
      fireEvent.mouseLeave(div);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not trigger long hover callback when the element is unhovered before the specified duration", async () => {
    expect.assertions(1);

    const TestComponent = () => {
      const longHoverRef = useOnLongHover(callback, {
        duration: LONG_HOVER_DURATION,
      });
      return <div ref={longHoverRef}>Long Hover Me</div>;
    };

    const { getByText } = render(<TestComponent />);
    const div = getByText("Long Hover Me");

    act(() => {
      fireEvent.mouseEnter(div);
    });
    await act(async () => {
      await wait(LONG_HOVER_DURATION - 50);
    });
    act(() => {
      fireEvent.mouseLeave(div);
    });

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should not have stale state", async () => {
    expect.assertions(4);

    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      const longHoverRef = useOnLongHover(
        () => {
          setCount(count + 1);
          callback();
        },
        { duration: LONG_HOVER_DURATION }
      );

      return (
        <div>
          <p data-testid="count">{count}</p>
          <div ref={longHoverRef}>Long Hover Me</div>
        </div>
      );
    };

    const { getByText, getByTestId, rerender } = render(<TestComponent />);
    const div = getByText("Long Hover Me");

    act(() => {
      fireEvent.mouseEnter(div);
    });
    await act(async () => {
      await wait(LONG_HOVER_DURATION + 50);
    });
    act(() => {
      fireEvent.mouseLeave(div);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(getByTestId("count").textContent).toBe("1");
    rerender(<TestComponent />);

    act(() => {
      fireEvent.mouseEnter(div);
    });
    await act(async () => {
      await wait(LONG_HOVER_DURATION + 50);
    });
    act(() => {
      fireEvent.mouseLeave(div);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(getByTestId("count").textContent).toBe("2");
  });
});
