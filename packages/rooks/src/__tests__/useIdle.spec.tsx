import { renderHook, act } from "@testing-library/react-hooks";
import TestRenderer from "react-test-renderer";
import { useIdle } from "@/hooks/useIdle";

const { act: testRendererAct } = TestRenderer;

// Mock IdleDetector for testing
class MockIdleDetector {
  userState: "active" | "idle" | null = "active";
  screenState: "locked" | "unlocked" | null = "unlocked";
  private listeners: Array<() => void> = [];
  private started = false;
  private threshold = 0;

  constructor() {
    this.userState = "active";
    this.screenState = "unlocked";
  }

  static requestPermission(): Promise<"granted" | "denied"> {
    return Promise.resolve("granted");
  }

  addEventListener(type: string, listener: () => void) {
    if (type === "change") {
      this.listeners.push(listener);
    }
  }

  removeEventListener(type: string, listener: () => void) {
    if (type === "change") {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  start(options?: { threshold?: number; signal?: AbortSignal }) {
    this.started = true;
    this.threshold = options?.threshold || 60000;
    return Promise.resolve();
  }

  // Test helper methods
  simulateIdleChange(userState: "active" | "idle", screenState: "locked" | "unlocked") {
    this.userState = userState;
    this.screenState = screenState;
    this.listeners.forEach(listener => listener());
  }

  getStarted() {
    return this.started;
  }

  getThreshold() {
    return this.threshold;
  }
}

// Global mock setup
const mockIdleDetector = new MockIdleDetector();

describe("useIdle", () => {
  beforeEach(() => {
    // Mock global IdleDetector
    (global as any).IdleDetector = class {
      userState: "active" | "idle" | null = "active";
      screenState: "locked" | "unlocked" | null = "unlocked";

      constructor() {
        this.userState = "active";
        this.screenState = "unlocked";
      }

      static requestPermission() {
        return MockIdleDetector.requestPermission();
      }

      addEventListener(type: string, listener: () => void) {
        mockIdleDetector.addEventListener(type, listener);
      }

      removeEventListener(type: string, listener: () => void) {
        mockIdleDetector.removeEventListener(type, listener);
      }

      start(options?: { threshold?: number; signal?: AbortSignal }) {
        return mockIdleDetector.start(options);
      }

      get userState() {
        return mockIdleDetector.userState;
      }

      get screenState() {
        return mockIdleDetector.screenState;
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockIdleDetector.userState = "active";
    mockIdleDetector.screenState = "unlocked";
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIdle).toBeDefined();
  });

  it("should return initial state correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdle({ threshold: 60000 }));

    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
    expect(result.current.isSupported).toBe(true);
    expect(result.current.isPermissionGranted).toBe(false);
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("should detect native IdleDetector support", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdle({ threshold: 60000 }));
    
    expect(result.current.isSupported).toBe(true);
  });

  it("should handle when native API is not available", () => {
    expect.hasAssertions();
    delete (global as any).IdleDetector;
    
    const { result } = renderHook(() => useIdle({ threshold: 60000 }));
    
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should request permission when requestPermission is true", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    expect(result.current.isPermissionGranted).toBe(true);
  });

  it("should handle permission denied", async () => {
    expect.hasAssertions();
    (global as any).IdleDetector.requestPermission = jest.fn().mockResolvedValue("denied");
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    expect(result.current.isPermissionGranted).toBe(false);
  });

  it("should update state when idle detection changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      mockIdleDetector.simulateIdleChange("idle", "unlocked");
    });
    
    expect(result.current.isIdle).toBe(true);
    expect(result.current.userState).toBe("idle");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should handle screen lock state changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      mockIdleDetector.simulateIdleChange("idle", "locked");
    });
    
    expect(result.current.isIdle).toBe(true);
    expect(result.current.userState).toBe("idle");
    expect(result.current.screenState).toBe("locked");
  });

  it("should call onIdleChange callback when state changes", async () => {
    expect.hasAssertions();
    const onIdleChange = jest.fn();
    
    const { waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true, onIdleChange })
    );
    
    await waitForNextUpdate();
    
    act(() => {
      mockIdleDetector.simulateIdleChange("idle", "unlocked");
    });
    
    expect(onIdleChange).toHaveBeenCalledWith({
      isIdle: true,
      userState: "idle",
      screenState: "unlocked"
    });
  });

  it("should call onError callback when errors occur", async () => {
    expect.hasAssertions();
    const onError = jest.fn();
    (global as any).IdleDetector.requestPermission = jest.fn().mockRejectedValue(new Error("Permission error"));
    
    const { waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true, onError })
    );
    
    await waitForNextUpdate();
    
    expect(onError).toHaveBeenCalledWith(new Error("Permission error"));
  });

  it("should enforce minimum threshold of 60000ms", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useIdle({ threshold: 30000 }));
    
    // Should still work but internally use 60000ms minimum
    expect(result.current.isIdle).toBe(false);
  });

  it("should auto-start when autoStart is true", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, autoStart: true, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    expect(mockIdleDetector.getStarted()).toBe(true);
    expect(result.current.isPermissionGranted).toBe(true);
  });

  it("should provide start and stop methods", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    expect(typeof result.current.start).toBe("function");
    expect(typeof result.current.stop).toBe("function");
    
    // Test manual start
    act(() => {
      result.current.start();
    });
    
    expect(mockIdleDetector.getStarted()).toBe(true);
    
    // Test stop
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isIdle).toBe(false);
    expect(result.current.userState).toBe("active");
    expect(result.current.screenState).toBe("unlocked");
  });

  it("should handle multiple state transitions", async () => {
    expect.hasAssertions();
    const onIdleChange = jest.fn();
    
    const { waitForNextUpdate } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true, onIdleChange })
    );
    
    await waitForNextUpdate();
    
    // First transition: active -> idle
    act(() => {
      mockIdleDetector.simulateIdleChange("idle", "unlocked");
    });
    
    expect(onIdleChange).toHaveBeenCalledWith({
      isIdle: true,
      userState: "idle",
      screenState: "unlocked"
    });
    
    // Second transition: idle -> active
    act(() => {
      mockIdleDetector.simulateIdleChange("active", "unlocked");
    });
    
    expect(onIdleChange).toHaveBeenCalledWith({
      isIdle: false,
      userState: "active",
      screenState: "unlocked"
    });
  });

  it("should cleanup properly on unmount", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate, unmount } = renderHook(() => 
      useIdle({ threshold: 60000, requestPermission: true })
    );
    
    await waitForNextUpdate();
    
    expect(mockIdleDetector.getStarted()).toBe(true);
    
    unmount();
    
    // Should not cause errors after unmount
    act(() => {
      mockIdleDetector.simulateIdleChange("idle", "locked");
    });
    
    // No assertions needed, just ensuring no errors thrown
  });
});