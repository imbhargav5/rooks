/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act,
} from "@testing-library/react";

import { useSessionstorageState } from "@/hooks/useSessionstorageState";

describe("useSessionstorageState defined", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSessionstorageState).toBeDefined();
  });
});

describe("useSessionstorageState basic", () => {
  let App = () => <div />;
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const [value, set, remove] = useSessionstorageState(
        "test-value",
        "hello"
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button
            data-testid="new-value"
            onClick={() => {
              set("new value");
            }}
            type="button"
          >
            Set to new value
          </button>
          <button data-testid="unset-value" onClick={remove} type="button">
            Unset the value
          </button>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("initializes correctly", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("setting the new value", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const setToNewValueButton = getByTestId(
      container as HTMLElement,
      "new-value"
    );
    act(() => {
      fireEvent.click(setToNewValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("new value");
  });
});
