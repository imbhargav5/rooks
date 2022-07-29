/**
 * @jest-environment jsdom
 */
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import React, { useState } from "react";
import { useDidUpdate } from "../hooks/useDidUpdate";

describe("useDidUpdate", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let App = () => <div />;
  beforeEach(() => {
    App = () => {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, [value > 0]);

      return (
        <div>
          <button
            data-testid="trigger-btn"
            onClick={() => setValue(value + 1)}
            type="button"
          >
            Trigger update
          </button>
          <span data-testid="value">{value.toString()}</span>
          <span data-testid="element">{hasUpdated}</span>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useDidUpdate).toBeDefined();
  });

  it("initializes correctly", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(0);
  });

  it("does not get called on mount", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(0);
  });

  it("gets called if a state value changes", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toBe(1);
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(1);
  });

  it("does not get called if state value has not updated", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    const valueElement = getByTestId("value");
    const triggerElement = getByTestId("trigger-btn");
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(0);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toBe(1);
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(1);
    act(() => {
      fireEvent.click(triggerElement);
    });
    expect(Number.parseInt(String(valueElement.textContent))).toBe(2);
    expect(Number.parseInt(String(renderedElement.textContent))).toBe(1);
  });
});

describe("useDidUpdate tests", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let App = () => <div />;
  beforeEach(() => {
    App = () => {
      const [value, setValue] = useState(0);
      const [hasUpdated, setHasUpdated] = useState(0);
      useDidUpdate(() => {
        setHasUpdated(hasUpdated + 1);
      }, []);

      return (
        <div>
          <button
            data-testid="trigger-btn"
            onClick={() => setValue(value + 1)}
            type="button"
          >
            Trigger update
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
    // eslint-disable-next-line jest/prefer-called-with
    expect(spy).toHaveBeenCalled();
  });
});
