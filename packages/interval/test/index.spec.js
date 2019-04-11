/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import useInterval from "..";

import { render, cleanup, fireEvent, act } from "react-testing-library";

describe("useInterval", () => {
  let App;

  beforeEach(() => {
    App = function() {
      const [currentValue, setCurrentValue] = useState(0);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      const { start, stop } = useInterval(() => {
        increment();
      }, 1000);
      return (
        <div>
          <p data-testid="value">{currentValue}</p>
          <button onClick={start} data-testid="start">
            Start
          </button>
          <button onClick={stop} data-testid="stop">
            Stop
          </button>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useInterval).toBeDefined();
  });
  it("should start timer when started with start function", () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<App />);
    const value = getByTestId("value");
    const start = getByTestId("start");
    expect(parseInt(value.innerHTML)).toBe(0);
    act(() => {
      fireEvent.click(start);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(parseInt(value.innerHTML)).toBe(1);
    jest.useRealTimers();
  });
});
// figure out tests
