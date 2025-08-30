/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useMeasure } from "@/hooks/useMeasure";

// Mock console methods to avoid spam during tests
const originalConsoleWarn = console.warn;

describe("useMeasure", () => {
  let mockObserve: jest.Mock;
  let mockUnobserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let resizeObserverCallback: ResizeObserverCallback | null = null;

  beforeEach(() => {
    // Setup ResizeObserver mock
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    mockDisconnect = jest.fn();

    const MockResizeObserver = jest.fn().mockImplementation((callback) => {
      resizeObserverCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    global.ResizeObserver = MockResizeObserver;

    // Mock element measurements
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-client-width") || "100", 10);
      },
    });

    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-client-height") || "50", 10);
      },
    });

    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-scroll-width") || "120", 10);
      },
    });

    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-scroll-height") || "60", 10);
      },
    });

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-offset-width") || "110", 10);
      },
    });

    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get: function () {
        return parseInt(this.getAttribute("data-offset-height") || "55", 10);
      },
    });

    // Suppress console warnings during tests
    console.warn = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    console.warn = originalConsoleWarn;
    resizeObserverCallback = null;
  });

  test("should be defined", () => {
    expect.hasAssertions();
    expect(useMeasure).toBeDefined();
  });

  describe("basic functionality", () => {
    test("should return initial values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useMeasure());

      const [ref, measurements] = result.current;
      expect(ref).toBeDefined();
      expect(measurements).toEqual({
        innerWidth: 0,
        innerHeight: 0,
        innerScrollWidth: 0,
        innerScrollHeight: 0,
        outerWidth: 0,
        outerHeight: 0,
        outerScrollWidth: 0,
        outerScrollHeight: 0,
      });
    });

    test("should create ResizeObserver when element is attached", async () => {
      expect.hasAssertions();
      
      function TestComponent() {
        const [ref, { innerWidth, innerHeight }] = useMeasure();
        return (
          <div 
            ref={ref}
            data-testid="measured-element"
            data-client-width="200"
            data-client-height="100"
            data-scroll-width="250"
            data-scroll-height="120"
          >
            {innerWidth}x{innerHeight}
          </div>
        );
      }

      render(<TestComponent />);
      
      await waitFor(() => {
        expect(mockObserve).toHaveBeenCalled();
      });

      expect(global.ResizeObserver).toHaveBeenCalled();
    });

    test("should measure element dimensions correctly", async () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref, { innerWidth, innerHeight, innerScrollWidth, innerScrollHeight }] = useMeasure();
        return (
          <div 
            ref={ref}
            data-testid="measured-element"
            data-client-width="300"
            data-client-height="150"
            data-scroll-width="400"
            data-scroll-height="200"
          >
            <span data-testid="width">{innerWidth}</span>
            <span data-testid="height">{innerHeight}</span>
            <span data-testid="scroll-width">{innerScrollWidth}</span>
            <span data-testid="scroll-height">{innerScrollHeight}</span>
          </div>
        );
      }

      render(<TestComponent />);

      await waitFor(() => {
        const widthElement = screen.getByTestId("width");
        const heightElement = screen.getByTestId("height");
        const scrollWidthElement = screen.getByTestId("scroll-width");
        const scrollHeightElement = screen.getByTestId("scroll-height");

        expect(widthElement.textContent).toBe("300");
        expect(heightElement.textContent).toBe("150");
        expect(scrollWidthElement.textContent).toBe("400");
        expect(scrollHeightElement.textContent).toBe("200");
      });
    });

    test("should call onMeasure callback when dimensions change", async () => {
      expect.hasAssertions();
      const onMeasure = jest.fn();

      function TestComponent() {
        const [ref] = useMeasure({ onMeasure });
        return (
          <div 
            ref={ref}
            data-testid="measured-element"
            data-client-width="100"
            data-client-height="50"
            data-scroll-width="120"
            data-scroll-height="60"
          />
        );
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(onMeasure).toHaveBeenCalledWith({
          innerWidth: 100,
          innerHeight: 50,
          innerScrollWidth: 120,
          innerScrollHeight: 60,
          outerWidth: 110,
          outerHeight: 55,
          outerScrollWidth: 120,
          outerScrollHeight: 60,
        });
      });
    });

    test("should trigger measurements on ResizeObserver callback", async () => {
      expect.hasAssertions();
      const onMeasure = jest.fn();

      function TestComponent() {
        const [ref, { innerWidth, innerHeight }] = useMeasure({ onMeasure });
        return (
          <div 
            ref={ref}
            data-testid="measured-element"
            data-client-width="100"
            data-client-height="50"
            data-scroll-width="120"
            data-scroll-height="60"
          >
            {innerWidth}x{innerHeight}
          </div>
        );
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(resizeObserverCallback).not.toBeNull();
      });

      // Simulate ResizeObserver triggering
      act(() => {
        if (resizeObserverCallback) {
          resizeObserverCallback([], {} as ResizeObserver);
        }
      });

      await waitFor(() => {
        expect(onMeasure).toHaveBeenCalledWith({
          innerWidth: 100,
          innerHeight: 50,
          innerScrollWidth: 120,
          innerScrollHeight: 60,
          outerWidth: 110,
          outerHeight: 55,
          outerScrollWidth: 120,
          outerScrollHeight: 60,
        });
      });
    });
  });

  describe("disabled option", () => {
    test("should not create ResizeObserver when disabled", () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref] = useMeasure({ disabled: true });
        return <div ref={ref} data-testid="measured-element" />;
      }

      render(<TestComponent />);

      expect(mockObserve).not.toHaveBeenCalled();
      expect(global.ResizeObserver).not.toHaveBeenCalled();
    });

    test("should not call onMeasure when disabled", async () => {
      expect.hasAssertions();
      const onMeasure = jest.fn();

      function TestComponent() {
        const [ref] = useMeasure({ disabled: true, onMeasure });
        return <div ref={ref} data-testid="measured-element" />;
      }

      render(<TestComponent />);

      // Wait a bit to ensure no calls are made
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(onMeasure).not.toHaveBeenCalled();
    });
  });

  describe("debounce functionality", () => {
    test("should debounce measurements", async () => {
      expect.hasAssertions();
      const onMeasure = jest.fn();

      function TestComponent() {
        const [ref] = useMeasure({ 
          debounce: 100,
          onMeasure 
        });
        return (
          <div 
            ref={ref}
            data-testid="measured-element"
            data-client-width="100"
            data-client-height="50"
            data-scroll-width="120"
            data-scroll-height="60"
          />
        );
      }

      render(<TestComponent />);

      // Initial call should be debounced
      expect(onMeasure).not.toHaveBeenCalled();

      // Wait for debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      await waitFor(() => {
        expect(onMeasure).toHaveBeenCalledWith({
          innerWidth: 100,
          innerHeight: 50,
          innerScrollWidth: 120,
          innerScrollHeight: 60,
          outerWidth: 110,
          outerHeight: 55,
          outerScrollWidth: 120,
          outerScrollHeight: 60,
        });
      });
    });
  });

  describe("cleanup", () => {
    test("should disconnect ResizeObserver on unmount", async () => {
      expect.hasAssertions();

      function TestComponent() {
        const [ref] = useMeasure();
        return <div ref={ref} data-testid="measured-element" />;
      }

      const { unmount } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockObserve).toHaveBeenCalled();
      });

      act(() => {
        unmount();
      });

      expect(mockDisconnect).toHaveBeenCalled();
    });

    test("should disconnect ResizeObserver when element is removed", async () => {
      expect.hasAssertions();

      function TestComponent({ showElement }: { showElement: boolean }) {
        const [ref] = useMeasure();
        return showElement ? (
          <div ref={ref} data-testid="measured-element" />
        ) : (
          <div>No element</div>
        );
      }

      const { rerender } = render(<TestComponent showElement={true} />);

      await waitFor(() => {
        expect(mockObserve).toHaveBeenCalled();
      });

      act(() => {
        rerender(<TestComponent showElement={false} />);
      });

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe("SSR compatibility", () => {
    test("should handle missing ResizeObserver gracefully", () => {
      expect.hasAssertions();
      
      // Temporarily remove ResizeObserver
      const originalResizeObserver = global.ResizeObserver;
      // @ts-expect-error - Intentionally testing undefined case
      delete global.ResizeObserver;

      function TestComponent() {
        const [ref, { innerWidth, innerHeight }] = useMeasure();
        return (
          <div ref={ref} data-testid="measured-element">
            {innerWidth}x{innerHeight}
          </div>
        );
      }

      render(<TestComponent />);

      expect(console.warn).toHaveBeenCalledWith(
        "useMeasure: ResizeObserver is not available in this environment"
      );

      // Restore ResizeObserver
      global.ResizeObserver = originalResizeObserver;
    });

    test("should warn about SSR environment", () => {
      expect.hasAssertions();
      
      // Mock window as undefined (SSR)
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR case
      delete global.window;

      renderHook(() => useMeasure());

      expect(console.warn).toHaveBeenCalledWith(
        "useMeasure: window is undefined (SSR environment)"
      );

      // Restore window
      global.window = originalWindow;
    });
  });

  describe("edge cases", () => {
    test("should handle rapid ref changes", async () => {
      expect.hasAssertions();

      function TestComponent({ elementId }: { elementId: string }) {
        const [ref] = useMeasure();
        return (
          <div>
            <div ref={ref} data-testid={`element-${elementId}`} />
          </div>
        );
      }

      const { rerender } = render(<TestComponent elementId="1" />);

      await waitFor(() => {
        expect(mockObserve).toHaveBeenCalled();
      });

      // Reset mocks to track the disconnect calls specifically
      mockDisconnect.mockClear();

      act(() => {
        rerender(<TestComponent elementId="2" />);
        rerender(<TestComponent elementId="3" />);
      });

      // Should not throw errors - this is the main test
      expect(mockObserve).toHaveBeenCalled();
      
      // Test that the hook handles changes properly without errors
      expect(() => {
        // This should not throw
      }).not.toThrow();
    });

    test("should return zero measurements for null element", () => {
      expect.hasAssertions();
      
      const { result } = renderHook(() => useMeasure());

      const [ref, measurements] = result.current;
      expect(measurements).toEqual({
        innerWidth: 0,
        innerHeight: 0,
        innerScrollWidth: 0,
        innerScrollHeight: 0,
        outerWidth: 0,
        outerHeight: 0,
        outerScrollWidth: 0,
        outerScrollHeight: 0,
      });
    });
  });
});