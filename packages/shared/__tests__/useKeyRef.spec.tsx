/**
 * @jest-environment jsdom
 */
import React from "react";
import {useKeyRef} from "../useKeyRef";

import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId
} from "@testing-library/react";

describe("useKeyRef", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function() {
      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef(
        ["r"],
        () => {
          setValue(value + 1);
        }    
      );
      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              data-testid="input"
              ref={inputRef}
              className="box1"
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    //end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useKeyRef).toBeDefined();
  });

  it("should trigger the calback when pressed on document or target", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    act(() => {
      fireEvent.keyDown(window, { key: "s", code: "keyS", charCode: 83 });
    });
    expect(valueElement.innerHTML).toBe("0");
    act(() => {
      fireEvent.keyDown(inputElement, { key: "r", code: "keyR", charCode: 82 });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});

describe("non array input", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function() {
      
      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef(
        "r",
        () => {
          setValue(value + 1);
        }
      );
      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <div className="grid-container">
            <input
              data-testid="input"
              ref={inputRef}
              className="box1"
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    //end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useKeyRef).toBeDefined();
  });

  it("should trigger the calback when pressed on document or target", () => {
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    act(() => {
      fireEvent.keyDown(inputElement, { key: "r", code: "keyR", charCode: 82 });
    });
    expect(valueElement.innerHTML).toBe("1");
  });
});

describe("when", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function() {
      
      const [when, setWhen] = React.useState(true);

      function toggleWhen() {
        setWhen(!when);
      }
      const [value, setValue] = React.useState(0);
      const inputRef = useKeyRef(
        ["r"],
        () => {
          setValue(value + 1);
        },
        {
          when
        }
      );
      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button data-testid="toggle-when" onClick={toggleWhen}>
            {" "}
            Toggle when
          </button>
          <div className="grid-container">
            <input
              data-testid="input"
              ref={inputRef}
              className="box1"
              tabIndex={1}
            />
          </div>
        </div>
      );
    };
    //end
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect(useKeyRef).toBeDefined();
  });

  it("should not trigger whenever 'when ' value is false and trigger when 'when' is true", () => {
    const { container } = render(<App />);
    console.log("container.innerHTML before", container.innerHTML);
    const valueElement = getByTestId(container as HTMLElement, "value");
    const inputElement = getByTestId(container as HTMLElement, "input");
    const toggleWhenElement = getByTestId(container as HTMLElement, "toggle-when");
    act(() => {
      fireEvent.keyDown(inputElement, { key: "r", code: "keyR", charCode: 82 });
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
      fireEvent.keyDown(inputElement, { key: "r", code: "keyR", charCode: 82 });
    });
    expect(valueElement.innerHTML).toBe("2");
    act(() => {
      fireEvent.keyDown(inputElement, { key: "r", code: "keyR", charCode: 82 });
    });
    expect(valueElement.innerHTML).toBe("3");
  });
});
