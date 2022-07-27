import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act,
} from "@testing-library/react";
import React from "react";
import { useSessionstorage } from "../hooks/useSessionstorage";

/**
 * @jest-environment jsdom
 */

describe("useSessionstorage defined", () => {
  it("should be defined", () => {
    expect(useSessionstorage).toBeDefined();
  });
});

describe("useSessionstorage with object destructuring", () => {
  let App = () => <div />;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const { value } = useSessionstorage("test-value", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("initializes correctly", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });
});

describe("useSessionstorage with array destructuring", () => {
  let App = () => <div />;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const [currentValue] = useSessionstorage("test-value", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{currentValue}</p>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("initializes correctly", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });
});

// figure out tests

describe("useSessionstorage", () => {
  let App = () => <div />;
  beforeEach(() => {
    sessionStorage.clear();
    const SubApp1 = () => {
      const {
        value: titan,
        set,
        remove,
      } = useSessionstorage("titan", "typescript");

      return (
        <div>
          <button
            data-testid="new-value"
            onClick={() => set("javascript")}
            type="button"
          >
            Add
          </button>
          <button
            data-testid="unset-value"
            onClick={() => remove()}
            type="button"
          >
            Remove
          </button>
          <p data-testid="element1">{titan}</p>
        </div>
      );
    };

    const SubApp2 = () => {
      const { value: titan } = useSessionstorage("titan");

      return (
        <div>
          <p data-testid="element2">{String(titan)}</p>
        </div>
      );
    };

    App = () => {
      return (
        <>
          <SubApp1 />
          <SubApp2 />
        </>
      );
    };
  });

  afterEach(cleanup);

  it("setting the new value", () => {
    const { container } = render(<App />);
    const setToNewValueButton = getByTestId(
      container as HTMLElement,
      "new-value"
    );
    act(() => {
      fireEvent.click(setToNewValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, "element1");
    expect(valueElement.innerHTML).toBe("javascript");
  });

  it("unsetting the value", () => {
    const { container } = render(<App />);
    const unsetValueButton = getByTestId(
      container as HTMLElement,
      "unset-value"
    );
    act(() => {
      fireEvent.click(unsetValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, "element1");
    expect(valueElement.innerHTML).toBe("");
  });
});

// figure out tests
