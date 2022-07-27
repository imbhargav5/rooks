/**
 * @jest-environment jsdom
 */
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId,
} from "@testing-library/react";
import React from "react";
import { useWillUnmount } from "../hooks/useWillUnmount";

describe("useWillUnmount", () => {
  let App = () => <div />;
  const mockCallback = jest.fn(() => null);
  // let firstCallback
  beforeEach(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const Child = () => {
      useWillUnmount(mockCallback);

      return null;
    };

    // firstCallback = jest.fn()
    App = () => {
      const [isChildVisible, setIsChildVisible] = React.useState(false);
      const [value, setValue] = React.useState(0);
      const toggleIsChildVisible = () => {
        setIsChildVisible(!isChildVisible);
      };

      return (
        <div>
          <p data-testid="value" onClick={() => setValue(value + 1)}>
            {value}
          </p>
          <button
            data-testid="toggle-child"
            onClick={toggleIsChildVisible}
            type="button"
          >
            Toggle child visibility
          </button>
          {isChildVisible && <Child />}
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useWillUnmount).toBeDefined();
  });

  it("should only call the unmount function only when unmount", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const toggleChildElement = getByTestId(
      container as HTMLElement,
      "toggle-child"
    );
    expect(mockCallback.mock.calls).toHaveLength(0);
    act(() => {
      fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls).toHaveLength(0);
    act(() => {
      fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls).toHaveLength(0);
    act(() => {
      fireEvent.click(toggleChildElement);
    });
    expect(mockCallback.mock.calls).toHaveLength(1);
    act(() => {
      fireEvent.click(valueElement);
    });
    expect(mockCallback.mock.calls).toHaveLength(1);
  });
});
