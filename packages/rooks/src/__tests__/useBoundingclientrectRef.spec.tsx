/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useBoundingclientrectRef } from "@/hooks/useBoundingclientrectRef";

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn();

// Mock ResizeObserver
const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

// Mock MutationObserver
const mockMutationObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
};

describe("useBoundingclientrectRef", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock getBoundingClientRect on HTMLElement prototype
    mockGetBoundingClientRect.mockReturnValue({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      top: 20,
      right: 110,
      bottom: 70,
      left: 10,
      toJSON: () => ({}),
    });
    
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      value: mockGetBoundingClientRect,
      writable: true,
      configurable: true,
    });
    
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => mockResizeObserver);
    
    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation(() => mockMutationObserver);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useBoundingclientrectRef).toBeDefined();
  });

  describe("Initial State", () => {
    it("should return initial state with null values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref, domRect, update] = result.current;
      
      expect(ref).toBeInstanceOf(Function);
      expect(domRect).toBe(null);
      expect(update).toBeInstanceOf(Function);
    });
  });

  describe("Ref Handling", () => {
    it("should update domRect when ref is set to an element", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      const [, domRect] = result.current;
      
      expect(mockGetBoundingClientRect).toHaveBeenCalled();
      expect(domRect).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        top: 20,
        right: 110,
        bottom: 70,
        left: 10,
        toJSON: expect.any(Function),
      });
    });

    it("should set domRect to null when ref is set to null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      // First set to element
      act(() => {
        ref(mockElement);
      });
      
      expect(result.current[1]).not.toBe(null);
      
      // Then set to null
      act(() => {
        ref(null);
      });
      
      const [, domRect] = result.current;
      expect(domRect).toBe(null);
    });
  });

  describe("Update Function", () => {
    it.skip("should manually update domRect when update function is called", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref, , update] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Clear mock calls from initial setup
      mockGetBoundingClientRect.mockClear();
      
      // Update getBoundingClientRect return value
      mockGetBoundingClientRect.mockReturnValue({
        x: 20,
        y: 30,
        width: 200,
        height: 100,
        top: 30,
        right: 220,
        bottom: 130,
        left: 20,
        toJSON: () => ({}),
      });
      
      act(() => {
        update();
      });
      
      const [, domRect] = result.current;
      
      expect(mockGetBoundingClientRect).toHaveBeenCalled();
      expect(domRect).toEqual({
        x: 20,
        y: 30,
        width: 200,
        height: 100,
        top: 30,
        right: 220,
        bottom: 130,
        left: 20,
        toJSON: expect.any(Function),
      });
    });

    it("should return null when update is called with no element", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [, , update] = result.current;
      
      act(() => {
        update();
      });
      
      const [, domRect] = result.current;
      expect(domRect).toBe(null);
    });
  });

  describe("MutationObserver Integration", () => {
    it("should observe element for mutations when ref is set", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(MutationObserver).toHaveBeenCalled();
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        })
      );
    });

    it("should disconnect observer when component unmounts", () => {
      expect.hasAssertions();
      const { result, unmount } = renderHook(() => useBoundingclientrectRef());
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      unmount();
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe("Integration Test", () => {
    it("should work in a complete component scenario", async () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const [ref, domRect, update] = useBoundingclientrectRef();
        
        return (
          <div>
            <div ref={ref} data-testid="target" style={{ width: 100, height: 50 }}>
              Target Element
            </div>
            <div data-testid="rect-info">
              {domRect ? `${domRect.width}x${domRect.height}` : 'No rect'}
            </div>
            <button onClick={update} data-testid="update">
              Update
            </button>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Initially should show rect info
      await waitFor(() => {
        expect(screen.getByTestId("rect-info")).toHaveTextContent("100x50");
      });
      
      // Test manual update
      mockGetBoundingClientRect.mockReturnValue({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        top: 0,
        right: 200,
        bottom: 100,
        left: 0,
        toJSON: () => ({}),
      });
      
      const updateButton = screen.getByTestId("update");
      fireEvent.click(updateButton);
      
      await waitFor(() => {
        expect(screen.getByTestId("rect-info")).toHaveTextContent("200x100");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid ref changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBoundingclientrectRef());
      
      const [ref] = result.current;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      // Rapid changes
      act(() => {
        ref(element1);
        ref(element2);
        ref(null);
        ref(element1);
      });
      
      // Should handle without errors
      expect(result.current[1]).not.toBe(null);
      expect(mockGetBoundingClientRect).toHaveBeenCalled();
    });

    it("should maintain stable ref function identity", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useBoundingclientrectRef());
      
      const [initialRef] = result.current;
      
      rerender();
      
      const [rerenderRef] = result.current;
      
      expect(initialRef).toBe(rerenderRef);
    });

    it("should maintain stable update function identity", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useBoundingclientrectRef());
      
      const [, , initialUpdate] = result.current;
      
      rerender();
      
      const [, , rerenderUpdate] = result.current;
      
      expect(initialUpdate).toBe(rerenderUpdate);
    });
  });
});
