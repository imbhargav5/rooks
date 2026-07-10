import { vi } from "vitest";
/**
 */
import React from "react";
import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act,
  renderHook,
} from "@testing-library/react";

import { useSessionstorageState } from "@/hooks/useSessionstorageState";

describe("useSessionstorageState defined", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSessionstorageState).toBeDefined();
  });
});

describe("useSessionstorageState basic", () => {
  let App = () => <div />;
  beforeEach(() => {
    // firstCallback = vi.fn()
    App = () => {
      const [value, set, remove] = useSessionstorageState(
        "test-value",
        "hello"
      );

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button
            data-testid="new-value"
            onClick={() => {
              set("new value");
            }}
            type="button"
          >
            Set to new value
          </button>
          <button data-testid="unset-value" onClick={remove} type="button">
            Unset the value
          </button>
        </div>
      );
    };
    // end
  });

  afterEach(cleanup);

  it("initializes correctly", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("initializes correctly with a function initializer", () => {
    expect.hasAssertions();

    const AppWithFunctionInitializer = () => {
      const [value] = useSessionstorageState(
        "test-value-function",
        () => "hello"
      );

      return <p data-testid="value-function">{value}</p>;
    };

    const { getByTestId } = render(<AppWithFunctionInitializer />);
    const valueElement = getByTestId("value-function");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("setting the new value", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const setToNewValueButton = getByTestId(
      container as HTMLElement,
      "new-value"
    );
    act(() => {
      fireEvent.click(setToNewValueButton);
    });
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("new value");
  });

  it("applies rapid functional updates without losing state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSessionstorageState("rapid-sessionstorage", 0)
    );

    act(() => {
      const setValue = result.current[1];
      setValue((current) => current + 1);
      setValue((current) => current + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(sessionStorage.getItem("rapid-sessionstorage")).toBe("2");
  });

  it("keeps the setter stable after state updates", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSessionstorageState("stable-sessionstorage", 0)
    );
    const setValue = result.current[1];

    act(() => {
      setValue(1);
    });

    expect(result.current[1]).toBe(setValue);
  });

  it("does not write a same-document synchronized value back to storage", () => {
    expect.hasAssertions();
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() =>
      useSessionstorageState("shared-sessionstorage", "initial")
    );
    setItem.mockClear();

    act(() => {
      document.dispatchEvent(
        new CustomEvent("rooks-shared-sessionstorage-sessionstorage-update", {
          detail: { newValue: "external" },
        })
      );
    });

    expect(result.current[0]).toBe("external");
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });


  it("loads the new storage value when the key changes", () => {
    expect.hasAssertions();
    sessionStorage.setItem("session-key-a", JSON.stringify("value-a"));
    sessionStorage.setItem("session-key-b", JSON.stringify("value-b"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useSessionstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "session-key-a" } }
    );

    expect(result.current[0]).toBe("value-a");

    rerender({ storageKey: "session-key-b" });

    expect(result.current[0]).toBe("value-b");
    expect(sessionStorage.getItem("session-key-b")).toBe(
      JSON.stringify("value-b")
    );
  });

});
