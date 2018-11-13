/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import useTimeout from "../src";
import { render, cleanup, fireEvent, wait } from "react-testing-library";
jest.useFakeTimers();

describe("useTimeout", () => {
  it("should be defined", () => {
    expect(useTimeout).toBeDefined();
  });
});

describe("use-timeout base", () => {
  let Component;
  let mockCallback;
  let TIMEOUT_MS = 1000;
  beforeEach(() => {
    Component = function() {
      const [value, setValue] = useState(0);

      mockCallback = jest.fn(() => setValue(3));

      const { start, clear } = useTimeout(mockCallback, TIMEOUT_MS);
      return (
        <div>
          <button data-testid="start-button" onClick={start} />
          <button data-testid="clear-button" onClick={clear} />
          <span data-testid="value">{value}</span>
        </div>
      );
    };
  });
  afterEach(cleanup); // <-- add this

  it("should initially not run timeoutcallback unless start is invoked", () => {
    render(<Component />);
    expect(mockCallback.mock.calls.length).toBe(0);
  });
  it("should run timeoutcallback when start is invoked", async () => {
    const { getByTestId, rerender } = render(<Component />);
    fireEvent.click(getByTestId("start-button"));
    expect(mockCallback.mock.calls.length).toBe(0);
    render(null); // This is needed because of  Some Node React Scheduler issue with flushingEffects
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(mockCallback, TIMEOUT_MS);
  });
});
