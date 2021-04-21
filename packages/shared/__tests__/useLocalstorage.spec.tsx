/**
 * @jest-environment jsdom
 */
import { render, cleanup, getByTestId, fireEvent, act } from "@testing-library/react";
import React from "react";
import {useLocalstorage} from "../useLocalstorage";

describe("useLocalstorage defined", () => {
  it("should be defined", () => {
    expect(useLocalstorage).toBeDefined();
  });
});

describe("useLocalstorage with object destructuring", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const { value } = useLocalstorage("test-value", "hello");

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

describe("useLocalstorage with array destructuring", () => {
  let App;
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const [currentValue, set, remove] = useLocalstorage("test-value", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{currentValue}</p>
          <button data-testid="new-value"
            onClick={() => {
              set("new value")
            }}
          >Set to new value</button>
          <button data-testid="unset-value"
            onClick={remove}
          >Unset the value</button>
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

  it("setting the new value", () => {
    const { container } = render(<App />);
    const setToNewValueButton = getByTestId(container as HTMLElement, "new-value");
    act(() => {
      fireEvent.click(setToNewValueButton)
    })
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("new value");
  })

  it("unsetting the value", () => {
    const { container } = render(<App />);
    const unsetValueButton = getByTestId(container as HTMLElement, "unset-value");
    act(() => {
      fireEvent.click(unsetValueButton)
    })
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("");
  })
});

// figure out tests
