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
  screen,
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

  afterEach(() => {
    sessionStorage.clear();
    cleanup();
    vi.restoreAllMocks();
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

  it("persists an originating update before broadcasting it", () => {
    expect.hasAssertions();
    const eventName = "rooks-ordered-sessionstorage-sessionstorage-update";
    const observer = vi.fn(() =>
      sessionStorage.getItem("ordered-sessionstorage")
    );
    document.addEventListener(eventName, observer);

    try {
      const { result } = renderHook(() =>
        useSessionstorageState("ordered-sessionstorage", "initial")
      );

      act(() => {
        result.current[1]("next");
      });

      expect(observer).toHaveReturnedWith(JSON.stringify("next"));
    } finally {
      document.removeEventListener(eventName, observer);
    }
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

  it("uses the active key when an older setter reference is invoked", () => {
    expect.hasAssertions();
    sessionStorage.setItem("session-key-a", JSON.stringify("value-a"));
    sessionStorage.setItem("session-key-b", JSON.stringify("value-b"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useSessionstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "session-key-a" } }
    );
    const setterFromFirstRender = result.current[1];

    rerender({ storageKey: "session-key-b" });
    act(() => {
      setterFromFirstRender("updated-b");
    });

    expect(result.current[0]).toBe("updated-b");
    expect(sessionStorage.getItem("session-key-a")).toBe(
      JSON.stringify("value-a")
    );
    expect(sessionStorage.getItem("session-key-b")).toBe(
      JSON.stringify("updated-b")
    );
  });

  it("uses the committed key from a descendant layout effect", () => {
    expect.hasAssertions();
    sessionStorage.setItem(
      "layout-session-key-a",
      JSON.stringify("value-a")
    );
    sessionStorage.setItem(
      "layout-session-key-b",
      JSON.stringify("value-b")
    );

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
      const [value, setValue] = useSessionstorageState(
        storageKey,
        "fallback"
      );

      return (
        <>
          <LayoutWriter enabled={writeInLayout} setValue={setValue} />
          <span data-testid="layout-session-value">{value}</span>
        </>
      );
    };

    const { rerender } = render(
      <Harness storageKey="layout-session-key-a" writeInLayout={false} />
    );
    rerender(
      <Harness storageKey="layout-session-key-b" writeInLayout={true} />
    );

    expect(screen.getByTestId("layout-session-value")).toHaveTextContent(
      "value-b-layout"
    );
    expect(sessionStorage.getItem("layout-session-key-a")).toBe(
      JSON.stringify("value-a")
    );
    expect(sessionStorage.getItem("layout-session-key-b")).toBe(
      JSON.stringify("value-b-layout")
    );
  });

  it("persists a new key after a no-op setter update", () => {
    expect.hasAssertions();
    sessionStorage.setItem("noop-session-key-a", JSON.stringify("same"));

    const { result, rerender } = renderHook(
      ({ storageKey }) => useSessionstorageState(storageKey, "fallback"),
      { initialProps: { storageKey: "noop-session-key-a" } }
    );

    act(() => {
      result.current[1]("same");
    });
    rerender({ storageKey: "noop-session-key-b" });

    expect(result.current[0]).toBe("fallback");
    expect(sessionStorage.getItem("noop-session-key-b")).toBe(
      JSON.stringify("fallback")
    );
  });

  it("composes same-tick updates across synchronized hook instances", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => {
      const first = useSessionstorageState("shared-counter", 0);
      const second = useSessionstorageState("shared-counter", 0);
      return { first, second };
    });

    act(() => {
      result.current.first[1](1);
      result.current.second[1]((current) => current + 1);
    });

    expect(result.current.first[0]).toBe(2);
    expect(result.current.second[0]).toBe(2);
    expect(sessionStorage.getItem("shared-counter")).toBe("2");
  });

  it("keeps in-memory state when sessionStorage access is denied", () => {
    expect.hasAssertions();
    const descriptor = Object.getOwnPropertyDescriptor(window, "sessionStorage");
    const accessError = new DOMException("Access denied", "SecurityError");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get: () => {
        throw accessError;
      },
    });

    try {
      const { result } = renderHook(() =>
        useSessionstorageState("denied-sessionstorage", "fallback")
      );

      expect(result.current[0]).toBe("fallback");
      act(() => {
        result.current[1]("memory-only");
      });
      expect(result.current[0]).toBe("memory-only");
      expect(consoleError).toHaveBeenCalledWith(accessError);
    } finally {
      if (descriptor) {
        Object.defineProperty(window, "sessionStorage", descriptor);
      }
    }
  });


  it("removes the persisted value when set to undefined", () => {
    expect.hasAssertions();
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");
    const { result } = renderHook(() =>
      useSessionstorageState<string | undefined>(
        "undefined-sessionstorage",
        "initial"
      )
    );

    act(() => {
      result.current[1](undefined);
    });

    expect(result.current[0]).toBeUndefined();
    expect(removeItem).toHaveBeenCalledWith("undefined-sessionstorage");
    expect(sessionStorage.getItem("undefined-sessionstorage")).toBeNull();
    removeItem.mockRestore();
  });

});
