/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { useResizeObserverRef } from "../hooks/useResizeObserverRef";

describe("useResizeObserverRef", () => {
  test("should be defined", () => {
    expect.hasAssertions();
    expect(useResizeObserverRef).toBeDefined();
  });
  test("its observer should get called on resize", async () => {
    expect.hasAssertions();
    const observerFn = jest.fn();
    const unObserverFn = jest.fn();
    const disconnetFn = jest.fn();
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: observerFn,
      unobserve: unObserverFn,
      disconnect: disconnetFn,
    }));

    function App() {
      const [value, setValue] = useState(0);
      const [ref] = useResizeObserverRef(() => {
        setValue(1);
      });
      return (
        <div ref={ref} data-testid="value">
          {value}
        </div>
      );
    }

    const { unmount } = render(<App />);
    const valueElement = screen.getByTestId("value");
    expect(valueElement.innerHTML).toBe("0");
    act(() => {
      fireEvent.resize(valueElement);
    });
    await waitFor(() => expect(observerFn).toHaveBeenCalled());
    act(() => {
      unmount();
    });
    await waitFor(() => expect(disconnetFn).toHaveBeenCalled());
    jest.restoreAllMocks();
  });
});
