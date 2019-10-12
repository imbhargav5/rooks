/**
 * @jest-environment jsdom
 */
import React from "react";
import useLocalstorage from "..";
import { render, cleanup, getByTestId, fireEvent, act } from "@testing-library/react";

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
    //end
  });

  afterEach(cleanup);

  it("it initializes correctly", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container, "value");
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
    //end
  });

  afterEach(cleanup);

  it("it initializes correctly", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("setting the new value ", () => {
    const { container } = render(<App />);
    const setToNewValueBtn = getByTestId(container, "new-value");
    act(() => {
      fireEvent.click(setToNewValueBtn)
    })
    const valueElement = getByTestId(container, "value");
    expect(valueElement.innerHTML).toBe("new value");
  })

  it("unsetting the value", () => {
    const { container } = render(<App />);
    const unsetValueBtn = getByTestId(container, "unset-value");
    act(() => {
      fireEvent.click(unsetValueBtn)
    })
    const valueElement = getByTestId(container, "value");
    expect(valueElement.innerHTML).toBe("");
  })
});

// figure out tests
