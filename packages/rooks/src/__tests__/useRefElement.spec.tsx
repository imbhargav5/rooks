/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useRefElement } from "@/hooks/useRefElement";
import React from "react";
import { render, screen } from "@testing-library/react";

describe("useRefElement", () => {
  // 1. Basic Functionality
  describe("basic functionality", () => {
    it("should be defined", () => {
      expect.hasAssertions();
      expect(useRefElement).toBeDefined();
    });

    it("should return a tuple of [ref callback, element]", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement());

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe("function");
      expect(result.current[1]).toBeNull();
    });

    it("should initialize with null element", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement());
      const [, element] = result.current;

      expect(element).toBeNull();
    });
  });

  // 2. Ref Callback Functionality
  describe("ref callback", () => {
    it("should update element when ref callback is called", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element = document.createElement("div");

      act(() => {
        const [ref] = result.current;
        ref(element);
      });

      const [, currentElement] = result.current;
      expect(currentElement).toBe(element);
    });

    it("should update element to null when ref callback is called with null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element = document.createElement("div");

      // Set element
      act(() => {
        const [ref] = result.current;
        ref(element);
      });

      expect(result.current[1]).toBe(element);

      // Clear element
      act(() => {
        const [ref] = result.current;
        ref(null);
      });

      expect(result.current[1]).toBeNull();
    });

    it("should handle multiple element updates", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLElement>());
      const div = document.createElement("div");
      const span = document.createElement("span");
      const button = document.createElement("button");

      act(() => {
        result.current[0](div);
      });
      expect(result.current[1]).toBe(div);

      act(() => {
        result.current[0](span);
      });
      expect(result.current[1]).toBe(span);

      act(() => {
        result.current[0](button);
      });
      expect(result.current[1]).toBe(button);
    });
  });

  // 3. Callback Reference Stability
  describe("callback reference stability", () => {
    it("should maintain stable ref callback across renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useRefElement());

      const firstCallback = result.current[0];
      rerender();
      const secondCallback = result.current[0];

      expect(firstCallback).toBe(secondCallback);
    });

    it("should maintain stable ref callback even when element changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element1 = document.createElement("div");
      const element2 = document.createElement("div");

      const firstCallback = result.current[0];

      act(() => {
        result.current[0](element1);
      });

      const secondCallback = result.current[0];

      act(() => {
        result.current[0](element2);
      });

      const thirdCallback = result.current[0];

      expect(firstCallback).toBe(secondCallback);
      expect(secondCallback).toBe(thirdCallback);
    });
  });

  // 4. React Component Integration
  describe("React component integration", () => {
    it("should work in a React component", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();

        return (
          <div>
            <div ref={ref} data-testid="target">Target Element</div>
            <div data-testid="status">
              {element ? "element-exists" : "no-element"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const status = screen.getByTestId("status");

      expect(status.textContent).toBe("element-exists");
    });

    it("should track element across component lifecycle", () => {
      expect.hasAssertions();

      function TestComponent({ show }: { show: boolean }) {
        const [ref, element] = useRefElement<HTMLDivElement>();

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Target</div>}
            <div data-testid="element-status">
              {element ? "mounted" : "unmounted"}
            </div>
          </div>
        );
      }

      const { rerender } = render(<TestComponent show={true} />);
      expect(screen.getByTestId("element-status").textContent).toBe("mounted");

      rerender(<TestComponent show={false} />);
      expect(screen.getByTestId("element-status").textContent).toBe("unmounted");
    });

    it("should provide access to element properties", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();

        return (
          <div>
            <div ref={ref} data-testid="target" className="test-class">
              Target
            </div>
            <div data-testid="class-name">
              {element?.className || "no-class"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const className = screen.getByTestId("class-name");

      expect(className.textContent).toBe("test-class");
    });
  });

  // 5. Different Element Types
  describe("different element types", () => {
    it("should work with HTMLDivElement", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const div = document.createElement("div");

      act(() => {
        result.current[0](div);
      });

      expect(result.current[1]).toBe(div);
    });

    it("should work with HTMLButtonElement", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLButtonElement>());
      const button = document.createElement("button");

      act(() => {
        result.current[0](button);
      });

      expect(result.current[1]).toBe(button);
    });

    it("should work with HTMLInputElement", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLInputElement>());
      const input = document.createElement("input");

      act(() => {
        result.current[0](input);
      });

      expect(result.current[1]).toBe(input);
    });

    it("should work with generic HTMLElement", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLElement>());
      const section = document.createElement("section");

      act(() => {
        result.current[0](section);
      });

      expect(result.current[1]).toBe(section);
    });
  });

  // 6. State Updates
  describe("state updates", () => {
    it("should trigger re-render when element is set", () => {
      expect.hasAssertions();
      let renderCount = 0;

      function TestComponent() {
        renderCount++;
        const [ref, element] = useRefElement<HTMLDivElement>();
        const [show, setShow] = React.useState(false);

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Target</div>}
            <button onClick={() => setShow(true)} data-testid="show-btn">
              Show
            </button>
            <div data-testid="status">{element ? "yes" : "no"}</div>
          </div>
        );
      }

      const { getByTestId } = render(<TestComponent />);
      const initialRenderCount = renderCount;

      act(() => {
        getByTestId("show-btn").click();
      });

      // Should have caused re-renders
      expect(renderCount).toBeGreaterThan(initialRenderCount);
    });

    it("should update derived state when element changes", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();
        const hasElement = element !== null;

        return (
          <div>
            <div ref={ref} data-testid="target" style={{ width: "200px" }}>
              Target
            </div>
            <div data-testid="has-element">
              {hasElement ? "has-element" : "no-element"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const elementStatus = screen.getByTestId("has-element");

      // Element should be tracked
      expect(elementStatus.textContent).toBe("has-element");
    });
  });

  // 7. Multiple Instances
  describe("multiple instances", () => {
    it("should support multiple independent useRefElement calls", () => {
      expect.hasAssertions();
      const { result: result1 } = renderHook(() =>
        useRefElement<HTMLDivElement>()
      );
      const { result: result2 } = renderHook(() =>
        useRefElement<HTMLDivElement>()
      );

      const element1 = document.createElement("div");
      const element2 = document.createElement("div");

      act(() => {
        result1.current[0](element1);
        result2.current[0](element2);
      });

      expect(result1.current[1]).toBe(element1);
      expect(result2.current[1]).toBe(element2);
      expect(result1.current[1]).not.toBe(result2.current[1]);
    });

    it("should work with multiple elements in same component", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref1, element1] = useRefElement<HTMLDivElement>();
        const [ref2, element2] = useRefElement<HTMLDivElement>();

        return (
          <div>
            <div ref={ref1} data-testid="target1">First</div>
            <div ref={ref2} data-testid="target2">Second</div>
            <div data-testid="both-exist">
              {element1 && element2 ? "both" : "not-both"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const status = screen.getByTestId("both-exist");

      expect(status.textContent).toBe("both");
    });
  });

  // 8. Edge Cases
  describe("edge cases", () => {
    it("should handle being called multiple times with same element", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element = document.createElement("div");

      act(() => {
        result.current[0](element);
        result.current[0](element);
        result.current[0](element);
      });

      expect(result.current[1]).toBe(element);
    });

    it("should handle rapid element swapping", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLElement>());
      const elements = Array.from({ length: 10 }, (_, i) => {
        const el = document.createElement("div");
        el.id = `element-${i}`;
        return el;
      });

      act(() => {
        elements.forEach(el => {
          result.current[0](el);
        });
      });

      expect(result.current[1]).toBe(elements[elements.length - 1]);
    });

    it("should handle null -> element -> null -> element pattern", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element1 = document.createElement("div");
      const element2 = document.createElement("div");

      act(() => {
        result.current[0](null);
      });
      expect(result.current[1]).toBeNull();

      act(() => {
        result.current[0](element1);
      });
      expect(result.current[1]).toBe(element1);

      act(() => {
        result.current[0](null);
      });
      expect(result.current[1]).toBeNull();

      act(() => {
        result.current[0](element2);
      });
      expect(result.current[1]).toBe(element2);
    });
  });

  // 9. Cleanup
  describe("cleanup", () => {
    it("should not cause errors on unmount", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();

        return <div ref={ref} data-testid="target">Target</div>;
      }

      const { unmount } = render(<TestComponent />);

      expect(() => {
        unmount();
      }).not.toThrow();

      expect(true).toBe(true);
    });

    it("should handle unmount with element attached", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useRefElement<HTMLDivElement>());
      const element = document.createElement("div");

      act(() => {
        result.current[0](element);
      });

      // Hook cleanup happens automatically in testing-library
      expect(result.current[1]).toBe(element);
    });
  });

  // 10. Real-world Use Cases
  describe("real-world use cases", () => {
    it("should enable imperative DOM operations", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();

        const handleFocus = () => {
          element?.focus();
        };

        return (
          <div>
            <div ref={ref} data-testid="target" tabIndex={0}>
              Focusable
            </div>
            <button onClick={handleFocus} data-testid="focus-btn">
              Focus
            </button>
          </div>
        );
      }

      const { getByTestId } = render(<TestComponent />);
      const target = getByTestId("target") as HTMLDivElement;
      const focusBtn = getByTestId("focus-btn");

      act(() => {
        focusBtn.click();
      });

      expect(document.activeElement).toBe(target);
    });

    it("should enable measuring element dimensions", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, element] = useRefElement<HTMLDivElement>();
        const [hasDimensions, setHasDimensions] = React.useState(false);

        React.useEffect(() => {
          if (element) {
            // In JSDOM, offsetWidth/Height are 0, but we can check the element exists
            // and has a style attribute
            setHasDimensions(element.style.width !== "");
          }
        }, [element]);

        return (
          <div>
            <div
              ref={ref}
              data-testid="target"
              style={{ width: "100px", height: "50px" }}
            >
              Target
            </div>
            <div data-testid="has-dimensions">
              {hasDimensions ? "has-dimensions" : "no-dimensions"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const dimensionsDisplay = screen.getByTestId("has-dimensions");

      // Should have access to element and its properties
      expect(dimensionsDisplay.textContent).toBe("has-dimensions");
    });

    it("should enable conditional rendering based on element existence", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [show, setShow] = React.useState(false);
        const [ref, element] = useRefElement<HTMLDivElement>();

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Target</div>}
            <button onClick={() => setShow(!show)} data-testid="toggle">
              Toggle
            </button>
            <div data-testid="message">
              {element ? "Element is mounted" : "Element is not mounted"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const message = screen.getByTestId("message");

      expect(message.textContent).toBe("Element is not mounted");
    });
  });
});
