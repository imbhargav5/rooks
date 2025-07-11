import { renderHook, act } from "@testing-library/react-hooks";
import { useWebLocksApi } from "@/hooks/useWebLocksApi";

// Mock the Web Locks API
const mockNavigatorLocks = {
  request: jest.fn(),
  query: jest.fn(),
};

// Mock navigator.locks
Object.defineProperty(navigator, 'locks', {
  value: mockNavigatorLocks,
  writable: true,
});

describe("useWebLocksApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigatorLocks.request.mockClear();
    mockNavigatorLocks.query.mockClear();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWebLocksApi).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should return correct initial state", () => {
      expect.hasAssertions();
      mockNavigatorLocks.query.mockResolvedValue({
        held: [],
        pending: [],
      });

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      expect(result.current.isSupported).toBe(true);
      expect(result.current.isLocked).toBe(false);
      expect(result.current.waitingCount).toBe(0);
      expect(result.current.error).toBe(null);
      expect(result.current.resourceName).toBe("test-resource");
      expect(result.current.acquire).toBeInstanceOf(Function);
      expect(result.current.release).toBeInstanceOf(Function);
      expect(result.current.query).toBeInstanceOf(Function);
    });

    it("should detect when Web Locks API is not supported", () => {
      expect.hasAssertions();
      const originalLocks = navigator.locks;
      // @ts-ignore
      delete navigator.locks;

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      expect(result.current.isSupported).toBe(false);
      expect(result.current.isLocked).toBe(false);
      expect(result.current.waitingCount).toBe(0);

      // Restore
      Object.defineProperty(navigator, 'locks', {
        value: originalLocks,
        writable: true,
      });
    });
  });

  describe("Resource Name Validation", () => {
    it("should validate resource name as string", () => {
      expect.hasAssertions();
      
      // Valid string resource name should not throw
      expect(() => renderHook(() => useWebLocksApi("valid-resource"))).not.toThrow();
      
      // Invalid resource names should throw
      expect(() => renderHook(() => useWebLocksApi(123 as any))).toThrow("Resource name must be a string");
      expect(() => renderHook(() => useWebLocksApi(null as any))).toThrow("Resource name must be a string");
      expect(() => renderHook(() => useWebLocksApi(undefined as any))).toThrow("Resource name must be a string");
      expect(() => renderHook(() => useWebLocksApi({} as any))).toThrow("Resource name must be a string");
    });

    it("should include resource name in return object", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(
        ({ resourceName }) => useWebLocksApi(resourceName),
        { initialProps: { resourceName: "resource-1" } }
      );

      expect(result.current.resourceName).toBe("resource-1");

      rerender({ resourceName: "resource-2" });
      expect(result.current.resourceName).toBe("resource-2");
    });
  });

  describe("Lock Acquisition", () => {
    it("should acquire lock successfully", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      let acquireResult: any;
      await act(async () => {
        acquireResult = await result.current.acquire(mockCallback);
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalled();
      expect(acquireResult).toBe("success");
    });

    it("should handle exclusive lock mode (default)", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, options: any, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.acquire(mockCallback, { mode: "exclusive" });
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        { mode: "exclusive" },
        expect.any(Function)
      );
    });

    it("should handle shared lock mode", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, options: any, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.acquire(mockCallback, { mode: "shared" });
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        { mode: "shared" },
        expect.any(Function)
      );
    });

    it("should handle ifAvailable option", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, options: any, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.acquire(mockCallback, { ifAvailable: true });
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        { ifAvailable: true },
        expect.any(Function)
      );
    });

    it("should handle steal option", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, options: any, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.acquire(mockCallback, { steal: true });
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        { steal: true },
        expect.any(Function)
      );
    });

    it("should handle signal parameter", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      const mockSignal = { aborted: false };
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, options: any, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.acquire(mockCallback, { signal: mockSignal });
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalledWith(
        "test-resource",
        { signal: mockSignal },
        expect.any(Function)
      );
    });
  });

  describe("Lock State Management", () => {
    it("should track lock state during acquisition", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve("success"), 100))
      );
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      // Start acquisition
      const acquirePromise = act(async () => {
        return result.current.acquire(mockCallback);
      });

      // Should show as locked during acquisition
      expect(result.current.isLocked).toBe(true);

      // Wait for completion
      await acquirePromise;
      
      expect(result.current.isLocked).toBe(false);
    });

    it("should query lock state correctly", async () => {
      expect.hasAssertions();
      const mockQueryResult = {
        held: [{ name: "test-resource", mode: "exclusive" }],
        pending: [{ name: "other-resource", mode: "exclusive" }],
      };
      
      mockNavigatorLocks.query.mockResolvedValue(mockQueryResult);

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      let queryResult: any;
      await act(async () => {
        queryResult = await result.current.query();
      });

      expect(mockNavigatorLocks.query).toHaveBeenCalled();
      expect(queryResult).toEqual(mockQueryResult);
    });

    it("should update waiting count based on query results", async () => {
      expect.hasAssertions();
      const mockQueryResult = {
        held: [],
        pending: [
          { name: "test-resource", mode: "exclusive" },
          { name: "test-resource", mode: "exclusive" },
        ],
      };
      
      mockNavigatorLocks.query.mockResolvedValue(mockQueryResult);

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.query();
      });

      expect(result.current.waitingCount).toBe(2);
    });

    it("should update isLocked when lock is held", async () => {
      expect.hasAssertions();
      const mockQueryResult = {
        held: [{ name: "test-resource", mode: "exclusive" }],
        pending: [],
      };
      
      mockNavigatorLocks.query.mockResolvedValue(mockQueryResult);

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await result.current.query();
      });

      expect(result.current.isLocked).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle lock acquisition errors", async () => {
      expect.hasAssertions();
      const mockError = new Error("Lock acquisition failed");
      const mockCallback = jest.fn().mockRejectedValue(mockError);
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await expect(result.current.acquire(mockCallback)).rejects.toThrow(
          "Lock acquisition failed"
        );
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.isLocked).toBe(false);
    });

    it("should handle query errors", async () => {
      expect.hasAssertions();
      const mockError = new Error("Query failed");
      mockNavigatorLocks.query.mockRejectedValue(mockError);

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await expect(result.current.query()).rejects.toThrow("Query failed");
      });

      expect(result.current.error).toEqual(mockError);
    });

    it("should clear error state on successful operations", async () => {
      expect.hasAssertions();
      const mockCallback = jest.fn().mockResolvedValue("success");
      
      // First cause an error
      const mockError = new Error("Initial error");
      mockNavigatorLocks.request.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      // Cause an error first
      await act(async () => {
        await expect(result.current.acquire(mockCallback)).rejects.toThrow();
      });
      
      expect(result.current.error).toEqual(mockError);
      
      // Reset mock for successful operation
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callback: Function) => {
          return callback();
        }
      );
      
      // Successful operation should clear error
      await act(async () => {
        await result.current.acquire(mockCallback);
      });

      expect(result.current.error).toBe(null);
    });

    it("should handle unsupported API gracefully", async () => {
      expect.hasAssertions();
      const originalLocks = navigator.locks;
      // @ts-ignore
      delete navigator.locks;

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await expect(result.current.acquire(() => "test")).rejects.toThrow(
          "Web Locks API is not supported"
        );
      });

      expect(result.current.error).toBeDefined();

      // Restore
      Object.defineProperty(navigator, 'locks', {
        value: originalLocks,
        writable: true,
      });
    });
  });

  describe("Periodic Checking", () => {
    it("should enable periodic checks when configured", async () => {
      expect.hasAssertions();
      jest.useFakeTimers();
      
      const mockQueryResult = {
        held: [{ name: "test-resource", mode: "exclusive" }],
        pending: [],
      };
      
      mockNavigatorLocks.query.mockResolvedValue(mockQueryResult);

      const { result } = renderHook(() => 
        useWebLocksApi("test-resource", { periodicCheck: true, checkInterval: 1000 })
      );
      
      // Initial query should be called
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      // Fast forward time
      jest.advanceTimersByTime(1000);
      
      // Query should be called again
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });

    it("should NOT enable periodic checks by default", () => {
      expect.hasAssertions();
      jest.useFakeTimers();
      
      mockNavigatorLocks.query.mockResolvedValue({
        held: [],
        pending: [],
      });

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      // Should only be called once for initial setup
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      // Fast forward time
      jest.advanceTimersByTime(5000);
      
      // Should not be called again
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      jest.useRealTimers();
    });

    it("should use custom check interval", async () => {
      expect.hasAssertions();
      jest.useFakeTimers();
      
      mockNavigatorLocks.query.mockResolvedValue({
        held: [],
        pending: [],
      });

      const { result } = renderHook(() => 
        useWebLocksApi("test-resource", { periodicCheck: true, checkInterval: 2000 })
      );
      
      // Initial query
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      // Fast forward by 1 second - should not trigger
      jest.advanceTimersByTime(1000);
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      // Fast forward by another second - should trigger
      jest.advanceTimersByTime(1000);
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });

    it("should clean up periodic checks on unmount", () => {
      expect.hasAssertions();
      jest.useFakeTimers();
      
      mockNavigatorLocks.query.mockResolvedValue({
        held: [],
        pending: [],
      });

      const { unmount } = renderHook(() => 
        useWebLocksApi("test-resource", { periodicCheck: true, checkInterval: 1000 })
      );
      
      // Unmount component
      unmount();
      
      // Clear all timers and advance time
      jest.clearAllTimers();
      jest.advanceTimersByTime(5000);
      
      // Query should not be called after unmount
      expect(mockNavigatorLocks.query).toHaveBeenCalledTimes(1);
      
      jest.useRealTimers();
    });
  });

  describe("Lock Release", () => {
    it("should release lock correctly via AbortController", async () => {
      expect.hasAssertions();
      const mockAbortController = {
        abort: jest.fn(),
        signal: { aborted: false },
      };
      
      global.AbortController = jest.fn(() => mockAbortController) as any;
      
      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        result.current.release();
      });

      expect(mockAbortController.abort).toHaveBeenCalled();
    });

    it("should clean up AbortController on unmount", () => {
      expect.hasAssertions();
      const mockAbortController = {
        abort: jest.fn(),
        signal: { aborted: false },
      };
      
      global.AbortController = jest.fn(() => mockAbortController) as any;
      
      const { unmount } = renderHook(() => useWebLocksApi("test-resource"));
      
      unmount();
      
      expect(mockAbortController.abort).toHaveBeenCalled();
    });
  });

  describe("Function Memoization", () => {
    it("should memoize functions for same resource", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(
        ({ resourceName }) => useWebLocksApi(resourceName),
        { initialProps: { resourceName: "resource-1" } }
      );

      // Functions should be memoized for same resource
      const firstAcquire = result.current.acquire;
      rerender({ resourceName: "resource-1" });
      expect(result.current.acquire).toBe(firstAcquire);

      // Functions should be different for different resource
      rerender({ resourceName: "resource-2" });
      expect(result.current.acquire).not.toBe(firstAcquire);
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle concurrent lock requests", async () => {
      expect.hasAssertions();
      const mockCallback1 = jest.fn().mockResolvedValue("result1");
      const mockCallback2 = jest.fn().mockResolvedValue("result2");
      
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callback: Function) => {
          return callback();
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      const [result1, result2] = await act(async () => {
        return Promise.all([
          result.current.acquire(mockCallback1),
          result.current.acquire(mockCallback2),
        ]);
      });

      expect(result1).toBe("result1");
      expect(result2).toBe("result2");
      expect(mockNavigatorLocks.request).toHaveBeenCalledTimes(2);
    });
  });
});
