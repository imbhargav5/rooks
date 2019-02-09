/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import usePrevious from "..";
import {
  render,
  cleanup,
  fireEvent,
  flushEffects
} from "react-testing-library";

describe("usePrevious", () => {
  let App;

  beforeEach(() => {
    App = function() {
      const [currentValue, setCurrentValue] = useState(0);
      const previousValue = usePrevious(currentValue);
      function increment() {
        setCurrentValue(currentValue + 1);
      }
      return (
        <div>
          <p onClick={increment} data-testid="current-element">
            {currentValue}
          </p>
          <p data-testid="previous-element">{previousValue}</p>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect(usePrevious).toBeDefined();
  });
  it("sets initial value to null and updates after change in tracked value", () => {
    const { getByTestId } = render(<App />);
    const currentElement = getByTestId("current-element");
    const previousElement = getByTestId("previous-element");
    expect(currentElement.innerHTML).toBe("0");
    expect(previousElement.innerHTML).toBe("");
    fireEvent.click(currentElement);
    expect(currentElement.innerHTML).toBe("1");
    flushEffects();
    expect(previousElement.innerHTML).toBe("0");
  });
});

// figure out tests
