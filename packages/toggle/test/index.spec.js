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

describe("useToggle with reducer", () => {
  let App;
  let toggleReducer;
  beforeEach(() => {
    toggleReducer = function(state, action) {
      switch (action.type) {
        case "yep":
          return 1;
        case "nope":
          return -1;
        case "maybe":
          return 0;
        default:
          return state;
      }
    };
    App = function() {
      const [value, dispatch] = useToggle(1, toggleReducer);
      return (
        <>
          <p data-testid="toggle-element">{value.toString()}</p>
          <button
            data-testid="yep-button"
            onClick={() => dispatch({ type: "yep" })}
          />
          <button
            data-testid="nope-button"
            onClick={() => dispatch({ type: "nope" })}
          />
          <button
            data-testid="maybe-button"
            onClick={() => dispatch({ type: "maybe" })}
          />
        </>
      );
    };
  });
  afterEach(cleanup); // <-- add this
  it("should be 1 by default", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("1");
  });
  it("should update with dispatched actions", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    const nopeButton = getByTestId("nope-button");
    const maybeButton = getByTestId("maybe-button");
    const yepButton = getByTestId("yep-button");
    fireEvent.click(nopeButton);
    expect(toggleElement.innerHTML).toBe("-1");
    fireEvent.click(maybeButton);
    expect(toggleElement.innerHTML).toBe("0");
    fireEvent.click(yepButton);
    expect(toggleElement.innerHTML).toBe("1");
  });
});

// figure out tests
