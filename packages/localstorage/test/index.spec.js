/**
 * @jest-environment jsdom
 */
import React from "react";
import useLocalstorage from "..";
import { render, cleanup, getByTestId } from "@testing-library/react";

describe("useLocalStorage defined", () => {
  it("should be defined", () => {
    expect(useLocalstorage).toBeDefined();
  });
});

describe("useLocalstorage with object destructuring", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function() {
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
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function() {
      const [currentValue] = useLocalstorage("test-value", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{currentValue}</p>
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

// figure out tests
