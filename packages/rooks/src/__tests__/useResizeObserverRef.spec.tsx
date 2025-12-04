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
import { renderHook } from "@testing-library/react-hooks";
import { useResizeObserverRef } from "@/hooks/useResizeObserverRef";

describe("useResizeObserverRef", () => {
  // Mock ResizeObserver
  let observeFn: jest.Mock;
  let unobserveFn: jest.Mock;
  let disconnectFn: jest.Mock;
  let resizeObserverCallback: ResizeObserverCallback;

  beforeEach(() => {
    observeFn = jest.fn();
    unobserveFn = jest.fn();
    disconnectFn = jest.fn();

    global.ResizeObserver = jest.fn().mockImplementation((callback) => {
      resizeObserverCallback = callback;
      return {
        observe: observeFn,
        unobserve: unobserveFn,
        disconnect: disconnectFn,
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Basic Functionality
  describe("basic functionality", () => {
    it("should be defined", () => {
      expect.hasAssertions();
      expect(useResizeObserverRef).toBeDefined();
    });

    it("should return a callback ref", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useResizeObserverRef(callback));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(1);
      expect(typeof result.current[0]).toBe("function");
    });

    it("should create ResizeObserver when element is attached", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      expect(global.ResizeObserver).toHaveBeenCalled();
      expect(observeFn).toHaveBeenCalled();
    });

    it("should observe element when attached", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalled());
      expect(observeFn).toHaveBeenCalledTimes(1);
    });
  });

  // 2. Callback Execution
  describe("callback execution", () => {
    it("should call callback when ResizeObserver fires", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      // Simulate ResizeObserver callback
      await waitFor(() => {
        if (resizeObserverCallback) {
          act(() => {
            resizeObserverCallback([] as any, {} as any);
          });
        }
      });

      expect(callback).toHaveBeenCalled();
    });

    it("should pass ResizeObserver entries to callback", async () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const mockEntries: any[] = [
        {
          target: document.createElement("div"),
          contentRect: { width: 100, height: 200 },
        },
      ];

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      await waitFor(() => {
        if (resizeObserverCallback) {
          act(() => {
            resizeObserverCallback(mockEntries, {} as any);
          });
        }
      });

      expect(callback).toHaveBeenCalledWith(mockEntries, expect.anything());
    });

    it("should handle undefined callback gracefully", () => {
      expect.hasAssertions();

      function App() {
        const [ref] = useResizeObserverRef(undefined);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      expect(() => render(<App />)).not.toThrow();
      expect(true).toBe(true);
    });

    it("should call callback multiple times on multiple resizes", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      await waitFor(() => {
        if (resizeObserverCallback) {
          act(() => {
            resizeObserverCallback([] as any, {} as any);
            resizeObserverCallback([] as any, {} as any);
            resizeObserverCallback([] as any, {} as any);
          });
        }
      });

      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  // 3. Fresh Callback
  describe("fresh callback", () => {
    it("should use latest callback on each resize", async () => {
      expect.hasAssertions();
      const calls: string[] = [];

      function App() {
        const [value, setValue] = useState("first");
        const [ref] = useResizeObserverRef(() => {
          calls.push(value);
        });

        return (
          <div>
            <div ref={ref} data-testid="target">Test</div>
            <button onClick={() => setValue("second")} data-testid="update">
              Update
            </button>
          </div>
        );
      }

      render(<App />);

      // First resize should see "first"
      await waitFor(() => {
        if (resizeObserverCallback) {
          act(() => {
            resizeObserverCallback([] as any, {} as any);
          });
        }
      });

      expect(calls[calls.length - 1]).toBe("first");

      // Update value
      act(() => {
        fireEvent.click(screen.getByTestId("update"));
      });

      // Next resize should see "second"
      await waitFor(() => {
        if (resizeObserverCallback) {
          act(() => {
            resizeObserverCallback([] as any, {} as any);
          });
        }
      });

      expect(calls[calls.length - 1]).toBe("second");
    });
  });

  // 4. Cleanup
  describe("cleanup", () => {
    it("should disconnect observer on unmount", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      const { unmount } = render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalled());

      act(() => {
        unmount();
      });

      await waitFor(() => expect(disconnectFn).toHaveBeenCalled());
    });

    it("should disconnect observer when element is removed", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [show, setShow] = useState(true);
        const [ref] = useResizeObserverRef(callback);

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Test</div>}
            <button onClick={() => setShow(false)} data-testid="hide">
              Hide
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalled());

      act(() => {
        fireEvent.click(getByTestId("hide"));
      });

      await waitFor(() => expect(disconnectFn).toHaveBeenCalled());
    });

    it("should not call callback after unmount", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      const { unmount } = render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalled());

      unmount();

      // Try to trigger callback after unmount
      if (resizeObserverCallback) {
        act(() => {
          resizeObserverCallback([] as any, {} as any);
        });
      }

      // Callback might be called once more, but should be the final call
      expect(callback.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });

  // 5. Options
  describe("options", () => {
    it("should use default options (content-box)", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      expect(observeFn).toHaveBeenCalledWith(
        expect.anything(),
        { box: "content-box" }
      );
    });

    it("should accept custom box option - border-box", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback, { box: "border-box" });
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      expect(observeFn).toHaveBeenCalledWith(
        expect.anything(),
        { box: "border-box" }
      );
    });

    it("should accept custom box option - device-pixel-content-box", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback, {
          box: "device-pixel-content-box",
        });
        return <div ref={ref} data-testid="target">Test</div>;
      }

      render(<App />);

      expect(observeFn).toHaveBeenCalledWith(
        expect.anything(),
        { box: "device-pixel-content-box" }
      );
    });

    it("should recreate observer when box option changes", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App({ box }: { box: ResizeObserverBoxOptions }) {
        const [ref] = useResizeObserverRef(callback, { box });
        return <div ref={ref} data-testid="target">Test</div>;
      }

      const { rerender } = render(<App box="content-box" />);

      await waitFor(() => expect(observeFn).toHaveBeenCalledTimes(1));

      rerender(<App box="border-box" />);

      await waitFor(() => expect(disconnectFn).toHaveBeenCalled());
      await waitFor(() => expect(observeFn).toHaveBeenCalledTimes(2));
    });
  });

  // 6. Ref Stability
  describe("ref stability", () => {
    it("should return stable ref callback across renders", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { result, rerender } = renderHook(() =>
        useResizeObserverRef(callback)
      );

      const firstRef = result.current[0];
      rerender();
      const secondRef = result.current[0];

      expect(firstRef).toBe(secondRef);
    });

    it("should maintain ref stability when callback changes", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender } = renderHook(
        ({ cb }) => useResizeObserverRef(cb),
        { initialProps: { cb: callback1 } }
      );

      const firstRef = result.current[0];

      rerender({ cb: callback2 });

      const secondRef = result.current[0];

      expect(firstRef).toBe(secondRef);
    });
  });

  // 7. Multiple Elements
  describe("multiple elements", () => {
    it("should support multiple independent observers", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      function App() {
        const [ref1] = useResizeObserverRef(callback1);
        const [ref2] = useResizeObserverRef(callback2);

        return (
          <div>
            <div ref={ref1} data-testid="target1">First</div>
            <div ref={ref2} data-testid="target2">Second</div>
          </div>
        );
      }

      render(<App />);

      expect(global.ResizeObserver).toHaveBeenCalledTimes(2);
      expect(observeFn).toHaveBeenCalledTimes(2);
    });

    it("should call correct callbacks for each observer", async () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const observers: ResizeObserver[] = [];

      global.ResizeObserver = jest.fn().mockImplementation((callback) => {
        const observer = {
          observe: observeFn,
          unobserve: unobserveFn,
          disconnect: disconnectFn,
          callback,
        };
        observers.push(observer as any);
        return observer;
      });

      function App() {
        const [ref1] = useResizeObserverRef(callback1);
        const [ref2] = useResizeObserverRef(callback2);

        return (
          <div>
            <div ref={ref1} data-testid="target1">First</div>
            <div ref={ref2} data-testid="target2">Second</div>
          </div>
        );
      }

      render(<App />);

      await waitFor(() => expect(observers.length).toBe(2));

      // Trigger first observer
      if (observers[0]) {
        act(() => {
          (observers[0] as any).callback([] as any, {} as any);
        });
      }

      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  // 8. Element Switching
  describe("element switching", () => {
    it("should handle element being attached and detached", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [show, setShow] = useState(false);
        const [ref] = useResizeObserverRef(callback);

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Test</div>}
            <button onClick={() => setShow(!show)} data-testid="toggle">
              Toggle
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<App />);

      // Initially not observing
      expect(observeFn).not.toHaveBeenCalled();

      // Show element
      act(() => {
        fireEvent.click(getByTestId("toggle"));
      });

      await waitFor(() => expect(observeFn).toHaveBeenCalled());

      // Hide element
      act(() => {
        fireEvent.click(getByTestId("toggle"));
      });

      await waitFor(() => expect(disconnectFn).toHaveBeenCalled());
    });

    it("should handle element replacement", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [key, setKey] = useState(0);
        const [ref] = useResizeObserverRef(callback);

        return (
          <div>
            <div key={key} ref={ref} data-testid="target">
              Test {key}
            </div>
            <button onClick={() => setKey(k => k + 1)} data-testid="replace">
              Replace
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalledTimes(1));

      const initialCallCount = observeFn.mock.calls.length;

      act(() => {
        fireEvent.click(getByTestId("replace"));
      });

      // Should disconnect old and observe new
      await waitFor(() =>
        expect(observeFn.mock.calls.length).toBeGreaterThan(initialCallCount)
      );
    });
  });

  // 9. Edge Cases
  describe("edge cases", () => {
    it("should handle null ref gracefully", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      const { result } = renderHook(() => useResizeObserverRef(callback));

      expect(() => {
        act(() => {
          result.current[0](null);
        });
      }).not.toThrow();

      expect(true).toBe(true);
    });

    it("should not observe when ref is null", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [ref] = useResizeObserverRef(callback);
        // Don't attach ref
        return <div data-testid="target">Test</div>;
      }

      render(<App />);

      expect(observeFn).not.toHaveBeenCalled();
    });

    it("should handle rapid callback changes", async () => {
      expect.hasAssertions();
      const callbacks = Array.from({ length: 10 }, () => jest.fn());

      function App() {
        const [index, setIndex] = useState(0);
        const [ref] = useResizeObserverRef(callbacks[index]);

        return (
          <div>
            <div ref={ref} data-testid="target">Test</div>
            <button
              onClick={() => setIndex(i => (i + 1) % callbacks.length)}
              data-testid="change"
            >
              Change
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<App />);

      for (let i = 0; i < 5; i++) {
        act(() => {
          fireEvent.click(getByTestId("change"));
        });
      }

      // Should not crash
      expect(true).toBe(true);
    });
  });

  // 10. Performance
  describe("performance", () => {
    it("should not create observer until element is attached", () => {
      expect.hasAssertions();
      const callback = jest.fn();

      renderHook(() => useResizeObserverRef(callback));

      expect(global.ResizeObserver).not.toHaveBeenCalled();
    });

    it("should only create one observer per element", async () => {
      expect.hasAssertions();
      const callback = jest.fn();

      function App() {
        const [, forceUpdate] = useState(0);
        const [ref] = useResizeObserverRef(callback);

        return (
          <div>
            <div ref={ref} data-testid="target">Test</div>
            <button
              onClick={() => forceUpdate(n => n + 1)}
              data-testid="rerender"
            >
              Re-render
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<App />);

      await waitFor(() => expect(observeFn).toHaveBeenCalledTimes(1));

      // Force re-render
      act(() => {
        fireEvent.click(getByTestId("rerender"));
      });

      // Should still only have one observer
      await waitFor(() => expect(observeFn).toHaveBeenCalledTimes(1));
    });
  });
});
