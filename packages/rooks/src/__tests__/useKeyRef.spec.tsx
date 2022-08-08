/**
 * @jest-environment jsdom
 */
import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId,
} from "@testing-library/react";

import { useKeyRef } from "@/hooks/useKeyRef";

describe("useKeyRef", () => {
  let App = () => <div />;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef(["r"], () => {
        setValue(value + 1);
      });

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
              ref={inputRef}
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useKeyRef).toBeDefined();
  });

  it("should trigger the calback when pressed on document or target", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    act(() => {
      fireEvent.keyDown(window, { charCode: 83, code: "keyS", key: "s" });
    });
    expect(valueElement.innerHTML).toBe("0");
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});

describe("non array input", () => {
  let App = () => <div />;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef("r", () => {
        setValue(value + 1);
      });

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
              ref={inputRef}
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useKeyRef).toBeDefined();
  });

  it("should trigger the calback when pressed on document or target", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});

describe("when", () => {
  let App = () => <div />;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = () => {
      const [when, setWhen] = React.useState(true);

      const toggleWhen = () => {
        setWhen(!when);
      };

      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef(
        ["r"],
        () => {
          setValue(value + 1);
        },
        {
          when,
        }
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button data-testid="toggle-when" onClick={toggleWhen} type="button">
            {" "}
            Toggle when
          </button>
          <div className="grid-container">
            <input
              className="box1"
              data-testid="input"
              ref={inputRef}
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useKeyRef).toBeDefined();
  });

  it("should not trigger whenever 'when ' value is false and trigger when 'when' is true", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    console.log("container.innerHTML before", container.innerHTML);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    const toggleWhenElement = getByTestId(
      container as HTMLElement,
      "toggle-when"
    );
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("1");
    // disable when
    act(() => {
      fireEvent.click(toggleWhenElement);
    });
    expect(valueElement.innerHTML).toBe("1");
    // enable when
    act(() => {
      fireEvent.click(toggleWhenElement);
    });
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("2");
    act(() => {
      fireEvent.keyDown(inputElement, { charCode: 82, code: "keyR", key: "r" });
    });
    expect(valueElement.innerHTML).toBe("3");
  });
});
