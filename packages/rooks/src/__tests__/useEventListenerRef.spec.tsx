import React from "react";
import { render, getByTestId, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import TestRenderer from "react-test-renderer";
import { useCounter } from "../hooks/useCounter";
import { useEventListenerRef } from "../hooks/useEventListenerRef";

const { act } = TestRenderer;

describe("useEventListenerRef", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useEventListenerRef).toBeDefined();
  });
  it("should return a callback ref", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useEventListenerRef("click", () => {
        console.log("clicked");
      })
    );

    expect(typeof result.current).toBe("function");
  });
});

describe("useEventListenerRef jsx", () => {
  let mockCallback = () => {};
  let TestJSX = () => <div />;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = () => {
      const ref = useEventListenerRef("click", mockCallback);

      return (
        <div data-testid="element" ref={ref}>
          Click me
        </div>
      );
    };
  });

  it("should not call callback by default", () => {
    expect.hasAssertions();
    render(<TestJSX />);
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it("should not call callback when event fires", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    const displayElement = getByTestId(container as HTMLElement, "element");
    act(() => {
      fireEvent.click(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(displayElement);
      fireEvent.click(displayElement);
      fireEvent.click(displayElement);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});

describe("useEventListenerRef state variables", () => {
  let TestJSX = () => <div />;
  beforeEach(() => {
    TestJSX = () => {
      const { increment, value } = useCounter(0);
      const ref = useEventListenerRef("click", increment);

      return (
        <>
          <div data-testid="element" ref={ref}>
            Click me
          </div>
          <div data-testid="value">{value}</div>
        </>
      );
    };
  });

  it("should not call callback by default", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
  });

  it("should not call callback when event fires", () => {
    expect.hasAssertions();
    const { container } = render(<TestJSX />);
    const displayElement = getByTestId(container as HTMLElement, "element");
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
    act(() => {
      fireEvent.click(displayElement);
      fireEvent.click(displayElement);
      fireEvent.click(displayElement);
    });
    expect(Number.parseInt(valueElement.innerHTML)).toBe(3);
  });
});
