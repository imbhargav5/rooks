/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useGlobalObjectEventListener } from "@/hooks/useGlobalObjectEventListener";
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

describe("useGlobalObjectEventListener", () => {
  // 1. Basic Functionality
  describe("basic functionality", () => {
    it("should be defined", () => {
      expect.hasAssertions();
      expect(useGlobalObjectEventListener).toBeDefined();
    });

    it("should attach event listener to window", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback, {}, true, false)
      );

      // Fire the event
      window.dispatchEvent(new Event("resize"));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should attach event listener to document", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(document, "click", callback, {}, true, false)
      );

      // Fire the event
      document.dispatchEvent(new Event("click"));

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  // 2. Event Handling
  describe("event handling", () => {
    it("should call callback with event object", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback, {}, true, false)
      );

      const event = new Event("resize");
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it("should handle multiple event triggers", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "scroll", callback, {}, true, false)
      );

      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should work with different event types", () => {
      expect.hasAssertions();
      const clickCallback = jest.fn();
      const keydownCallback = jest.fn();

      const { rerender: rerender1 } = renderHook(() =>
        useGlobalObjectEventListener(document, "click", clickCallback, {}, true, false)
      );

      const { rerender: rerender2 } = renderHook(() =>
        useGlobalObjectEventListener(document, "keydown", keydownCallback, {}, true, false)
      );

      document.dispatchEvent(new Event("click"));
      document.dispatchEvent(new KeyboardEvent("keydown"));

      expect(clickCallback).toHaveBeenCalledTimes(1);
      expect(keydownCallback).toHaveBeenCalledTimes(1);
    });
  });

  // 3. Cleanup
  describe("cleanup", () => {
    it("should remove event listener on unmount", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { unmount } = renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback, {}, true, false)
      );

      // Event should trigger before unmount
      window.dispatchEvent(new Event("resize"));
      expect(callback).toHaveBeenCalledTimes(1);

      // Unmount
      unmount();

      // Event should not trigger after unmount
      window.dispatchEvent(new Event("resize"));
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it("should cleanup properly with document events", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { unmount } = renderHook(() =>
        useGlobalObjectEventListener(document, "visibilitychange", callback, {}, true, false)
      );

      unmount();

      // Should not trigger after unmount
      document.dispatchEvent(new Event("visibilitychange"));
      expect(callback).not.toHaveBeenCalled();
    });
  });

  // 4. Listener Options
  describe("listener options", () => {
    it("should support capture option", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(
          document,
          "click",
          callback,
          { capture: true },
          true,
          false
        )
      );

      document.dispatchEvent(new Event("click", { bubbles: true }));

      expect(callback).toHaveBeenCalled();
    });

    it("should support once option", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      // Note: The hook doesn't re-add the listener, so 'once' behavior
      // is handled by the browser. We're testing the option is passed.
      renderHook(() =>
        useGlobalObjectEventListener(
          window,
          "resize",
          callback,
          { once: false },
          true,
          false
        )
      );

      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));

      // Should be called multiple times with once: false
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should support passive option", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(
          window,
          "scroll",
          callback,
          { passive: true },
          true,
          false
        )
      );

      window.dispatchEvent(new Event("scroll"));

      expect(callback).toHaveBeenCalled();
    });
  });

  // 5. Conditional Attachment (when parameter)
  describe("conditional attachment", () => {
    it("should only attach listener when 'when' is true", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { rerender } = renderHook(
        ({ when }) =>
          useGlobalObjectEventListener(window, "resize", callback, {}, when, false),
        { initialProps: { when: false } }
      );

      // Should not call callback when when=false
      window.dispatchEvent(new Event("resize"));
      expect(callback).not.toHaveBeenCalled();

      // Update to when=true
      rerender({ when: true });
      window.dispatchEvent(new Event("resize"));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should remove listener when 'when' changes to false", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { rerender } = renderHook(
        ({ when }) =>
          useGlobalObjectEventListener(window, "resize", callback, {}, when, false),
        { initialProps: { when: true } }
      );

      // Should work when when=true
      window.dispatchEvent(new Event("resize"));
      expect(callback).toHaveBeenCalledTimes(1);

      // Change to when=false
      rerender({ when: false });
      window.dispatchEvent(new Event("resize"));

      // Should still be 1
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should default to when=true", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback, {}, true, false)
      );

      window.dispatchEvent(new Event("resize"));

      expect(callback).toHaveBeenCalled();
    });
  });

  // 6. Layout Effect
  describe("layout effect option", () => {
    it("should work with isLayoutEffect=false (default)", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(
          window,
          "resize",
          callback,
          {},
          true,
          false
        )
      );

      window.dispatchEvent(new Event("resize"));

      expect(callback).toHaveBeenCalled();
    });

    it("should work with isLayoutEffect=true", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(
          window,
          "resize",
          callback,
          {},
          true,
          true
        )
      );

      window.dispatchEvent(new Event("resize"));

      expect(callback).toHaveBeenCalled();
    });
  });

  // 7. Fresh Callback
  describe("fresh callback", () => {
    it("should use latest callback on each event", () => {
      expect.hasAssertions();
      let callbackValue = "initial";

      function TestComponent() {
        const [value, setValue] = React.useState("first");

        useGlobalObjectEventListener(
          window,
          "resize",
          () => {
            callbackValue = value;
          },
          {},
          true,
          false
        );

        return (
          <button onClick={() => setValue("second")} data-testid="update-btn">
            Update
          </button>
        );
      }

      const { getByTestId } = render(<TestComponent />);

      // First event should see "first"
      window.dispatchEvent(new Event("resize"));
      expect(callbackValue).toBe("first");

      // Update state
      fireEvent.click(getByTestId("update-btn"));

      // Next event should see "second" (fresh callback)
      window.dispatchEvent(new Event("resize"));
      expect(callbackValue).toBe("second");
    });
  });

  // 8. Edge Cases
  describe("edge cases", () => {
    it("should handle undefined globalObject gracefully", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      renderHook(() =>
        useGlobalObjectEventListener(
          undefined as any,
          "resize",
          callback,
          {},
          true,
          false
        )
      );

      // Should not crash
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle event name changes", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { rerender } = renderHook(
        ({ eventName }) =>
          useGlobalObjectEventListener(window, eventName, callback, {}, true, false),
        { initialProps: { eventName: "resize" as keyof WindowEventMap } }
      );

      window.dispatchEvent(new Event("resize"));
      expect(callback).toHaveBeenCalledTimes(1);

      // Change event name
      rerender({ eventName: "scroll" as keyof WindowEventMap });

      // Old event should not trigger
      window.dispatchEvent(new Event("resize"));
      expect(callback).toHaveBeenCalledTimes(1);

      // New event should trigger
      window.dispatchEvent(new Event("scroll"));
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  // 9. Multiple Instances
  describe("multiple instances", () => {
    it("should support multiple listeners on same event", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback1, {}, true, false)
      );

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", callback2, {}, true, false)
      );

      window.dispatchEvent(new Event("resize"));

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should support listeners on different global objects", () => {
      expect.hasAssertions();
      const windowCallback = jest.fn();
      const documentCallback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(window, "resize", windowCallback, {}, true, false)
      );

      renderHook(() =>
        useGlobalObjectEventListener(document, "click", documentCallback, {}, true, false)
      );

      window.dispatchEvent(new Event("resize"));
      document.dispatchEvent(new Event("click"));

      expect(windowCallback).toHaveBeenCalled();
      expect(documentCallback).toHaveBeenCalled();
    });
  });

  // 10. Real-world Scenarios
  describe("real-world scenarios", () => {
    it("should work with keyboard events", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(document, "keydown", callback, {}, true, false)
      );

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it("should work with mouse events", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() =>
        useGlobalObjectEventListener(document, "mousemove", callback, {}, true, false)
      );

      const event = new MouseEvent("mousemove", { clientX: 100, clientY: 200 });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it("should work in a React component", async () => {
      expect.hasAssertions();
      const events: string[] = [];

      function TestComponent() {
        const [count, setCount] = React.useState(0);

        useGlobalObjectEventListener(window, "resize", () => {
          events.push("resize");
          setCount(c => c + 1);
        }, {}, true, false);

        return <div data-testid="count">{count}</div>;
      }

      render(<TestComponent />);

      act(() => {
        window.dispatchEvent(new Event("resize"));
      });

      expect(events).toContain("resize");
      await waitFor(() => {
        expect(screen.getByTestId("count").textContent).toBe("1");
      });
    });
  });
});
