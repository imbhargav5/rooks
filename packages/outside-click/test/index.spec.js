/**
 * @jest-environment jsdom
 */
import React, { useState, useRef } from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import useOutsideClick from "..";

function TestComponent() {
  const [count, setCount] = useState(0);
  const [when, setWhen] = useState(true);
  const [listenMouseDown, setListenMouseDown] = useState(false);
  const ref = useRef();

  useOutsideClick(
    ref,
    () => setCount(count + 1),
    when,
    listenMouseDown
  );

  return (
    <div>
      <p>Outside</p>
      <div ref={ref} data-testid="target">
        <span>Inside Target</span>
        <button onClick={() => setWhen(!when)}>Toggle when</button>
        <button onClick={() => setListenMouseDown(!listenMouseDown)}>
          Toggle listenMouseDown
        </button>
      </div>
      <p data-testid="counter">{count}</p>
    </div>
  );
}


describe("useOutsideClick", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useOutsideClick).toBeDefined();
  });

  it("doesn't execute callback on click on target element", () => {
    const { getByTestId } = render(<TestComponent />);
    const target = getByTestId("target");
    const counter = getByTestId("counter");

    fireEvent.click(target);
    expect(counter.textContent).toBe("0");
  });

  it("doesn't execute callback on click inside target element", () => {
    const { getByText, getByTestId } = render(<TestComponent />);
    const target = getByText("Inside Target");
    const counter = getByTestId("counter");

    fireEvent.click(target);
    expect(counter.textContent).toBe("0");
  });

  it("executes callback on click outside of target element", () => {
    const { getByText, getByTestId } = render(<TestComponent />);
    const outside = getByText("Outside");
    const counter = getByTestId("counter");

    fireEvent.click(outside);
    expect(counter.textContent).toBe("1");
  });

  it("executes callback on click outside only if `when` is `true`", () => {
    const { getByText, getByTestId } = render(<TestComponent />);
    const outside = getByText("Outside");
    const togglerWhen = getByText("Toggle when");
    const counter = getByTestId("counter");

    // `count` is updated on click if `when` is `true` (default)
    fireEvent.click(outside);
    expect(counter.textContent).toBe("1");

    // Set `when` to `false` and check that `count` is not updated on click
    fireEvent.click(togglerWhen);
    fireEvent.click(outside);
    fireEvent.click(outside);
    expect(counter.textContent).toBe("1");

    // Set `when` to `true` and check that `count` is updated on click
    fireEvent.click(togglerWhen);
    fireEvent.click(outside);
    expect(counter.textContent).toBe("2");
  });

  it("executes callback on mousedown outside only if `listenMouseDown` is `true`", () => {
    const { getByText, getByTestId } = render(<TestComponent />);
    const outside = getByText("Outside");
    const togglerEvent = getByText("Toggle listenMouseDown");
    const counter = getByTestId("counter");

    // `count` is not updated on mousedown if `listenMouseDown` is `false` (default)
    fireEvent.mouseDown(outside);
    expect(counter.textContent).toBe("0");

    // Set `listenMouseDown` to `true` and check that `count` is updated on mousedown
    fireEvent.click(togglerEvent);
    fireEvent.mouseDown(outside);
    fireEvent.mouseDown(outside);
    expect(counter.textContent).toBe("2");

    // Set `listenMouseDown` to `false` and check that `count` is not updated on click
    fireEvent.click(togglerEvent);
    fireEvent.mouseDown(outside);
    expect(counter.textContent).toBe("2");
  });
});
