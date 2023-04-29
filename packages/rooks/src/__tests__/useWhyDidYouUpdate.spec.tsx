/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  screen,
  render,
  act,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { useWhyDidYouUpdate } from "@/hooks/useWhyDidYouUpdate";
import { waitFor } from "@testing-library/react";
import { useCounter } from "..";

describe("useWhyDidYouUpdate", () => {
  let TestComponent: React.FC<{
    enableLogging?: boolean;
  }>;
  beforeEach(() => {
    jest.spyOn(global.console, "log").mockImplementation(jest.fn);
  });
  beforeEach(() => {
    TestComponent = ({ enableLogging = true }) => {
      const { value, increment } = useCounter(0);
      useWhyDidYouUpdate("TestComponent", { value }, enableLogging);
      return <button onClick={increment}>Increment</button>;
    };
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
    cleanup();
  });

  it("should not log on initial render", () => {
    expect.hasAssertions();

    render(<TestComponent />);

    expect(console.log).not.toHaveBeenCalled();
  });

  it("should log on prop updates", async () => {
    expect.hasAssertions();

    render(<TestComponent />);

    const button = screen.getByRole("button");

    act(() => {
      fireEvent(
        button,
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "[why-did-you-update]",
        "TestComponent",
        { value: { from: 0, to: 1 } }
      );
    });
  });

  it("should not log when enableLogging is false", () => {
    expect.hasAssertions();
    render(<TestComponent enableLogging={false} />);
    const button = screen.getByRole("button");
    act(() => {
      fireEvent(
        button,
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    expect(console.log).not.toHaveBeenCalled();
  });
});
