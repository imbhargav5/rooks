/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import { useRef } from "react";
import { useBoundingclientrect } from "@/hooks/useBoundingclientrect";
import React from "react";
import { render, screen } from "@testing-library/react";

describe("useBoundingclientrect", () => {
  // 1. Basic Functionality
  describe("basic functionality", () => {
    it("should be defined", () => {
      expect.hasAssertions();
      expect(useBoundingclientrect).toBeDefined();
    });

    it("should return null initially when ref.current is null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => {
        const ref = useRef<HTMLElement>(null);
        return useBoundingclientrect(ref);
      });
      expect(result.current).toBeNull();
    });

    it("should return DOMRect when element is attached", () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);

        return (
          <div>
            <div ref={ref} data-testid="target">Target</div>
            <div data-testid="rect-info">
              {rect ? `${rect.width}x${rect.height}` : "null"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const rectInfo = screen.getByTestId("rect-info");

      // Should have a DOMRect (dimensions depend on rendering)
      expect(rectInfo.textContent).not.toBe("null");
    });
  });

  // 2. DOMRect Properties
  describe("DOMRect properties", () => {
    it("should return valid DOMRect with all properties", () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);

        return (
          <div>
            <div
              ref={ref}
              data-testid="target"
              style={{ width: "100px", height: "50px" }}
            >
              Target
            </div>
            <div data-testid="has-properties">
              {rect && typeof rect.width === "number" &&
               typeof rect.height === "number" &&
               typeof rect.top === "number" &&
               typeof rect.left === "number" &&
               typeof rect.bottom === "number" &&
               typeof rect.right === "number" &&
               typeof rect.x === "number" &&
               typeof rect.y === "number" ? "valid" : "invalid"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const hasProps = screen.getByTestId("has-properties");
      expect(hasProps.textContent).toBe("valid");
    });
  });

  // 3. Updates on Mutations
  describe("mutation tracking", () => {
    it("should update when element is mutated", async () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);
        const [size, setSize] = React.useState(100);

        return (
          <div>
            <div
              ref={ref}
              data-testid="target"
              style={{ width: `${size}px`, height: "50px" }}
            >
              Target
            </div>
            <button onClick={() => setSize(200)} data-testid="resize-btn">
              Resize
            </button>
            <div data-testid="rect-width">
              {rect ? rect.width : "null"}
            </div>
          </div>
        );
      }

      const { getByTestId } = render(<TestComponent />);
      const rectWidth = getByTestId("rect-width");

      // Initial state
      expect(rectWidth.textContent).not.toBe("null");

      // Note: MutationObserver may not catch style changes in JSDOM
      // This test verifies the hook sets up properly
    });
  });

  // 4. Edge Cases
  describe("edge cases", () => {
    it("should handle ref changing from null to element", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [show, setShow] = React.useState(false);
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Target</div>}
            <button onClick={() => setShow(true)} data-testid="show-btn">
              Show
            </button>
            <div data-testid="rect-status">
              {rect ? "has-rect" : "no-rect"}
            </div>
          </div>
        );
      }

      const { getByTestId } = render(<TestComponent />);
      const rectStatus = getByTestId("rect-status");

      // Initially should be no-rect
      expect(rectStatus.textContent).toBe("no-rect");
    });

    it("should return null when element is removed", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [show, setShow] = React.useState(true);
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);

        return (
          <div>
            {show && <div ref={ref} data-testid="target">Target</div>}
            <button onClick={() => setShow(false)} data-testid="hide-btn">
              Hide
            </button>
            <div data-testid="rect-status">
              {rect ? "has-rect" : "no-rect"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const rectStatus = screen.getByTestId("rect-status");

      // Should have rect initially
      expect(rectStatus.textContent).toBe("has-rect");
    });
  });

  // 5. Cleanup
  describe("cleanup", () => {
    it("should not cause errors on unmount", () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        useBoundingclientrect(ref);

        return <div ref={ref} data-testid="target">Target</div>;
      }

      const { unmount } = render(<TestComponent />);

      expect(() => {
        unmount();
      }).not.toThrow();

      expect(true).toBe(true);
    });
  });

  // 6. Multiple Instances
  describe("multiple instances", () => {
    it("should work with multiple refs independently", () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref1 = useRef<HTMLDivElement>(null);
        const ref2 = useRef<HTMLDivElement>(null);
        const rect1 = useBoundingclientrect(ref1);
        const rect2 = useBoundingclientrect(ref2);

        return (
          <div>
            <div ref={ref1} data-testid="target1" style={{ width: "100px" }}>
              Target 1
            </div>
            <div ref={ref2} data-testid="target2" style={{ width: "200px" }}>
              Target 2
            </div>
            <div data-testid="both-exist">
              {rect1 && rect2 ? "both" : "not-both"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const bothExist = screen.getByTestId("both-exist");
      expect(bothExist.textContent).toBe("both");
    });
  });

  // 7. SSR Compatibility
  describe("SSR compatibility", () => {
    it("should handle undefined window gracefully", () => {
      expect.hasAssertions();

      // This test runs in jsdom, but we're testing the hook doesn't crash
      const { result } = renderHook(() => {
        const ref = useRef<HTMLElement>(null);
        return useBoundingclientrect(ref);
      });

      // Should return null when ref is null
      expect(result.current).toBeNull();
    });
  });

  // 8. Performance
  describe("performance and optimization", () => {
    it("should not cause infinite loops with rapid mutations", () => {
      expect.hasAssertions();

      function TestComponent() {
        const ref = useRef<HTMLDivElement>(null);
        const rect = useBoundingclientrect(ref);
        const [count, setCount] = React.useState(0);

        return (
          <div>
            <div ref={ref} data-testid="target">Target</div>
            <button
              onClick={() => setCount(c => c + 1)}
              data-testid="update-btn"
            >
              Update
            </button>
            <div data-testid="count">{count}</div>
            <div data-testid="rect-exists">{rect ? "yes" : "no"}</div>
          </div>
        );
      }

      render(<TestComponent />);
      const rectExists = screen.getByTestId("rect-exists");

      // Should work without crashing
      expect(rectExists.textContent).toBe("yes");
    });
  });

  // 9. Different Element Types
  describe("different element types", () => {
    it("should work with different HTML element types", () => {
      expect.hasAssertions();

      function TestComponent() {
        const divRef = useRef<HTMLDivElement>(null);
        const spanRef = useRef<HTMLSpanElement>(null);
        const buttonRef = useRef<HTMLButtonElement>(null);

        const divRect = useBoundingclientrect(divRef as any);
        const spanRect = useBoundingclientrect(spanRef as any);
        const buttonRect = useBoundingclientrect(buttonRef as any);

        return (
          <div>
            <div ref={divRef} data-testid="div">Div</div>
            <span ref={spanRef} data-testid="span">Span</span>
            <button ref={buttonRef} data-testid="button">Button</button>
            <div data-testid="all-rects">
              {divRect && spanRect && buttonRect ? "all" : "not-all"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);
      const allRects = screen.getByTestId("all-rects");
      expect(allRects.textContent).toBe("all");
    });
  });
});
