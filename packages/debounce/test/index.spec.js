/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import useDebounce from "..";
import { render, cleanup, fireEvent, act, wait } from "@testing-library/react";
import "./setupTests";

describe("useDebounce", () => {
  let App;
  const DEBOUNCE_WAIT = 500;
  jest.useRealTimers();
  beforeEach(() => {
    App = function() {
      const [value, setValue] = useState(0);
      function log() {
        setValue(value + 1);
      }

      const debouncedLog = useDebounce(log, DEBOUNCE_WAIT);
      return (
        <div>
          <button data-testid="log-button" onClick={debouncedLog} />
          <span data-testid="value">{value}</span>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useDebounce).toBeDefined();
  });

  it("should run only once if multiple events are fired in the wait period", async () => {
    //jest.useFakeTimers();
    const { getByTestId } = render(<App />);
    const logButtonElement = getByTestId("log-button");
    const valueElement = getByTestId("value");
    act(() => {
      fireEvent.click(logButtonElement);
    });
    //jest.useRealTimers(); //needed for wait
    //TODO: no idea why I need to wait for next tick
    expect(parseInt(valueElement.innerHTML)).toBe(0);
    await wait(
      () => {
        expect(parseInt(valueElement.innerHTML)).toBe(1);
      },
      {
        timeout: DEBOUNCE_WAIT
      }
    );
  });

  it("should run multiple times if waited accordingly", async () => {
    //jest.useFakeTimers();
    const { getByTestId } = render(<App />);
    const logButtonElement = getByTestId("log-button");
    const valueElement = getByTestId("value");
    act(() => {
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
    });
    //needed for wait
    //TODO: no idea why I need to wait for next tick
    expect(parseInt(valueElement.innerHTML)).toBe(0);
    await wait(
      () => {
        expect(parseInt(valueElement.innerHTML)).toBe(1);
      },
      {
        timeout: DEBOUNCE_WAIT
      }
    );
    act(() => {
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
      fireEvent.click(logButtonElement);
    });
    await wait(
      () => {
        expect(parseInt(valueElement.innerHTML)).toBe(2);
      },
      {
        timeout: DEBOUNCE_WAIT
      }
    );
  });
});
