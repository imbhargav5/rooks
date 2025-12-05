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
  waitFor,
  screen,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import { useLocalstorageState } from "@/hooks/useLocalstorageState";

describe("useLocalstorageState defined", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useLocalstorageState).toBeDefined();
  });
});

describe("useLocalstorageState basic", () => {
  let App = () => <div />;
  beforeEach(() => {
    // firstCallback = vi.fn()
    App = () => {
      const [value, set, remove] = useLocalstorageState("test-value", "hello");

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

  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  it("memo", () => {
    expect.hasAssertions();
    const { result, rerender } = renderHook(() =>
      useLocalstorageState("key1", "value")
    );
    // test memo
    const setBeforeRerender = result.current[1];
    const removeBeforeRerender = result.current[2];
    rerender();
    const setAfterRerender = result.current[1];
    const removeAfterRerender = result.current[2];
    expect(setBeforeRerender).toBe(setAfterRerender);
    expect(removeBeforeRerender).toBe(removeAfterRerender);
    act(() => {
      setBeforeRerender("next value");
    });
    const setAfterSet = result.current[1];
    const removeAfterSet = result.current[2];
    expect(setBeforeRerender).toBe(setAfterSet);
    expect(removeBeforeRerender).toBe(removeAfterSet);
    act(() => {
      removeBeforeRerender();
    });
    const setAfterRemove = result.current[1];
    const removeAfterRemove = result.current[2];
    expect(setBeforeRerender).toBe(setAfterRemove);
    expect(removeBeforeRerender).toBe(removeAfterRemove);
  });

  it("initializes correctly", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const valueElement = getByTestId(container as HTMLElement, "value");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("initializes correctly with a function initializer", () => {
    expect.hasAssertions();

    const AppWithFunctionInitializer = () => {
      const [value] = useLocalstorageState(
        "test-value-function",
        () => "hello"
      );

      return <p data-testid="value-function">{value}</p>;
    };

    const { getByTestId } = render(<AppWithFunctionInitializer />);
    const valueElement = getByTestId("value-function");
    expect(valueElement.innerHTML).toBe("hello");
  });

  it("setting the new value", async () => {
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
    await waitFor(() => expect(valueElement.innerHTML).toBe("new value"));
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("unsetting the value", async () => {
    expect.hasAssertions();
    render(<App />);
    const unsetValueButton = screen.getByTestId("unset-value");
    const valueElement = screen.getByTestId("value");
    expect(valueElement.innerHTML).toBe("hello");
    act(() => {
      fireEvent.click(unsetValueButton);
    });
    await waitFor(() => expect(valueElement.innerHTML).toBe(""));
  });
});

describe("useLocalstorageState localStorage", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "removeItem");
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("reads value from localStorage", () => {
    expect.hasAssertions();

    localStorage.setItem(
      "test-value-localstorage",
      JSON.stringify("hello-from-localstorage")
    );

    const { result } = renderHook(() =>
      useLocalstorageState("test-value-localstorage")
    );

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith(
      "test-value-localstorage"
    );
    expect(result.current[0]).toBe("hello-from-localstorage");
  });

  it("writes value to localStorage", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useLocalstorageState("test-value-localstorage", "initial-value")
    );

    const [, setValue] = result.current;

    act(() => {
      setValue("new-value");
    });

    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-value-localstorage",
      JSON.stringify("new-value")
    );
  });

  it("writes value to localStorage using a function setter as well", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useLocalstorageState("test-value-localstorage", () => "initial-value")
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(() => "new-value");
    });

    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-value-localstorage",
      JSON.stringify("new-value")
    );
  });

  it("do not writes undefined value to localStorage", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useLocalstorageState<string | undefined>(
        "test-value-localstorage",
        undefined
      )
    );

    expect(localStorage.getItem).toHaveBeenCalledWith(
      "test-value-localstorage"
    );
    expect(result.current[0]).toBeUndefined();

    const [, setValue] = result.current;

    act(() => {
      setValue("new-value");
    });

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe("new-value");
  });

  it("setValue(undefined) should be remove from localStorage", () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useLocalstorageState("test-value-localstorage")
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(undefined);
    });

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith(
      "test-value-localstorage"
    );
    expect(result.current[0]).toBeUndefined();
  });
});
