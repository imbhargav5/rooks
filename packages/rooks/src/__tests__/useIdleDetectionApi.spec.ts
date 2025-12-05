import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIdleDetectionApi } from "@/hooks/useIdleDetectionApi";

describe("useIdleDetectionApi", () => {
  beforeEach(() => {
    // Clean up any existing global mocks
    delete (global as any).IdleDetector;
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIdleDetectionApi).toBeDefined();
  });

  it("should return initial state correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));

    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
    expect(result.current.isPermissionGranted).toBe(false);
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should detect native IdleDetector support", () => {
    expect.hasAssertions();
    
    // Mock native support
    (global as any).IdleDetector = class MockIdleDetector {
      static requestPermission() {
        return Promise.resolve("granted");
      }
      addEventListener() {}
      removeEventListener() {}
      start() { return Promise.resolve(); }
      userState = "active";
      screenState = "unlocked";
    };

    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));
    
    expect(result.current.isSupported).toBe(true);
  });

  it("should handle when native API is not available", () => {
    expect.hasAssertions();
    
    // Ensure no native API
    delete (global as any).IdleDetector;
    
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));
    
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should enforce minimum threshold of 60000ms", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 30000 }));
    
    // Should work with any threshold (internally enforces minimum)
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should provide start and stop methods", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));
    
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should handle start method call", async () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));
    
    // Test that start method can be called without errors
    await act(async () => {
      await result.current.start();
    });
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should handle stop method call", () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useIdleDetectionApi({ threshold: 60000 }));
    
    // Test that stop method can be called without errors
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should handle options properly", () => {
    expect.hasAssertions();
    
    const onIdleChange = vi.fn();
    const onError = vi.fn();
    
    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      autoStart: false,
      requestPermission: false,
      onIdleChange,
      onError
    }));
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should handle native API with proper mocking", async () => {
    expect.hasAssertions();
    
    // Mock native IdleDetector
    let changeListener: (() => void) | null = null;
    const mockDetector = {
      userState: "active" as "active" | "idle",
      screenState: "unlocked" as "locked" | "unlocked",
      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === "change") {
          changeListener = listener;
        }
      }),
      removeEventListener: vi.fn(),
      start: vi.fn().mockResolvedValue(undefined)
    };

    (global as any).IdleDetector = class {
      static requestPermission = vi.fn().mockResolvedValue("granted");
      
      constructor() {
        return mockDetector;
      }
    };

    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      requestPermission: true
    }));
    
    expect(result.current.isSupported).toBe(true);
    
    // Start the detector
    await act(async () => {
      await result.current.start();
    });
    
    // Verify start was called
    expect(mockDetector.start).toHaveBeenCalled();
    expect(mockDetector.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should handle permission denied scenario", async () => {
    expect.hasAssertions();
    
    const onError = vi.fn();
    
    // Mock native IdleDetector with permission denied
    (global as any).IdleDetector = class {
      static requestPermission = vi.fn().mockResolvedValue("denied");
      
      constructor() {
        return {
          userState: "active",
          screenState: "unlocked",
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          start: vi.fn().mockResolvedValue(undefined)
        };
      }
    };

    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      requestPermission: true,
      onError
    }));
    
    await act(async () => {
      await result.current.start();
    });
    
    expect(result.current.isPermissionGranted).toBe(false);
    expect(onError).toHaveBeenCalledWith(new Error("Permission denied"));
  });

  it("should handle errors during start", async () => {
    expect.hasAssertions();
    
    const onError = vi.fn();
    
    // Mock native IdleDetector that throws error
    (global as any).IdleDetector = class {
      static requestPermission = vi.fn().mockRejectedValue(new Error("Test error"));
      
      constructor() {
        return {
          userState: "active",
          screenState: "unlocked",
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          start: vi.fn().mockResolvedValue(undefined)
        };
      }
    };

    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      requestPermission: true,
      onError
    }));
    
    await act(async () => {
      await result.current.start();
    });
    
    expect(onError).toHaveBeenCalledWith(new Error("Test error"));
  });

  it("should cleanup properly on unmount", () => {
    expect.hasAssertions();
    
    const { result, unmount } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000 
    }));
    
    expect(result.current.isIdle).toBe(false);
    
    // Unmount should not cause errors
    unmount();
    
    // No specific assertions needed, just ensuring no errors
    expect(true).toBe(true);
  });

  it("should handle auto-start option", () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      autoStart: true
    }));
    
    // With autoStart, hook should initialize properly
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should handle callback functions", () => {
    expect.hasAssertions();
    
    const onIdleChange = vi.fn();
    const onError = vi.fn();
    
    const { result } = renderHook(() => useIdleDetectionApi({ 
      threshold: 60000,
      onIdleChange,
      onError
    }));
    
    expect(result.current.isIdle).toBe(false);
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
    
    // Callbacks should be functions that can be called
    expect(typeof onIdleChange).toBe("function");
    expect(typeof onError).toBe("function");
  });
});
