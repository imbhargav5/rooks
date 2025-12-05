import { vi } from "vitest";
/**
 */
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { useOnLongPress } from "@/hooks/useOnLongPress";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useOnLongPress", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnLongPress).toBeDefined();
  });
});

describe("useOnLongPress behavior", () => {
  const LONG_PRESS_DURATION = 300;
  let callback: vi.Mock;
  let onClick: vi.Mock;

  beforeEach(() => {
    callback = vi.fn();
    onClick = vi.fn();
  });

  it("triggers long press callback when the button is pressed for the specified duration", async () => {
    expect.assertions(1);

    const TestComponent = () => {
      const longPressRef = useOnLongPress(callback, {
        onClick,
        duration: LONG_PRESS_DURATION,
      });
      return <button ref={longPressRef}>Long Press Me</button>;
    };

    const { getByText } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.mouseDown(button);
    });
    await act(async () => {
      await wait(LONG_PRESS_DURATION + 50);
    });
    act(() => {
      fireEvent.mouseUp(button);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not trigger long press callback when the button is released before the specified duration", async () => {
    expect.assertions(1);

    const TestComponent = () => {
      const longPressRef = useOnLongPress(
        () => {
          callback();
        },
        {
          onClick: () => {
            onClick();
          },
          duration: LONG_PRESS_DURATION,
        }
      );
      return <button ref={longPressRef}>Long Press Me</button>;
    };

    const { getByText } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.mouseDown(button);
    });
    await act(async () => {
      await wait(LONG_PRESS_DURATION - 50);
    });
    act(() => {
      fireEvent.mouseUp(button);
    });

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("triggers onClick callback when the button is clicked without long pressing", async () => {
    expect.assertions(2);

    const TestComponent = () => {
      const longPressRef = useOnLongPress(
        () => {
          callback();
        },
        {
          onClick: () => {
            onClick();
          },
          duration: LONG_PRESS_DURATION,
        }
      );
      return <button ref={longPressRef}>Long Press Me</button>;
    };

    const { getByText } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.mouseDown(button);
    });
    await act(async () => {
      await wait(100);
    });
    act(() => {
      fireEvent.mouseUp(button);
    });
    expect(callback).toHaveBeenCalledTimes(0);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should work with touch events", async () => {
    expect.assertions(1);

    const TestComponent = () => {
      const longPressRef = useOnLongPress(
        () => {
          callback();
        },
        {
          onClick: () => {
            onClick();
          },
          duration: LONG_PRESS_DURATION,
        }
      );
      return <button ref={longPressRef}>Long Press Me</button>;
    };

    const { getByText } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.touchStart(button);
    });
    await act(async () => {
      await wait(LONG_PRESS_DURATION + 50);
    });
    act(() => {
      fireEvent.touchEnd(button);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should work with touch events and onClick", async () => {
    expect.assertions(2);

    const TestComponent = () => {
      const longPressRef = useOnLongPress(
        () => {
          callback();
        },
        {
          onClick: () => {
            onClick();
          },
          duration: LONG_PRESS_DURATION,
        }
      );
      return <button ref={longPressRef}>Long Press Me</button>;
    };

    const { getByText } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.touchStart(button);
    });
    await act(async () => {
      await wait(100);
    });
    act(() => {
      fireEvent.touchEnd(button);
    });
    expect(callback).toHaveBeenCalledTimes(0);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should not have stale state", async () => {
    expect.assertions(6);

    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      const longPressRef = useOnLongPress(
        () => {
          setCount(count + 1);
          callback();
        },
        {
          onClick: () => {
            onClick();
          },
          duration: LONG_PRESS_DURATION,
        }
      );
      return (
        <div>
          <p data-testid="count">{count}</p>
          <button ref={longPressRef}>Long Press Me</button>
        </div>
      );
    };

    const { getByText, getByTestId, rerender } = render(<TestComponent />);
    const button = getByText("Long Press Me");

    act(() => {
      fireEvent.touchStart(button);
    });
    await act(async () => {
      await wait(LONG_PRESS_DURATION + 50);
    });
    act(() => {
      fireEvent.touchEnd(button);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(getByTestId("count").textContent).toBe("1");
    rerender(<TestComponent />);

    act(() => {
      fireEvent.touchStart(button);
    });
    await act(async () => {
      await wait(LONG_PRESS_DURATION + 50);
    });
    act(() => {
      fireEvent.touchEnd(button);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(getByTestId("count").textContent).toBe("2");
  });
});
