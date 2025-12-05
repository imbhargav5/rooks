import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import React, { useLayoutEffect, useEffect } from "react";
import { useIsomorphicEffect } from "@/hooks/useIsomorphicEffect";

describe("useIsomorphicEffect", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIsomorphicEffect).toBeDefined();
  });

  describe("Browser Environment", () => {
    it("should use useLayoutEffect in browser environment", () => {
      expect.hasAssertions();
      // In jsdom environment, window should be defined
      expect(typeof window).toBe("object");
      expect(useIsomorphicEffect).toBe(useLayoutEffect);
    });

    it("should run effect synchronously like useLayoutEffect", () => {
      expect.hasAssertions();
      let effectRan = false;
      let cleanupRan = false;
      
      const { unmount } = renderHook(() => {
        useIsomorphicEffect(() => {
          effectRan = true;
          return () => {
            cleanupRan = true;
          };
        }, []);
      });
      
      // Effect should run synchronously
      expect(effectRan).toBe(true);
      expect(cleanupRan).toBe(false);
      
      unmount();
      
      // Cleanup should run on unmount
      expect(cleanupRan).toBe(true);
    });

    it("should handle dependency changes like useLayoutEffect", () => {
      expect.hasAssertions();
      let effectRunCount = 0;
      let cleanupRunCount = 0;
      
      const { rerender } = renderHook(
        ({ deps }) => {
          useIsomorphicEffect(() => {
            effectRunCount++;
            return () => {
              cleanupRunCount++;
            };
          }, deps);
        },
        { initialProps: { deps: [1] } }
      );
      
      expect(effectRunCount).toBe(1);
      expect(cleanupRunCount).toBe(0);
      
      // Change dependencies
      rerender({ deps: [2] });
      
      expect(effectRunCount).toBe(2);
      expect(cleanupRunCount).toBe(1);
      
      // Same dependencies - should not run again
      rerender({ deps: [2] });
      
      expect(effectRunCount).toBe(2);
      expect(cleanupRunCount).toBe(1);
    });

    it("should run on every render when no dependencies provided", () => {
      expect.hasAssertions();
      let effectRunCount = 0;
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(() => {
          effectRunCount++;
        });
      });
      
      expect(effectRunCount).toBe(1);
      
      rerender();
      expect(effectRunCount).toBe(2);
      
      rerender();
      expect(effectRunCount).toBe(3);
    });

    it("should run only once when empty dependency array provided", () => {
      expect.hasAssertions();
      let effectRunCount = 0;
      
      const { rerender } = renderHook(() => {
        useIsomorphicEffect(() => {
          effectRunCount++;
        }, []);
      });
      
      expect(effectRunCount).toBe(1);
      
      rerender();
      expect(effectRunCount).toBe(1);
      
      rerender();
      expect(effectRunCount).toBe(1);
    });
  });

  describe("Server Environment Simulation", () => {
    let originalWindow: typeof window;
    
    beforeEach(() => {
      // Save original window
      originalWindow = global.window;
    });
    
    afterEach(() => {
      // Restore original window
      global.window = originalWindow;
    });

    it.skip("should use useEffect in server environment", () => {
      expect.hasAssertions();
      
      // Delete window to simulate server environment
      delete (global as any).window;
      
      // Re-import the hook to get the server version
      vi.resetModules();
      const { useIsomorphicEffect: serverUseIsomorphicEffect } = require("@/hooks/useIsomorphicEffect");
      
      expect(serverUseIsomorphicEffect).toBe(useEffect);
    });
  });

  describe("Integration Test", () => {
    it.skip("should work in a complete component scenario", () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        const [layoutEffectRan, setLayoutEffectRan] = React.useState(false);
        
        useIsomorphicEffect(() => {
          setLayoutEffectRan(true);
        }, []);
        
        useIsomorphicEffect(() => {
          // This should run on every count change
          document.title = `Count: ${count}`;
        }, [count]);
        
        return (
          <div>
            <div data-testid="count">{count}</div>
            <div data-testid="effect-ran">{layoutEffectRan ? "Yes" : "No"}</div>
            <button onClick={() => setCount(c => c + 1)} data-testid="increment">
              Increment
            </button>
          </div>
        );
      };
      
      const { getByTestId } = require("@testing-library/react").render(<TestComponent />);
      
      expect(getByTestId("count")).toHaveTextContent("0");
      expect(getByTestId("effect-ran")).toHaveTextContent("Yes");
      expect(document.title).toBe("Count: 0");
      
      // Click increment button
      require("@testing-library/react").fireEvent.click(getByTestId("increment"));
      
      expect(getByTestId("count")).toHaveTextContent("1");
      expect(document.title).toBe("Count: 1");
    });
  });

  describe("Edge Cases", () => {
    it.skip("should handle effect that throws an error", () => {
      expect.hasAssertions();
      
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => {
          useIsomorphicEffect(() => {
            throw new Error("Effect error");
          }, []);
        });
      }).toThrow("Effect error");
      
      errorSpy.mockRestore();
    });

    it("should handle cleanup that throws an error", () => {
      expect.hasAssertions();
      
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      const { unmount } = renderHook(() => {
        useIsomorphicEffect(() => {
          return () => {
            throw new Error("Cleanup error");
          };
        }, []);
      });
      
      expect(() => {
        unmount();
      }).toThrow("Cleanup error");
      
      errorSpy.mockRestore();
    });

    it("should handle undefined cleanup function", () => {
      expect.hasAssertions();
      
      const { unmount } = renderHook(() => {
        useIsomorphicEffect(() => {
          // No return value (undefined cleanup)
        }, []);
      });
      
      // Should not throw when unmounting
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it("should handle complex dependency arrays", () => {
      expect.hasAssertions();
      let effectRunCount = 0;
      
      const obj1 = { a: 1 };
      const obj2 = { a: 1 };
      const obj3 = { a: 2 };
      
      const { rerender } = renderHook(
        ({ deps }) => {
          useIsomorphicEffect(() => {
            effectRunCount++;
          }, deps);
        },
        { initialProps: { deps: [obj1, "test", 123] } }
      );
      
      expect(effectRunCount).toBe(1);
      
      // Same reference - should not run
      rerender({ deps: [obj1, "test", 123] });
      expect(effectRunCount).toBe(1);
      
      // Different reference but same content - should run (shallow comparison)
      rerender({ deps: [obj2, "test", 123] });
      expect(effectRunCount).toBe(2);
      
      // Different content - should run
      rerender({ deps: [obj3, "test", 123] });
      expect(effectRunCount).toBe(3);
      
      // Different string - should run
      rerender({ deps: [obj3, "different", 123] });
      expect(effectRunCount).toBe(4);
      
      // Different number - should run
      rerender({ deps: [obj3, "different", 456] });
      expect(effectRunCount).toBe(5);
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders", () => {
      expect.hasAssertions();
      let renderCount = 0;
      let effectRunCount = 0;
      
      const TestHook = ({ value }: { value: number }) => {
        renderCount++;
        
        useIsomorphicEffect(() => {
          effectRunCount++;
        }, [value]);
        
        return null;
      };
      
      const { rerender } = renderHook(TestHook, { initialProps: { value: 1 } });
      
      expect(renderCount).toBe(1);
      expect(effectRunCount).toBe(1);
      
      // Same value - effect should not run again
      rerender({ value: 1 });
      expect(renderCount).toBe(2);
      expect(effectRunCount).toBe(1);
      
      // Different value - effect should run
      rerender({ value: 2 });
      expect(renderCount).toBe(3);
      expect(effectRunCount).toBe(2);
    });
  });
});
