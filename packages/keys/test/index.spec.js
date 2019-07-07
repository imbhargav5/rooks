/**
 * @jest-environment jsdom
 */
import React from "react";
import useKeys from "..";
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId
} from "@testing-library/react";

describe("useKeys", () => {
  let App;
  // let firstCallback
  beforeEach(() => {
    // firstCallback = jest.fn()
    App = function () {
      const documentRef = React.useRef(document);
      const inputRef = React.useRef(null);
      const [isEventActive, setIsEventActive] = React.useState(true);
      const [testValue, setTestValue] = React.useState(0);
      const [
        firstCallbackCallCount,
        setFirstCallbackCallCount
      ] = React.useState(0);
      useKeys(
        ["ControlLeft", "s"],
        () => {
          setFirstCallbackCallCount(firstCallbackCallCount + 1);
        },
        {
          target: documentRef,
          when: isEventActive
        }
      );
      useKeys(
        ["m", "r"],
        () => {
          setFirstCallbackCallCount(firstCallbackCallCount + 1);
        },
        {
          when: isEventActive,
          target: inputRef
        }
      );
      return (
        <div data-testid="container">
          <p id="test-id">{testValue}</p>
          <p data-testid="first-callback">{firstCallbackCallCount}</p>
          <button
            data-testid="toggle"
            onClick={() => {
              setIsEventActive(!isEventActive);
            }}
          >
            Toggle event enabled
          </button>
          <div className="grid-container">
            <input
              data-testid="input-dom"
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
    expect(useKeys).toBeDefined();
  });

  it("should trigger the calback when pressed m + r", () => {
    const { container } = render(<App />);
    console.log("container.innerHTML before", container.innerHTML);
    const firstcallbackP = getByTestId(container, "first-callback");
    const InputDom = getByTestId(container, "input-dom");
    act(() => {
      fireEvent.keyDown(InputDom, { key: "m", code: "keyM", charCode: 77 });
    });
    act(() => {
      fireEvent.keyDown(InputDom, { key: "r", code: "keyR", charCode: 82 });
    });

    console.log("TCL: container.innerHTML after", container.innerHTML);
    expect(firstcallbackP.innerHTML).toBe("1");
  });

  it("should trigger the callback when pressed ctrlLeft + s", () => {
    const { container } = render(<App />);

    const firstcallbackP = getByTestId(container, "first-callback");
    // let InputDom = getByTestId(container, "input-dom");
    fireEvent.keyDown(document, {
      key: "Control",
      code: "ControlLeft",
      charCode: 17
    });
    fireEvent.keyDown(document, { key: "s", code: "keyS", charCode: 83 });

    expect(firstcallbackP.innerHTML).toBe("1");
  });

  it("should not trigger whenever 'when ' value is false and trigger whenever'when' value is true", () => {
    const { container } = render(<App />);

    const firstcallbackP = getByTestId(container, "first-callback");
    const ToggleBtn = getByTestId(container, "toggle");
    fireEvent.click(ToggleBtn);

    fireEvent.keyDown(document, {
      key: "Control",
      code: "ControlLeft",
      charCode: 17
    });
    fireEvent.keyDown(document, { key: "s", code: "keyS", charCode: 83 });

    expect(firstcallbackP.innerHTML).toBe("0");

    fireEvent.click(ToggleBtn);

    //now the callback should run
    fireEvent.keyDown(document, {
      key: "Control",
      code: "ControlLeft",
      charCode: 17
    });

    fireEvent.keyDown(document, { key: "s", code: "keyS", charCode: 83 });

    expect(firstcallbackP.innerHTML).toBe("1");
  });
});

// figure out tests
