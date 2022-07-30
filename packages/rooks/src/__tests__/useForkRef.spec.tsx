import React from "react";
import { render, getByTestId, fireEvent } from "@testing-library/react";

import TestRenderer from "react-test-renderer";
import { useEventListenerRef } from "../hooks/useEventListenerRef";
import { useForkRef } from "../hooks/useForkRef";

const { act } = TestRenderer;

describe("useForkRef", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let mockCallback = () => {};
  let TestJSX = () => <div />;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = () => {
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
