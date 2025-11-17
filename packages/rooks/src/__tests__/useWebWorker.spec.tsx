/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useWebWorker } from "@/hooks/useWebWorker";

describe("useWebWorker", () => {
  let mockWorker: any;
  let mockWorkerConstructor: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
      onerror: null,
    };

    mockWorkerConstructor = jest.fn(() => mockWorker);

    Object.defineProperty(window, "Worker", {
      writable: true,
      configurable: true,
      value: mockWorkerConstructor,
    });

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWebWorker).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.postMessage).toBe("function");
    expect(typeof result.current.terminate).toBe("function");
  });

  it("should detect when Web Workers are not supported", () => {
    expect.hasAssertions();
    const originalWorker = window.Worker;
    // @ts-ignore
    delete window.Worker;

    const { result } = renderHook(() => useWebWorker("/worker.js"));

    expect(result.current.isSupported).toBe(false);

    // Restore
    window.Worker = originalWorker;
  });

  it("should create a worker on mount", () => {
    expect.hasAssertions();
    renderHook(() => useWebWorker("/worker.js"));

    expect(mockWorkerConstructor).toHaveBeenCalledWith("/worker.js");
  });

  it("should post message to worker", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      result.current.postMessage({ type: "test", value: 123 });
    });

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      type: "test",
      value: 123,
    });
    expect(result.current.status).toBe("running");
  });

  it("should receive message from worker", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker<number>("/worker.js"));

    act(() => {
      mockWorker.onmessage({ data: 42 });
    });

    expect(result.current.data).toBe(42);
    expect(result.current.status).toBe("success");
    expect(result.current.error).toBe(null);
  });

  it("should handle worker errors", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      mockWorker.onerror({ message: "Worker error occurred" });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Worker error occurred");
    expect(result.current.status).toBe("error");
  });

  it("should handle worker errors without message", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      mockWorker.onerror({});
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Worker error");
    expect(result.current.status).toBe("error");
  });

  it("should terminate worker", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      result.current.terminate();
    });

    expect(mockWorker.terminate).toHaveBeenCalled();
    expect(result.current.status).toBe("terminated");
  });

  it("should not post message without support", () => {
    expect.hasAssertions();
    const originalWorker = window.Worker;
    // @ts-ignore
    delete window.Worker;

    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      result.current.postMessage({ test: "data" });
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Web Workers are not supported"
    );

    // Restore
    window.Worker = originalWorker;
  });

  it("should warn when posting to terminated worker", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    act(() => {
      result.current.terminate();
    });

    act(() => {
      result.current.postMessage({ test: "data" });
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Cannot post message to terminated worker"
    );
  });

  it("should handle worker creation error", () => {
    expect.hasAssertions();
    mockWorkerConstructor.mockImplementation(() => {
      throw new Error("Failed to create worker");
    });

    const { result } = renderHook(() => useWebWorker("/worker.js"));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to create worker");
    expect(result.current.status).toBe("error");
  });

  it("should handle worker creation error with non-Error", () => {
    expect.hasAssertions();
    mockWorkerConstructor.mockImplementation(() => {
      throw "String error";
    });

    const { result } = renderHook(() => useWebWorker("/worker.js"));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to create worker");
    expect(result.current.status).toBe("error");
  });

  it("should handle postMessage error", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    mockWorker.postMessage.mockImplementation(() => {
      throw new Error("Failed to post message");
    });

    act(() => {
      result.current.postMessage({ test: "data" });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to post message");
    expect(result.current.status).toBe("error");
  });

  it("should handle postMessage error with non-Error", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    mockWorker.postMessage.mockImplementation(() => {
      throw "String error";
    });

    act(() => {
      result.current.postMessage({ test: "data" });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to post message");
    expect(result.current.status).toBe("error");
  });

  it("should clear error on successful message", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    // First, cause an error
    act(() => {
      mockWorker.onerror({ message: "Error" });
    });

    expect(result.current.error).not.toBe(null);

    // Then, post a message successfully
    act(() => {
      result.current.postMessage({ test: "data" });
    });

    expect(result.current.error).toBe(null);
    expect(result.current.status).toBe("running");
  });

  it("should clear error on successful worker response", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker("/worker.js"));

    // First, cause an error
    act(() => {
      mockWorker.onerror({ message: "Error" });
    });

    expect(result.current.error).not.toBe(null);

    // Then, receive a successful message
    act(() => {
      mockWorker.onmessage({ data: "success" });
    });

    expect(result.current.error).toBe(null);
    expect(result.current.status).toBe("success");
  });

  it("should terminate worker on unmount", () => {
    expect.hasAssertions();
    const { unmount } = renderHook(() => useWebWorker("/worker.js"));

    unmount();

    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it("should not create worker with empty URL", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useWebWorker(""));

    expect(result.current.status).toBe("idle");
    expect(mockWorkerConstructor).not.toHaveBeenCalled();
  });

  it("should recreate worker when URL changes", () => {
    expect.hasAssertions();
    const { rerender } = renderHook(
      ({ url }) => useWebWorker(url),
      { initialProps: { url: "/worker1.js" } }
    );

    expect(mockWorkerConstructor).toHaveBeenCalledWith("/worker1.js");

    const firstWorker = mockWorker;

    // Create new mock for new worker
    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
      onerror: null,
    };
    mockWorkerConstructor.mockReturnValue(mockWorker);

    rerender({ url: "/worker2.js" });

    expect(firstWorker.terminate).toHaveBeenCalled();
    expect(mockWorkerConstructor).toHaveBeenCalledWith("/worker2.js");
  });
});
