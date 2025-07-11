import { renderHook, act } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
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

  it("should handle lock acquisition with options", async () => {
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

  it("should handle lock acquisition with steal option", async () => {
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

  it("should handle lock acquisition with ifAvailable option", async () => {
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

  it("should release lock correctly", async () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebLocksApi("test-resource"));
    
    // Mock AbortController
    const mockAbortController = {
      abort: jest.fn(),
      signal: { aborted: false },
    };
    
    global.AbortController = jest.fn(() => mockAbortController) as any;
    
    await act(async () => {
      result.current.release();
    });

    expect(mockAbortController.abort).toHaveBeenCalled();
  });

  it("should handle resource name changes", () => {
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

  it("should handle options as first parameter when no callback provided", async () => {
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

  it("should clean up AbortController on unmount", () => {
    expect.hasAssertions();
    const mockAbortController = {
      abort: jest.fn(),
      signal: { aborted: false },
    };
    
    global.AbortController = jest.fn(() => mockAbortController) as any;
    
    const { result, unmount } = renderHook(() => useWebLocksApi("test-resource"));
    
    unmount();
    
    expect(mockAbortController.abort).toHaveBeenCalled();
  });

  it("should handle when Web Locks API throws errors", async () => {
    expect.hasAssertions();
    const mockError = new Error("Web Locks API error");
    mockNavigatorLocks.request.mockRejectedValue(mockError);

    const { result } = renderHook(() => useWebLocksApi("test-resource"));
    
    await act(async () => {
      await expect(result.current.acquire(() => "success")).rejects.toThrow(
        "Web Locks API error"
      );
    });

    expect(result.current.isLocked).toBe(false);
  });

  it("should update lock state correctly when lock is held", async () => {
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

  it("should handle signal parameter in options", async () => {
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