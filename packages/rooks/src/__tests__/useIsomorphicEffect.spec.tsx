/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useIsomorphicEffect } from "@/hooks/useIsomorphicEffect";
import { useEffect, useLayoutEffect } from "react";

// Mock useLayoutEffect and useEffect to track which one is called
const mockUseEffect = jest.fn();
const mockUseLayoutEffect = jest.fn();

describe("useIsomorphicEffect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIsomorphicEffect).toBeDefined();
  });

  describe("Server-side (window undefined)", () => {
    it("should resolve to useEffect when window is undefined", () => {
      expect.hasAssertions();
      
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;
      
      // Re-import the hook to get fresh evaluation
      jest.resetModules();
      const { useIsomorphicEffect: freshUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      // useIsomorphicEffect should be useEffect in server environment
      expect(freshUseIsomorphicEffect).toBe(useEffect);
      
      // Restore window
      global.window = originalWindow;
    });

    it("should work correctly in server-side rendering", () => {
      expect.hasAssertions();
      
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;
      
      // Re-import the hook
      jest.resetModules();
      const { useIsomorphicEffect: freshUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      const callback = jest.fn();
      const cleanup = jest.fn();
      
      const { result } = renderHook(() => {
        freshUseIsomorphicEffect(() => {
          callback();
          return cleanup;
        }, []);
        return "test";
      });
      
      expect(result.current).toBe("test");
      expect(callback).toHaveBeenCalled();
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe("Client-side (window defined)", () => {
    it("should resolve to useLayoutEffect when window is defined", () => {
      expect.hasAssertions();
      
      // Ensure window is defined (default in jsdom)
      expect(typeof window).not.toBe("undefined");
      
      // Re-import the hook to get fresh evaluation
      jest.resetModules();
      const { useIsomorphicEffect: freshUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      // useIsomorphicEffect should be useLayoutEffect in browser environment
      expect(freshUseIsomorphicEffect).toBe(useLayoutEffect);
    });

    it("should work correctly in client-side rendering", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      const cleanup = jest.fn();
      
      const { result } = renderHook(() => {
        useIsomorphicEffect(() => {
          callback();
          return cleanup;
        }, []);
        return "test";
      });
      
      expect(result.current).toBe("test");
      expect(callback).toHaveBeenCalled();
    });
  });

  describe("Effect Behavior", () => {
    it("should call effect callback on mount", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      
      renderHook(() => {
        useIsomorphicEffect(callback, []);
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should call cleanup function on unmount", () => {
      expect.hasAssertions();
      
      const cleanup = jest.fn();
      const callback = jest.fn(() => cleanup);
      
      const { unmount } = renderHook(() => {
        useIsomorphicEffect(callback, []);
      });
      
      expect(callback).toHaveBeenCalled();
      expect(cleanup).not.toHaveBeenCalled();
      
      unmount();
      
      expect(cleanup).toHaveBeenCalled();
    });

    it("should re-run effect when dependencies change", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      let dependency = 0;
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(callback, [dependency]);
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      dependency = 1;
      rerender();
      
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should not re-run effect when dependencies don't change", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      const dependency = 0;
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(callback, [dependency]);
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      rerender();
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle effect without dependencies", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(callback);
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      rerender();
      
      // Should run on every render when no dependencies provided
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should handle effect with empty dependencies array", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(callback, []);
      });
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      rerender();
      
      // Should only run once with empty dependencies
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration Tests", () => {
    it("should work in a complete component scenario", () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const [count, setCount] = useState(0);
        const [effectRuns, setEffectRuns] = useState(0);
        
        useIsomorphicEffect(() => {
          setEffectRuns(prev => prev + 1);
        }, [count]);
        
        return (
          <div>
            <div data-testid="count">Count: {count}</div>
            <div data-testid="effect-runs">Effect runs: {effectRuns}</div>
            <button 
              onClick={() => setCount(prev => prev + 1)} 
              data-testid="increment"
            >
              Increment
            </button>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId("count")).toHaveTextContent("Count: 0");
      expect(screen.getByTestId("effect-runs")).toHaveTextContent("Effect runs: 1");
      
      // Increment count
      fireEvent.click(screen.getByTestId("increment"));
      
      expect(screen.getByTestId("count")).toHaveTextContent("Count: 1");
      expect(screen.getByTestId("effect-runs")).toHaveTextContent("Effect runs: 2");
    });

    it("should handle cleanup in component scenario", () => {
      expect.hasAssertions();
      
      const cleanup = jest.fn();
      
      const TestComponent = ({ shouldMount }: { shouldMount: boolean }) => {
        useIsomorphicEffect(() => {
          return cleanup;
        }, []);
        
        return shouldMount ? <div>Mounted</div> : null;
      };
      
      const { rerender } = render(<TestComponent shouldMount={true} />);
      
      expect(cleanup).not.toHaveBeenCalled();
      
      // Unmount component
      rerender(<TestComponent shouldMount={false} />);
      
      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle effect callback throwing an error", () => {
      expect.hasAssertions();
      
      const error = new Error("Effect error");
      const callback = jest.fn(() => {
        throw error;
      });
      
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => {
          useIsomorphicEffect(callback, []);
        });
      }).toThrow(error);
      
      consoleSpy.mockRestore();
    });

    it("should handle cleanup function throwing an error", () => {
      expect.hasAssertions();
      
      const error = new Error("Cleanup error");
      const cleanup = jest.fn(() => {
        throw error;
      });
      const callback = jest.fn(() => cleanup);
      
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { unmount } = renderHook(() => {
        useIsomorphicEffect(callback, []);
      });
      
      expect(() => {
        unmount();
      }).toThrow(error);
      
      consoleSpy.mockRestore();
    });

    it("should handle complex dependencies", () => {
      expect.hasAssertions();
      
      const callback = jest.fn();
      const obj1 = { a: 1 };
      const obj2 = { a: 1 };
      const obj3 = { a: 2 };
      
      const { rerender } = renderHook(
        ({ deps }) => {
          useIsomorphicEffect(callback, deps);
        },
        { initialProps: { deps: [obj1] } }
      );
      
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Same reference, should not re-run
      rerender({ deps: [obj1] });
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Different reference but same value, should re-run (shallow comparison)
      rerender({ deps: [obj2] });
      expect(callback).toHaveBeenCalledTimes(2);
      
      // Different value, should re-run
      rerender({ deps: [obj3] });
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe("SSR Compatibility", () => {
    it("should not cause hydration mismatches", () => {
      expect.hasAssertions();
      
      // This test simulates the SSR -> hydration process
      const callback = jest.fn();
      
      // First render (simulating server-side)
      const originalWindow = global.window;
      delete (global as any).window;
      
      jest.resetModules();
      const { useIsomorphicEffect: ssrUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      const { result: ssrResult } = renderHook(() => {
        ssrUseIsomorphicEffect(callback, []);
        return "rendered";
      });
      
      expect(ssrResult.current).toBe("rendered");
      const ssrCallCount = callback.mock.calls.length;
      
      // Restore window (simulating hydration)
      global.window = originalWindow;
      callback.mockClear();
      
      jest.resetModules();
      const { useIsomorphicEffect: clientUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      const { result: clientResult } = renderHook(() => {
        clientUseIsomorphicEffect(callback, []);
        return "rendered";
      });
      
      expect(clientResult.current).toBe("rendered");
      
      // Both should work without throwing errors
      expect(ssrResult.current).toBe(clientResult.current);
    });
  });
});
