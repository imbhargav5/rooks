/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useMutationObserverRef } from "@/hooks/useMutationObserverRef";

// Mock MutationObserver
const mockMutationObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
};

const mockMutationObserverConstructor = jest.fn();

describe("useMutationObserverRef", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock MutationObserver
    mockMutationObserverConstructor.mockImplementation(() => mockMutationObserver);
    global.MutationObserver = mockMutationObserverConstructor;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMutationObserverRef).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should return a ref function", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      
      expect(ref).toBeInstanceOf(Function);
    });

    it("should create MutationObserver when element is set", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockMutationObserverConstructor).toHaveBeenCalledWith(callback);
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(mockElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    });

    it("should not create MutationObserver when element is null", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      
      act(() => {
        ref(null);
      });
      
      expect(mockMutationObserverConstructor).not.toHaveBeenCalled();
      expect(mockMutationObserver.observe).not.toHaveBeenCalled();
    });

    it("should disconnect observer when element is set to null", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      // First set element
      act(() => {
        ref(mockElement);
      });
      
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(mockElement, expect.any(Object));
      
      // Then set to null
      act(() => {
        ref(null);
      });
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe("Options Handling", () => {
    it("should use default options when none provided", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(mockElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    });

    it("should use custom options when provided", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const customOptions = {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false,
        attributeOldValue: true,
      };
      
      const { result } = renderHook(() => 
        useMutationObserverRef(callback, customOptions)
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(mockElement, customOptions);
    });

    it("should recreate observer when options change", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const initialOptions = { childList: true };
      const newOptions = { attributes: true };
      
      const { result, rerender } = renderHook(
        ({ options }) => useMutationObserverRef(callback, options),
        { initialProps: { options: initialOptions } }
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      expect(mockMutationObserverConstructor).toHaveBeenCalledTimes(1);
      expect(mockMutationObserver.observe).toHaveBeenCalledTimes(1);
      
      // Change options
      rerender({ options: newOptions });
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
      expect(mockMutationObserverConstructor).toHaveBeenCalledTimes(2);
      expect(mockMutationObserver.observe).toHaveBeenCalledTimes(2);
    });
  });

  describe("Callback Handling", () => {
    it("should call callback when mutations occur", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Get the callback that was passed to MutationObserver
      const observerCallback = mockMutationObserverConstructor.mock.calls[0][0];
      const mockMutations = [
        {
          type: 'childList',
          target: mockElement,
          addedNodes: [document.createElement('span')],
          removedNodes: [],
        },
      ] as MutationRecord[];
      const mockObserver = mockMutationObserver as MutationObserver;
      
      // Simulate mutation
      act(() => {
        observerCallback(mockMutations, mockObserver);
      });
      
      expect(callback).toHaveBeenCalledWith(mockMutations, mockObserver);
    });

    it("should update callback when callback changes", () => {
      expect.hasAssertions();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const { result, rerender } = renderHook(
        ({ callback }) => useMutationObserverRef(callback),
        { initialProps: { callback: callback1 } }
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      // Should recreate observer with new callback
      rerender({ callback: callback2 });
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
      expect(mockMutationObserverConstructor).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverConstructor).toHaveBeenLastCalledWith(callback2);
    });
  });

  describe("Cleanup", () => {
    it("should disconnect observer on unmount", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result, unmount } = renderHook(() => 
        useMutationObserverRef(callback)
      );
      
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      act(() => {
        ref(mockElement);
      });
      
      unmount();
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
    });

    it("should disconnect observer when switching elements", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      // Set first element
      act(() => {
        ref(element1);
      });
      
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(element1, expect.any(Object));
      
      // Switch to second element
      act(() => {
        ref(element2);
      });
      
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(element2, expect.any(Object));
    });
  });

  describe("Integration Test", () => {
    it("should work in a complete component scenario", async () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const [mutationCount, setMutationCount] = useState(0);
        const [lastMutationType, setLastMutationType] = useState<string>('none');
        
        const callback = jest.fn((mutations: MutationRecord[]) => {
          setMutationCount(prev => prev + mutations.length);
          if (mutations.length > 0) {
            setLastMutationType(mutations[0].type);
          }
        });
        
        const [ref] = useMutationObserverRef(callback, {
          childList: true,
          attributes: true,
        });
        
        const addChild = () => {
          const element = document.getElementById('target');
          if (element) {
            const child = document.createElement('span');
            child.textContent = 'New child';
            element.appendChild(child);
          }
        };
        
        return (
          <div>
            <div ref={ref} id="target" data-testid="target">
              Target Element
            </div>
            <div data-testid="mutation-count">
              Mutations: {mutationCount}
            </div>
            <div data-testid="mutation-type">
              Last Type: {lastMutationType}
            </div>
            <button onClick={addChild} data-testid="add-child">
              Add Child
            </button>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId("mutation-count")).toHaveTextContent("Mutations: 0");
      expect(screen.getByTestId("mutation-type")).toHaveTextContent("Last Type: none");
      
      // Simulate mutation by triggering the callback directly
      const observerCallback = mockMutationObserverConstructor.mock.calls[0][0];
      const mockMutations = [
        {
          type: 'childList',
          target: screen.getByTestId("target"),
          addedNodes: [document.createElement('span')],
          removedNodes: [],
        },
      ] as MutationRecord[];
      
      act(() => {
        observerCallback(mockMutations, mockMutationObserver as MutationObserver);
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("mutation-count")).toHaveTextContent("Mutations: 1");
        expect(screen.getByTestId("mutation-type")).toHaveTextContent("Last Type: childList");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid element changes", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result } = renderHook(() => useMutationObserverRef(callback));
      
      const [ref] = result.current;
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      // Rapid changes
      act(() => {
        ref(element1);
      });
      
      act(() => {
        ref(null);
      });
      
      act(() => {
        ref(element2);
      });
      
      act(() => {
        ref(null);
      });
      
      act(() => {
        ref(element1);
      });
      
      // Should handle without errors
      expect(mockMutationObserver.observe).toHaveBeenCalledWith(element1, expect.any(Object));
      expect(mockMutationObserver.disconnect).toHaveBeenCalled();
    });

    it("should maintain stable ref function identity", () => {
      expect.hasAssertions();
      const callback = jest.fn();
      const { result, rerender } = renderHook(() => 
        useMutationObserverRef(callback)
      );
      
      const [initialRef] = result.current;
      
      rerender();
      
      const [rerenderRef] = result.current;
      
      expect(initialRef).toBe(rerenderRef);
    });

    it("should handle MutationObserver constructor throwing", () => {
      expect.hasAssertions();
      mockMutationObserverConstructor.mockImplementation(() => {
        throw new Error("MutationObserver not supported");
      });
      
      const callback = jest.fn();
      
      expect(() => {
        renderHook(() => useMutationObserverRef(callback));
      }).not.toThrow();
      
      const { result } = renderHook(() => useMutationObserverRef(callback));
      const [ref] = result.current;
      const mockElement = document.createElement('div');
      
      expect(() => {
        act(() => {
          ref(mockElement);
        });
      }).toThrow("MutationObserver not supported");
    });
  });
});
