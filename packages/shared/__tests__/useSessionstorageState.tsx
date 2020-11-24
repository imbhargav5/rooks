/**
 * @jest-environment jsdom
 */
import React from "react";
import {useSessionstorageState} from "../useSessionstorageState";
import { render, cleanup, getByTestId, fireEvent, act } from "@testing-library/react";

describe("useSessionstorageState defined", () => {
  it("should be defined", () => {
    expect(useSessionstorageState).toBeDefined();
  });
});


describe("useSessionstorageState basic", () => {
  let App;
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const [value, set, remove] = useSessionstorageState("test-value", "hello");

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
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
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("setting the new value ", () => {
    const { container } = render(<App />);
    const setToNewValueBtn = getByTestId(container as HTMLElement, "new-value");
    act(() => {
      fireEvent.click(setToNewValueBtn)
    })
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("new value");
  })

  it.skip("unsetting the value", () => {
    const { container } = render(<App />);
    const unsetValueBtn = getByTestId(container as HTMLElement, "unset-value");
    act(() => {
      fireEvent.click(unsetValueBtn)
    })
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("");
  })
});

