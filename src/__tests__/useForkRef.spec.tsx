import { render, getByTestId, fireEvent } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { useForkRef } from "../hooks/useForkRef";
import { useEventListenerRef } from "../hooks/useEventListenerRef";
import React from "react";

const { act } = TestRenderer;

describe("useForkRef", () => {
  let mockCallback;
  let TestJSX;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = function () {
      const mouseUpRef = useEventListenerRef("mouseup", mockCallback);
      const mouseDownRef = useEventListenerRef("mousedown", mockCallback);
      const ref = useForkRef(mouseUpRef, mouseDownRef);

      return (
        <div data-testid="element" ref={ref}>
          Click me
        </div>
      );
    };
  });

  it("should be defined", () => {
    expect(useForkRef).toBeDefined();
  });

  it("should be called on mouse events", () => {
    const { container } = render(<TestJSX />);
    const displayElement = getByTestId(container as HTMLElement, "element");
    act(() => {
      fireEvent.mouseUp(displayElement);
      fireEvent.mouseDown(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
