import React, { useState } from "react";
import useCounter from "..";
import { render, cleanup } from "react-testing-library";

describe("use-counter base", () => {
  let Counter;
  beforeEach(() => {
    Counter = function() {
      const { value, increment, decrement } = useCounter(3);
      return (
        <div>
          <button data-testid="increment-button" onClick={increment} />
          <button data-testid="decrement-button" onClick={decrement} />
          <span data-testid="element">{value}</span>
        </div>
      );
    };
  });
  afterEach(cleanup); // <-- add this

  it("initializes correctly", () => {
    const { getByTestId } = render(<Counter />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(3);
  });
  it("increments and decrements correctly", () => {
    const { getByTestId } = render(<Counter />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(3);
    const incrementButton = getByTestId("increment-button");
    incrementButton.click();
    incrementButton.click();
    expect(parseInt(renderedElement.textContent)).toEqual(5);

    const decrementButton = getByTestId("decrement-button");
    decrementButton.click();
    decrementButton.click();
    decrementButton.click();
    expect(parseInt(renderedElement.textContent)).toEqual(2);
  });
});

describe("use-counter misc", () => {
  let Counter;
  beforeEach(() => {
    Counter = function({ initialValue }) {
      const { value, incrementBy, decrementBy, reset } = useCounter(
        initialValue
      );
      function incrementByFive() {
        incrementBy(5);
      }
      function decrementByThree() {
        decrementBy(3);
      }
      return (
        <div>
          <button data-testid="increment-by-5-btn" onClick={incrementByFive} />
          <button data-testid="decrement-by-3-btn" onClick={decrementByThree} />
          <button data-testid="reset-btn" onClick={reset} />
          <span data-testid="element">{value}</span>
        </div>
      );
    };
  });

  afterEach(cleanup); // <-- add this

  it("incrementsBy and decrementsBy correctly", () => {
    const { getByTestId } = render(<Counter initialValue={8} />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(8);

    const incrementButton = getByTestId("increment-by-5-btn");
    incrementButton.click();
    expect(parseInt(renderedElement.textContent)).toEqual(13);

    const decrementButton = getByTestId("decrement-by-3-btn");
    decrementButton.click();
    decrementButton.click();
    decrementButton.click();
    decrementButton.click();
    decrementButton.click();
    expect(parseInt(renderedElement.textContent)).toEqual(-2);

    const resetButton = getByTestId("reset-btn");
    resetButton.click();
    expect(parseInt(renderedElement.textContent)).toEqual(8);
  });
});
