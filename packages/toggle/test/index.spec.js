/**
 * @jest-environment jsdom
 */
import React from "react";
import useToggle from "..";
import { render, cleanup, fireEvent } from "react-testing-library";

describe("useToggle behaviour", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, toggleValue] = useToggle(true);
      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value.toString()}
        </p>
      );
    };
  });
  afterEach(cleanup); // <-- add this
  it("should be defined", () => {
    expect(useToggle).toBeDefined();
  });

  it("sets initial value correctly", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("true");
  });

  it("updates value", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    fireEvent.click(toggleElement);
    expect(toggleElement.innerHTML).toBe("false");
  });
});

describe("useToggle with custom toggle function", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, toggleValue] = useToggle("regina", v =>
        v === "regina" ? "phalange" : "regina"
      );
      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value}
        </p>
      );
    };
  });
  afterEach(cleanup); // <-- add this

  it("should be defined", () => {
    expect(useToggle).toBeDefined();
  });

  it("sets initial value correctly", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("regina");
  });

  it("updates value", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    fireEvent.click(toggleElement);
    expect(toggleElement.innerHTML).toBe("phalange");
  });
});

describe("useToggle with custom toggle function", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, toggleValue] = useToggle();
      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value.toString()}
        </p>
      );
    };
  });
  afterEach(cleanup); // <-- add this
  it("should be false by default", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("false");
  });
});

// figure out tests
