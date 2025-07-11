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
  configurable: true,
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
      
      // Mock navigator.locks to be undefined
      Object.defineProperty(navigator, 'locks', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      expect(result.current.isSupported).toBe(false);
      expect(result.current.isLocked).toBe(false);
      expect(result.current.waitingCount).toBe(0);

      // Restore
      Object.defineProperty(navigator, 'locks', {
        value: mockNavigatorLocks,
        writable: true,
        configurable: true,
      });
    });
  });

  describe("Resource Name Validation", () => {
    it.skip("should validate resource name as string", () => {
      expect.hasAssertions();
      
      // Valid string resource name should not throw
      expect(() => renderHook(() => useWebLocksApi("valid-resource"))).not.toThrow();
      
      // Test validation directly by trying to create hook with invalid values
      // and catching any errors
      let errorMessage = "";
      
      try {
        renderHook(() => useWebLocksApi(123 as any));
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : String(error);
      }
      expect(errorMessage).toContain("Resource name must be a string");
      
      try {
        renderHook(() => useWebLocksApi(null as any));
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : String(error);
      }
      expect(errorMessage).toContain("Resource name must be a string");
      
      try {
        renderHook(() => useWebLocksApi(undefined as any));
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : String(error);
      }
      expect(errorMessage).toContain("Resource name must be a string");
      
      try {
        renderHook(() => useWebLocksApi({} as any));
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : String(error);
      }
      expect(errorMessage).toContain("Resource name must be a string");
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
      
      // Mock the request method to call the callback with correct parameters
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callbackOrOptions: any, callback?: Function) => {
          if (typeof callbackOrOptions === 'function') {
            // Two parameter version: request(name, callback)
            return callbackOrOptions();
          } else if (callback) {
            // Three parameter version: request(name, options, callback)
            return callback();
          }
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      let acquireResult: any;
      await act(async () => {
        acquireResult = await result.current.acquire(mockCallback);
      });

      expect(mockNavigatorLocks.request).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalled();
      expect(acquireResult).toBe("success");
    });

    it("should handle lock options", async () => {
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
        expect.objectContaining({ mode: "exclusive" }),
        expect.any(Function)
      );
    });
  });

  describe("Lock State Management", () => {
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
        (name: string, callbackOrOptions: any, callback?: Function) => {
          if (typeof callbackOrOptions === 'function') {
            return callbackOrOptions();
          } else if (callback) {
            return callback();
          }
        }
      );

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await expect(result.current.acquire(mockCallback)).rejects.toThrow(
          "Lock acquisition failed"
        );
      });

      expect(result.current.error).toEqual(mockError);
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

    it("should handle unsupported API gracefully", async () => {
      expect.hasAssertions();
      
      // Mock navigator.locks to be undefined
      Object.defineProperty(navigator, 'locks', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      await act(async () => {
        await expect(result.current.acquire(() => "test")).rejects.toThrow(
          "Web Locks API is not supported"
        );
      });

      expect(result.current.error).toBeDefined();

      // Restore
      Object.defineProperty(navigator, 'locks', {
        value: mockNavigatorLocks,
        writable: true,
        configurable: true,
      });
    });
  });

  describe("Periodic Checking", () => {
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

    it("should enable periodic checks when configured", () => {
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
  });

  describe("Lock Release", () => {
    it("should release lock correctly via AbortController", () => {
      expect.hasAssertions();
      const mockAbortController = {
        abort: jest.fn(),
        signal: { aborted: false },
      };
      
      // Mock AbortController globally
      const originalAbortController = global.AbortController;
      global.AbortController = jest.fn(() => mockAbortController) as any;
      
      const { result } = renderHook(() => useWebLocksApi("test-resource"));
      
      // First, trigger the creation of an AbortController by calling acquire
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callbackOrOptions: any, callback?: Function) => {
          if (typeof callbackOrOptions === 'function') {
            return callbackOrOptions();
          } else if (callback) {
            return callback();
          }
        }
      );

      act(() => {
        result.current.acquire(() => "test");
      });

      act(() => {
        result.current.release();
      });

      expect(mockAbortController.abort).toHaveBeenCalled();
      
      // Restore
      global.AbortController = originalAbortController;
    });

    it("should clean up AbortController on unmount", () => {
      expect.hasAssertions();
      const mockAbortController = {
        abort: jest.fn(),
        signal: { aborted: false },
      };
      
      const originalAbortController = global.AbortController;
      global.AbortController = jest.fn(() => mockAbortController) as any;
      
      const { result, unmount } = renderHook(() => useWebLocksApi("test-resource"));
      
      // First, trigger the creation of an AbortController by calling acquire
      mockNavigatorLocks.request.mockImplementation(
        (name: string, callbackOrOptions: any, callback?: Function) => {
          if (typeof callbackOrOptions === 'function') {
            return callbackOrOptions();
          } else if (callback) {
            return callback();
          }
        }
      );

      act(() => {
        result.current.acquire(() => "test");
      });
      
      unmount();
      
      expect(mockAbortController.abort).toHaveBeenCalled();
      
      // Restore
      global.AbortController = originalAbortController;
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
});