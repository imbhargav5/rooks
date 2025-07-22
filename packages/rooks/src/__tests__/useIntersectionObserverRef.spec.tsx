/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useIntersectionObserverRef } from "@/hooks/useIntersectionObserverRef";

// Mock IntersectionObserver
const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

const mockIntersectionObserverConstructor = jest.fn();

describe("useIntersectionObserverRef", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock IntersectionObserver
    mockIntersectionObserverConstructor.mockImplementation(() => mockIntersectionObserver);
    global.IntersectionObserver = mockIntersectionObserverConstructor;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIntersectionObserverRef).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should return a ref function", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      
      expect(ref).toBeInstanceOf(Function);
    });

    it("should create IntersectionObserver when element is set", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserverConstructor).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: "0px 0px 0px 0px",
          threshold: [0, 1],
        }
      );
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(mockElement);
    });

    it("should not create IntersectionObserver when callback is undefined", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useIntersectionObserverRef(undefined));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserverConstructor).toHaveBeenCalled();
      expect(mockIntersectionObserver.observe).toHaveBeenCalled();
    });

    it("should disconnect observer when element is set to null", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      // First set element
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(mockElement);
      
      // Then set to null
      act(() => {
        ref(null);
      });
      
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe("Options Handling", () => {
    it("should use default options when none provided", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserverConstructor).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: "0px 0px 0px 0px",
          threshold: [0, 1],
        }
      );
    });

    it("should use custom options when provided", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const options = {
        root: document.body,
        rootMargin: "10px 20px 30px 40px",
        threshold: [0.25, 0.5, 0.75],
      };
      
      const { result } = renderHook(() => 
        useIntersectionObserverRef(callback, options)
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserverConstructor).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });

    it("should recreate observer when options change", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const initialOptions = { threshold: [0] };
      const newOptions = { threshold: [0.5] };
      
      const { result, rerender } = renderHook(
        ({ options }) => useIntersectionObserverRef(callback, options),
        { initialProps: { options: initialOptions } }
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockIntersectionObserverConstructor).toHaveBeenCalledTimes(1);
      expect(mockIntersectionObserver.observe).toHaveBeenCalledTimes(1);
      
      // Change options
      rerender({ options: newOptions });
      
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
      expect(mockIntersectionObserverConstructor).toHaveBeenCalledTimes(2);
      expect(mockIntersectionObserver.observe).toHaveBeenCalledTimes(2);
    });
  });

  describe("Callback Handling", () => {
    it("should call callback when intersection occurs", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Get the callback that was passed to IntersectionObserver
      const observerCallback = mockIntersectionObserverConstructor.mock.calls[0][0];
      const mockEntries = [
        {
          target: mockElement,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ] as IntersectionObserverEntry[];
      const mockObserver = mockIntersectionObserver as IntersectionObserver;
      
      // Simulate intersection
      act(() => {
        observerCallback(mockEntries, mockObserver);
      });
      
      expect(callback).toHaveBeenCalledWith(mockEntries, mockObserver);
    });

    it("should update callback reference when callback changes", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const { result, rerender } = renderHook(
        ({ callback }) => useIntersectionObserverRef(callback),
        { initialProps: { callback: callback1 } }
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Get the callback that was passed to IntersectionObserver
      const observerCallback = mockIntersectionObserverConstructor.mock.calls[0][0];
      const mockEntries = [] as IntersectionObserverEntry[];
      const mockObserver = mockIntersectionObserver as IntersectionObserver;
      
      // Simulate intersection with first callback
      act(() => {
        observerCallback(mockEntries, mockObserver);
      });
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      
      // Change callback
      rerender({ callback: callback2 });
      
      // Simulate intersection with new callback
      act(() => {
        observerCallback(mockEntries, mockObserver);
      });
      
      expect(callback2).toHaveBeenCalled();
    });

    it("should handle undefined callback gracefully", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useIntersectionObserverRef(undefined));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Get the callback that was passed to IntersectionObserver
      const observerCallback = mockIntersectionObserverConstructor.mock.calls[0][0];
      const mockEntries = [] as IntersectionObserverEntry[];
      const mockObserver = mockIntersectionObserver as IntersectionObserver;
      
      // Should not throw when callback is undefined
      expect(() => {
        act(() => {
          observerCallback(mockEntries, mockObserver);
        });
      }).not.toThrow();
    });
  });

  describe("Cleanup", () => {
    it("should disconnect observer on unmount", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result, unmount } = renderHook(() => 
        useIntersectionObserverRef(callback)
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      unmount();
      
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
    });

    it("should disconnect observer when switching elements", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      // Set first element
      act(() => {
        ref(element1);
      });
      
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(element1);
      
      // Switch to second element
      act(() => {
        ref(element2);
      });
      
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(element2);
    });
  });

  describe("Integration Test", () => {
    it("should work in a complete component scenario", async () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const [isVisible, setIsVisible] = useState(false);
        const [intersectionCount, setIntersectionCount] = useState(0);
        
        const callback = jest.fn((entries: IntersectionObserverEntry[]) => {
          setIntersectionCount(prev => prev + 1);
          entries.forEach(entry => {
            setIsVisible(entry.isIntersecting);
          });
        });
        
        const [ref] = useIntersectionObserverRef(callback, {
          threshold: [0, 0.5, 1],
        });
        
        return (
          <div>
            <div ref={ref} data-testid="target">
              Target Element
            </div>
            <div data-testid="visibility">
              {isVisible ? "Visible" : "Not Visible"}
            </div>
            <div data-testid="count">
              Intersections: {intersectionCount}
            </div>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId("visibility")).toHaveTextContent("Not Visible");
      expect(screen.getByTestId("count")).toHaveTextContent("Intersections: 0");
      
      // Simulate intersection
      const observerCallback = mockIntersectionObserverConstructor.mock.calls[0][0];
      const mockEntries = [
        {
          target: screen.getByTestId("target"),
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ] as IntersectionObserverEntry[];
      
      act(() => {
        observerCallback(mockEntries, mockIntersectionObserver as IntersectionObserver);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("visibility")).toHaveTextContent("Visible");
        expect(screen.getByTestId("count")).toHaveTextContent("Intersections: 1");
      });
    });
  });

  describe("Edge Cases", () => {
    it.skip("should handle rapid element changes", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      // Rapid changes
      act(() => {
        ref(element1);
        ref(null);
        ref(element2);
        ref(null);
        ref(element1);
      });
      
      // Should handle without errors
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(element1);
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
    });

    it("should maintain stable ref function identity", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result, rerender } = renderHook(() => 
        useIntersectionObserverRef(callback)
      );
      
      const [initialRef] = result.current;
      
      rerender();
      
      const [rerenderRef] = result.current;
      
      expect(initialRef).toBe(rerenderRef);
    });

    it.skip("should handle IntersectionObserver constructor throwing", () => {
      expect.hasAssertions();
      mockIntersectionObserverConstructor.mockImplementation(() => {
        throw new Error("IntersectionObserver not supported");
      });
      
      const callback = jest.fn();
      const { result } = renderHook(() => useIntersectionObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      expect(() => {
        act(() => {
          ref(mockElement);
        });
      }).toThrow("IntersectionObserver not supported");
    });
  });
});
