/**
 * @jest-environment jsdom
 */
import { render, cleanup, fireEvent, act, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import {useTimeout} from "../useTimeout";

describe("useTimeout", () => {
  it("should be defined", () => {
    expect(useTimeout).toBeDefined();
  });  
});

describe.skip("use-timeout base", async () => {
  let Component;
  let mockCallback;
  const TIMEOUT_MS = 1_000;
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
    jest.useFakeTimers();
    expect(mockCallback.mock.calls.length).toBe(0);
    jest.useRealTimers(); // needed for wait
  });
  it("should run timeoutcallback when start is invoked", async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<Component />);
    expect(mockCallback.mock.calls.length).toBe(0);
    act(() => {
      fireEvent.click(getByTestId("start-button"));
      jest.runAllTimers();
    });
    jest.useRealTimers(); // needed for wait
    // TODO: no idea why I need to wait for next tick
    waitFor(() => {
      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });
});
