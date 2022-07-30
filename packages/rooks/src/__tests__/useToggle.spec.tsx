/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import { useToggle } from "../hooks/useToggle";

describe("useToggle basic behavior", () => {
  let App = () => <p />;
  beforeEach(() => {
    App = () => {
      const [value, toggleValue] = useToggle(true);

      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value.toString()}
        </p>
      );
    };
  });
  afterEach(cleanup);
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

describe("useToggle with custom toggle function and with strings", () => {
  let App = () => <p />;
  beforeEach(() => {
    App = () => {
      // eslint-disable-next-line no-confusing-arrow
      const [value, toggleValue] = useToggle("regina", (_value) =>
        _value === "regina" ? "phalange" : "regina"
      );

      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value}
        </p>
      );
    };
  });
  afterEach(cleanup);

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

describe("useToggle with custom toggle function false by default", () => {
  let App = () => <p />;
  beforeEach(() => {
    App = () => {
      const [value, toggleValue] = useToggle();

      return (
        <p data-testid="toggle-element" onClick={toggleValue}>
          {value.toString()}
        </p>
      );
    };
  });
  afterEach(cleanup);
  it("should be false by default", () => {
    const { getByTestId } = render(<App />);
    const toggleElement = getByTestId("toggle-element");
    expect(toggleElement.innerHTML).toBe("false");
  });
});

describe("useToggle with reducer", () => {
  let App = () => <div />;
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let toggleReducer = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _state: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: {
      type: string;
    }
    // eslint-disable-next-line unicorn/consistent-function-scoping
  ) => 5;
  beforeEach(() => {
    toggleReducer = function (
      state: number,
      action: {
        type: string;
      }
    ): number {
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

    App = () => {
      const [value, dispatch] = useToggle(1, toggleReducer);

      return (
        <div>
          <p data-testid="toggle-element">{value.toString()}</p>
          <button
            data-testid="yep-button"
            onClick={() => dispatch({ type: "yep" })}
            type="button"
          />
          <button
            data-testid="nope-button"
            onClick={() => dispatch({ type: "nope" })}
            type="button"
          />
          <button
            data-testid="maybe-button"
            onClick={() => dispatch({ type: "maybe" })}
            type="button"
          />
        </div>
      );
    };
  });
  afterEach(cleanup);
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
