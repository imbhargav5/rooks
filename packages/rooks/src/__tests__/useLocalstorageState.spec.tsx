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

  it("applies rapid functional updates without losing state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useLocalstorageState("rapid-localstorage", 0)
    );

    act(() => {
      const setValue = result.current[1];
      setValue((current) => current + 1);
      setValue((current) => current + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem("rapid-localstorage")).toBe("2");
  });

  it("persists an originating update before broadcasting it", () => {
    expect.hasAssertions();
    const eventName = "rooks-ordered-localstorage-localstorage-update";
    const observer = vi.fn(() => localStorage.getItem("ordered-localstorage"));
    document.addEventListener(eventName, observer);

    try {
      const { result } = renderHook(() =>
        useLocalstorageState("ordered-localstorage", "initial")
      );

      act(() => {
        result.current[1]("next");
      });

      expect(observer).toHaveReturnedWith(JSON.stringify("next"));
    } finally {
      document.removeEventListener(eventName, observer);
    }
  });

  it("does not write a same-document synchronized value back to storage", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useLocalstorageState("shared-localstorage", "initial")
    );
    vi.mocked(localStorage.setItem).mockClear();

    act(() => {
      document.dispatchEvent(
        new CustomEvent("rooks-shared-localstorage-localstorage-update", {
          detail: { newValue: "external" },
        })
      );
    });

    expect(result.current[0]).toBe("external");
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });


  it("loads the new storage value when the key changes", () => {
    expect.hasAssertions();
    localStorage.setItem("local-key-a", JSON.stringify("value-a"));
    localStorage.setItem("local-key-b", JSON.stringify("value-b"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useLocalstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "local-key-a" } }
    );

    expect(result.current[0]).toBe("value-a");

    rerender({ storageKey: "local-key-b" });

    expect(result.current[0]).toBe("value-b");
    expect(localStorage.getItem("local-key-b")).toBe(
      JSON.stringify("value-b")
    );
  });

  it("uses the active key when an older setter reference is invoked", () => {
    expect.hasAssertions();
    localStorage.setItem("local-key-a", JSON.stringify("value-a"));
    localStorage.setItem("local-key-b", JSON.stringify("value-b"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useLocalstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "local-key-a" } }
    );
    const setterFromFirstRender = result.current[1];

    rerender({ storageKey: "local-key-b" });
    act(() => {
      setterFromFirstRender("updated-b");
    });

    expect(result.current[0]).toBe("updated-b");
    expect(localStorage.getItem("local-key-a")).toBe(
      JSON.stringify("value-a")
    );
    expect(localStorage.getItem("local-key-b")).toBe(
      JSON.stringify("updated-b")
    );
  });

  it("uses the committed key from a descendant layout effect", () => {
    expect.hasAssertions();
    localStorage.setItem("layout-local-key-a", JSON.stringify("value-a"));
    localStorage.setItem("layout-local-key-b", JSON.stringify("value-b"));

    const LayoutWriter = ({
      enabled,
      setValue,
    }: {
      enabled: boolean;
      setValue: React.Dispatch<React.SetStateAction<string>>;
    }) => {
      React.useLayoutEffect(() => {
        if (enabled) {
          setValue((current) => `${current}-layout`);
        }
      }, [enabled, setValue]);

      return null;
    };
    const Harness = ({
      storageKey,
      writeInLayout,
    }: {
      storageKey: string;
      writeInLayout: boolean;
    }) => {
      const [value, setValue] = useLocalstorageState(storageKey, "fallback");

      return (
        <>
          <LayoutWriter enabled={writeInLayout} setValue={setValue} />
          <span data-testid="layout-local-value">{value}</span>
        </>
      );
    };

    const { rerender } = render(
      <Harness storageKey="layout-local-key-a" writeInLayout={false} />
    );
    rerender(
      <Harness storageKey="layout-local-key-b" writeInLayout={true} />
    );

    expect(screen.getByTestId("layout-local-value")).toHaveTextContent(
      "value-b-layout"
    );
    expect(localStorage.getItem("layout-local-key-a")).toBe(
      JSON.stringify("value-a")
    );
    expect(localStorage.getItem("layout-local-key-b")).toBe(
      JSON.stringify("value-b-layout")
    );
  });

  it("persists a new key after a no-op setter update", () => {
    expect.hasAssertions();
    localStorage.setItem("noop-local-key-a", JSON.stringify("same"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useLocalstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "noop-local-key-a" } }
    );

    act(() => {
      result.current[1]("same");
    });
    rerender({ storageKey: "noop-local-key-b" });

    expect(result.current[0]).toBe("fallback");
    expect(localStorage.getItem("noop-local-key-b")).toBe(
      JSON.stringify("fallback")
    );
  });

  it("composes same-tick updates across synchronized hook instances", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const first = useLocalstorageState("shared-counter", 0);
      const second = useLocalstorageState("shared-counter", 0);
      return { first, second };
    });

    act(() => {
      result.current.first[1](1);
      result.current.second[1]((current) => current + 1);
    });

    expect(result.current.first[0]).toBe(2);
    expect(result.current.second[0]).toBe(2);
    expect(localStorage.getItem("shared-counter")).toBe("2");
  });

  it("keeps in-memory state when localStorage access is denied", () => {
    expect.hasAssertions();
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    const accessError = new DOMException("Access denied", "SecurityError");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => {
        throw accessError;
      },
    });

    try {
      const { result } = renderHook(() =>
        useLocalstorageState("denied-localstorage", "fallback")
      );

      expect(result.current[0]).toBe("fallback");
      act(() => {
        result.current[1]("memory-only");
      });
      expect(result.current[0]).toBe("memory-only");
      expect(consoleError).toHaveBeenCalledWith(accessError);
    } finally {
      if (descriptor) {
        Object.defineProperty(window, "localStorage", descriptor);
      }
    }
  });

});
