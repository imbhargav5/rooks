import { cleanup, render, act, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import { useThrottle } from "../hooks/useThrottle";

describe("useThrottle hook", () => {
  let App = () => <div />;
  const TIMEOUT = 300;
  const consoleError = console.error;

  // This is a temporary fix for weird error in testing library. It has something to do with react-dom.
  // There's a ticket here - https://github.com/facebook/react/issues/14769
  // Tests are passing correctly, so that's just for clean console.
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((...args) => {
      if (
        !args[0].includes(
          "Warning: An update to %s inside a test was not wrapped in act"
        )
      ) {
        consoleError(...args);
      }
    });
  });

  beforeEach(() => {
    App = () => {
      const [number, setNumber] = useState(0);
      const [argumentNumber, setArgumentNumber] = useState(0);
      const addNumber = () => setNumber(number + 1);
      const [addNumberThrottled] = useThrottle(addNumber, TIMEOUT);

      const addNumberWithParameter = (argumentNumber_: number) => {
        setArgumentNumber(argumentNumber_ + 2);
        setNumber(number + 1);
      };

      const [addNumberThrottledWithParameter] = useThrottle(
        () => addNumberWithParameter(5),
        1_000
      );

      return (
        <div>
          <span data-testid="throttle-value">{number}</span>
          <span data-testid="throttle-value-with-param">{argumentNumber}</span>
          <button
            data-testid="throttle-button"
            onClick={addNumberThrottled}
            type="button"
          >
            Add number throttled
          </button>
          <button
            data-testid="throttle-button-with-param"
            onClick={addNumberThrottledWithParameter}
            type="button"
          >
            Add number throttled
          </button>
        </div>
      );
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useThrottle).toBeDefined();
  });

  it("should update value when used once", () => {
    expect.hasAssertions();
    const { getByTestId } = render(<App />);
    const throttleButton = getByTestId("throttle-button");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButton);
    });

    expect(Number.parseInt(throttleValue.innerHTML)).toBe(1);
  });

  it("should update value once when clicked multiple times, one after another", () => {
    expect.hasAssertions();
    const { getByTestId } = render(<App />);
    const throttleButton = getByTestId("throttle-button");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButton);
    });
    act(() => {
      fireEvent.click(throttleButton);
    });
    act(() => {
      fireEvent.click(throttleButton);
    });
    expect(Number.parseInt(throttleValue.innerHTML)).toBe(1);
  });

  it("should update value twice when clicked twice, with 300ms break between them", async () => {
    expect.hasAssertions();
    jest.useFakeTimers();
    const { getByTestId } = render(<App />);
    const throttleButton = getByTestId("throttle-button");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButton);
    });

    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    act(() => {
      fireEvent.click(throttleButton);
    });
    expect(Number.parseInt(throttleValue.innerHTML)).toBe(2);
    act(() => {
      jest.advanceTimersByTime(TIMEOUT);
    });

    act(() => {
      fireEvent.click(throttleButton);
    });
    act(() => {
      fireEvent.click(throttleButton);
    });
    expect(Number.parseInt(throttleValue.innerHTML)).toBe(3);

    jest.useRealTimers();
  });
  it("should update value of state according to argument passed in callback", async () => {
    expect.hasAssertions();
    const { getByTestId } = render(<App />);
    const throttleButtonWithParameter = getByTestId(
      "throttle-button-with-param"
    );
    const throttleValueWithParameter = getByTestId("throttle-value-with-param");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButtonWithParameter);
    });

    expect(Number.parseInt(throttleValue.innerHTML)).toBe(1);
    expect(Number.parseInt(throttleValueWithParameter.innerHTML)).toBe(7);
  });
});
