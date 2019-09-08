import React, { useState } from "react";
import useThrottle from "..";
import { cleanup, render, act, fireEvent, wait } from "@testing-library/react";

describe("useThrottle hook", () => {
  let App;
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
    App = function() {
      const [number, setNumber] = useState(0);
      const [argumentNumber, setArgumentNumber] = useState(0);
      const addNumber = () => setNumber(number + 1);
      const [addNumberThrottled] = useThrottle(addNumber, TIMEOUT);

      const addNumberWithParam = argNumber => {
        setArgumentNumber(argNumber + 2);
        setNumber(number + 1);
      };
      const [addNumberThrottledWithParam] = useThrottle(
        () => addNumberWithParam(5),
        1000
      );
      return (
        <div>
          <span data-testid="throttle-value">{number}</span>
          <span data-testid="throttle-value-with-param">{argumentNumber}</span>
          <button data-testid="throttle-button" onClick={addNumberThrottled}>
            Add number throttled
          </button>
          <button
            data-testid="throttle-button-with-param"
            onClick={addNumberThrottledWithParam}
          >
            Add number throttled
          </button>
        </div>
      );
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useThrottle).toBeDefined();
  });

  it("should update value when used once", () => {
    const { getByTestId } = render(<App />);
    const throttleButton = getByTestId("throttle-button");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButton);
    });

    expect(parseInt(throttleValue.innerHTML)).toBe(1);
  });

  it("should update value once when clicked multiple times, one after another", () => {
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
    expect(parseInt(throttleValue.innerHTML)).toBe(1);
  });

  it("should update value twice when clicked twice, with 300ms break between them", async () => {
    const { getByTestId } = render(<App />);
    const throttleButton = getByTestId("throttle-button");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButton);
    });

    await new Promise(resolve => {
      setTimeout(() => {
        act(() => {
          fireEvent.click(throttleButton);
          resolve();
        });
      }, TIMEOUT);
    });

    await wait(
      () => {
        expect(parseInt(throttleValue.innerHTML)).toBe(2);
      },
      {
        timeout: TIMEOUT
      }
    );
  });
  it("should update value of state acording to argument passed in callback", async () => {
    const { getByTestId } = render(<App />);
    const throttleButtonWithParam = getByTestId("throttle-button-with-param");
    const throttleValueWithParam = getByTestId("throttle-value-with-param");
    const throttleValue = getByTestId("throttle-value");

    act(() => {
      fireEvent.click(throttleButtonWithParam);
    });

    expect(parseInt(throttleValue.innerHTML)).toBe(1);
    expect(parseInt(throttleValueWithParam.innerHTML)).toBe(7);
  });
});
