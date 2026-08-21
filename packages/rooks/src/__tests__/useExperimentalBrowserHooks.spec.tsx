import React, { useRef } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { vi } from "vitest";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useIsClient } from "@/hooks/useIsClient";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useScript } from "@/hooks/useScript";
import { useScroll } from "@/hooks/useScroll";
import { useSize } from "@/hooks/useSize";

describe("experimental browser hooks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  describe("useScript", () => {
    it("loads a script and updates its status", async () => {
      expect.hasAssertions();

      const { result } = renderHook(() =>
        useScript("https://cdn.example.com/test.js", {
          id: "test-script",
        })
      );

      const script = document.getElementById("test-script");
      expect(script).toBeInstanceOf(HTMLScriptElement);
      expect(result.current.status).toBe("loading");

      act(() => {
        script?.dispatchEvent(new Event("load"));
      });

      await waitFor(() => {
        expect(result.current.status).toBe("ready");
      });
    });

    it("deduplicates scripts across multiple consumers", () => {
      expect.hasAssertions();

      renderHook(() =>
        useScript("https://cdn.example.com/shared.js", {
          id: "shared-script",
        })
      );
      renderHook(() =>
        useScript("https://cdn.example.com/shared.js", {
          id: "shared-script",
        })
      );

      expect(document.querySelectorAll("#shared-script")).toHaveLength(1);
    });

    it("removes scripts created by the hook on unmount when requested", () => {
      expect.hasAssertions();

      const { unmount } = renderHook(() =>
        useScript("https://cdn.example.com/remove.js", {
          id: "remove-script",
          removeOnUnmount: true,
        })
      );

      expect(document.getElementById("remove-script")).not.toBeNull();
      unmount();
      expect(document.getElementById("remove-script")).toBeNull();
    });

    it("treats pre-existing loaded scripts as ready", () => {
      expect.hasAssertions();
      const originalReadyState = Object.getOwnPropertyDescriptor(
        document,
        "readyState"
      );
      const script = document.createElement("script");
      script.id = "existing-script";
      script.src = "https://cdn.example.com/existing.js";
      document.body.appendChild(script);

      Object.defineProperty(document, "readyState", {
        configurable: true,
        value: "complete",
      });

      const { result } = renderHook(() =>
        useScript("https://cdn.example.com/existing.js", {
          id: "existing-script",
        })
      );

      expect(result.current.status).toBe("ready");
      expect(document.querySelectorAll("#existing-script")).toHaveLength(1);

      if (originalReadyState) {
        Object.defineProperty(document, "readyState", originalReadyState);
      }
    });

    it("creates the script when shouldPreventLoad flips from true to false", () => {
      expect.hasAssertions();

      const { result, rerender } = renderHook(
        ({ shouldPreventLoad }) =>
          useScript("https://cdn.example.com/deferred.js", {
            id: "deferred-script",
            shouldPreventLoad,
          }),
        {
          initialProps: {
            shouldPreventLoad: true,
          },
        }
      );

      expect(document.getElementById("deferred-script")).toBeNull();
      expect(result.current.status).toBe("idle");

      rerender({ shouldPreventLoad: false });

      expect(document.getElementById("deferred-script")).toBeInstanceOf(
        HTMLScriptElement
      );
      expect(result.current.status).toBe("loading");
    });
  });

  describe("useKeyPress", () => {
    it("tracks pressed keys on window", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useKeyPress("a"));

      act(() => {
        fireEvent.keyDown(window, { key: "a" });
      });
      expect(result.current).toBe(true);

      act(() => {
        fireEvent.keyUp(window, { key: "a" });
      });
      expect(result.current).toBe(false);
    });

    it("resets on blur and supports ref targets", async () => {
      expect.hasAssertions();

      function App() {
        const ref = useRef<HTMLDivElement | null>(null);
        const isPressed = useKeyPress("Enter", { target: ref });
        return (
          <div data-testid="target" ref={ref} tabIndex={0}>
            {String(isPressed)}
          </div>
        );
      }

      render(<App />);
      const target = screen.getByTestId("target");

      act(() => {
        fireEvent.keyDown(target, { key: "Enter" });
      });

      await waitFor(() => {
        expect(target.textContent).toBe("true");
      });

      act(() => {
        fireEvent.blur(target);
      });

      await waitFor(() => {
        expect(target.textContent).toBe("false");
      });
    });
  });

  describe("useSize", () => {
    it("measures an element with ResizeObserver", async () => {
      expect.hasAssertions();
      let resizeCallback: ResizeObserverCallback | null = null;

      global.ResizeObserver = vi.fn().mockImplementation(function (
        callback: ResizeObserverCallback
      ) {
        resizeCallback = callback;
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        };
      }) as unknown as typeof ResizeObserver;

      const { result } = renderHook(() => useSize());
      const element = document.createElement("div");

      Object.defineProperty(element, "clientWidth", {
        configurable: true,
        value: 320,
      });
      Object.defineProperty(element, "clientHeight", {
        configurable: true,
        value: 180,
      });

      act(() => {
        result.current[0](element);
      });

      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
      });

      await waitFor(() => {
        expect(result.current[1]).toEqual({
          width: 320,
          height: 180,
        });
      });
    });
  });

  describe("useScroll", () => {
    it("tracks an element scroll position", async () => {
      expect.hasAssertions();

      global.ResizeObserver = vi.fn().mockImplementation(function () {
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        };
      }) as unknown as typeof ResizeObserver;

      const { result } = renderHook(() => useScroll());
      const element = document.createElement("div");

      Object.defineProperty(element, "clientWidth", {
        configurable: true,
        value: 400,
      });
      Object.defineProperty(element, "clientHeight", {
        configurable: true,
        value: 200,
      });
      Object.defineProperty(element, "scrollWidth", {
        configurable: true,
        value: 800,
      });
      Object.defineProperty(element, "scrollHeight", {
        configurable: true,
        value: 600,
      });

      act(() => {
        result.current[0](element);
      });

      act(() => {
        element.scrollLeft = 120;
        element.scrollTop = 40;
        fireEvent.scroll(element);
      });

      await waitFor(() => {
        expect(result.current[1]).toMatchObject({
          scrollLeft: 120,
          scrollTop: 40,
          clientWidth: 400,
          clientHeight: 200,
          scrollWidth: 800,
          scrollHeight: 600,
        });
      });
    });
  });

  describe("useIsClient", () => {
    it("returns true in the browser after mount", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useIsClient());

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe("useBeforeUnload", () => {
    it("prevents unload when the guard passes", () => {
      expect.hasAssertions();

      renderHook(() =>
        useBeforeUnload({
          when: true,
          message: "Unsaved changes",
        })
      );

      const event = new Event("beforeunload", {
        cancelable: true,
      }) as BeforeUnloadEvent;
      Object.defineProperty(event, "returnValue", {
        configurable: true,
        writable: true,
        value: undefined,
      });

      act(() => {
        window.dispatchEvent(event);
      });

      expect(event.defaultPrevented).toBe(true);
      expect(event.returnValue).toBe("Unsaved changes");
    });
  });
});
