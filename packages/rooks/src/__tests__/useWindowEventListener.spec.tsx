import React from "react";
import { render, getByTestId, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import TestRenderer from "react-test-renderer";
import { useCounter } from "../hooks/useCounter";
import { useWindowEventListener } from "../hooks/useWindowEventListener";

const { act } = TestRenderer;

describe("useWindowEventListener", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWindowEventListener).toBeDefined();
  });
  it("should return a undefined", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useWindowEventListener("click", () => {
        console.log("clicked");
      })
    );

    expect(typeof result.current).toBe("undefined");
  });
});

describe("useWindowEventListener jsx", () => {
  let mockCallback = () => {};
  let TestJSX = () => null;
  beforeEach(() => {
    mockCallback = jest.fn(() => {});
    TestJSX = () => {
      useWindowEventListener("click", mockCallback);

      return null;
    };
  });

  it("should not call callback by default", () => {
    expect.hasAssertions();
    render(<TestJSX />);
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it("should not call callback when event fires", () => {
    expect.hasAssertions();
    render(<TestJSX />);
    act(() => {
      fireEvent.click(window);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(window);
      fireEvent.click(window);
      fireEvent.click(window);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});

describe("useWindowEventListener state variables", () => {
  let TestJSX = () => <div />;
  beforeEach(() => {
    TestJSX = () => {
      const { increment, value } = useCounter(0);
      useWindowEventListener("click", increment);

      return <div data-testid="value">{value}</div>;
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
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(Number.parseInt(valueElement.innerHTML)).toBe(0);
    act(() => {
      fireEvent.click(window);
      fireEvent.click(window);
      fireEvent.click(window);
    });
    expect(Number.parseInt(valueElement.innerHTML)).toBe(3);
  });
});
