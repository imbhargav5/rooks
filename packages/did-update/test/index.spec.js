/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import useDidUpdate from "..";
import { render, cleanup, fireEvent, act } from "react-testing-library";

describe("useDidUpdate", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, [value > 0]);
      return (
        <div>
          <button data-testid="trigger-btn" onClick={() => setValue(value + 1)}>
            Trigger updation
          </button>
          <span data-testid="value">{value.toString()}</span>
          <span data-testid="element">{hasUpdated}</span>
        </div>
      );
    };
  });
  afterEach(cleanup); // <-- add this

  it("should be defined", () => {
    expect(useDidUpdate).toBeDefined();
  });

  it("initializes correctly", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(0);
  });

  it("does not get called on mount", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(0);
  });

  it("gets called if a state value changes", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(parseInt(renderedElement.textContent)).toEqual(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(parseInt(valueElement.textContent)).toEqual(1);
    expect(parseInt(renderedElement.textContent)).toEqual(1);
  });

  it("does not get called if state value has not updated", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(parseInt(renderedElement.textContent)).toEqual(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(parseInt(valueElement.textContent)).toEqual(1);
    expect(parseInt(renderedElement.textContent)).toEqual(1);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(parseInt(valueElement.textContent)).toEqual(2);
    expect(parseInt(renderedElement.textContent)).toEqual(1);
  });
});

describe("useDidUpdate", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, []);
      return (
        <div>
          <button data-testid="trigger-btn" onClick={() => setValue(value + 1)}>
            Trigger updation
          </button>
          <span data-testid="value">{value.toString()}</span>
          <span data-testid="element">{hasUpdated}</span>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("warns if conditionals is empty array", () => {
    const spy = jest.spyOn(global.console, "warn");
    render(<App />);
    expect(spy).toHaveBeenCalled();
  });
});
