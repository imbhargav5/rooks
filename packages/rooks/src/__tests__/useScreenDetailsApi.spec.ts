import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { useScreenDetailsApi } from "@/hooks/useScreenDetailsApi";

const { act } = TestRenderer;

// Mock the Window Management API
const mockScreenDetails = {
  screens: [
    {
      availLeft: 0,
      availTop: 0,
      availWidth: 1920,
      availHeight: 1080,
      left: 0,
      top: 0,
      width: 1920,
      height: 1080,
      colorDepth: 24,
      pixelDepth: 24,
      devicePixelRatio: 1,
      isPrimary: true,
      isInternal: true,
      label: "Built-in Display",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    {
      availLeft: 1920,
      availTop: 0,
      availWidth: 1440,
      availHeight: 900,
      left: 1920,
      top: 0,
      width: 1440,
      height: 900,
      colorDepth: 24,
      pixelDepth: 24,
      devicePixelRatio: 1,
      isPrimary: false,
      isInternal: false,
      label: "External Display",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  ],
  currentScreen: {
    availLeft: 0,
    availTop: 0,
    availWidth: 1920,
    availHeight: 1080,
    left: 0,
    top: 0,
    width: 1920,
    height: 1080,
    colorDepth: 24,
    pixelDepth: 24,
    devicePixelRatio: 1,
    isPrimary: true,
    isInternal: true,
    label: "Built-in Display",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockPermissionsQuery = vi.fn();
const mockGetScreenDetails = vi.fn();

// Mock global objects
const originalGetScreenDetails = (window as any).getScreenDetails;

// Replace global window and navigator
Object.defineProperty(window, 'getScreenDetails', {
  value: mockGetScreenDetails,
  writable: true,
  configurable: true,
});

Object.defineProperty(navigator, 'permissions', {
  value: { query: mockPermissionsQuery },
  writable: true,
  configurable: true,
});

describe("useScreenDetailsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Ensure window.getScreenDetails is properly mocked before each test
    // Delete the property first, then redefine it
    delete (window as any).getScreenDetails;
    Object.defineProperty(window, 'getScreenDetails', {
      value: mockGetScreenDetails,
      writable: true,
      configurable: true,
    });
    
    // Reset default mocks
    mockGetScreenDetails.mockResolvedValue(mockScreenDetails);
    mockPermissionsQuery.mockResolvedValue({ 
      state: 'granted',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useScreenDetailsApi).toBeDefined();
  });

  it("should initialize with correct default values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useScreenDetailsApi());

    expect(result.current.screens).toEqual([]);
    expect(result.current.currentScreen).toBeNull();
    expect(result.current.isSupported).toBe(true); // Should be true since we mocked it
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.requestPermission).toBe("function");
    expect(typeof result.current.refresh).toBe("function");
  });

  it("should detect API support correctly", () => {
    expect.hasAssertions();
    
    // Test when API is supported
    Object.defineProperty(window, 'getScreenDetails', {
      value: mockGetScreenDetails,
      writable: true,
      configurable: true,
    });
    
    const { result } = renderHook(() => useScreenDetailsApi());
    expect(result.current.isSupported).toBe(true);
  });

  it("should detect API not supported", () => {
    expect.hasAssertions();
    
    // Test when API is not supported
    delete (window as any).getScreenDetails;
    Object.defineProperty(window, 'getScreenDetails', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    
    const { result } = renderHook(() => useScreenDetailsApi());
    expect(result.current.isSupported).toBe(false);
    
    // Clean up and restore for next test
    delete (window as any).getScreenDetails;
    Object.defineProperty(window, 'getScreenDetails', {
      value: mockGetScreenDetails,
      writable: true,
      configurable: true,
    });
  });

  it("should handle permission request successfully", async () => {
    expect.hasAssertions();
    
    mockPermissionsQuery.mockResolvedValue({ 
      state: 'prompt',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockPermissionsQuery).toHaveBeenCalledWith({ name: 'window-management' });
    expect(result.current.hasPermission).toBe(true);
  });

  it("should handle permission denied", async () => {
    expect.hasAssertions();
    
    mockPermissionsQuery.mockResolvedValue({ 
      state: 'denied',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.error).toBe("Permission denied for window-management");
  });

  it("should handle permission request failure", async () => {
    expect.hasAssertions();
    
    const error = new Error("Permission request failed");
    mockPermissionsQuery.mockRejectedValue(error);

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.error).toBe("Permission request failed");
  });

  it("should fetch screen details successfully", async () => {
    expect.hasAssertions();
    
    mockPermissionsQuery.mockResolvedValue({ 
      state: 'granted',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.screens).toEqual(mockScreenDetails.screens);
    expect(result.current.currentScreen).toEqual(mockScreenDetails.currentScreen);
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle screen details API failure", async () => {
    expect.hasAssertions();
    
    const error = new Error("Screen details API failed");
    mockGetScreenDetails.mockRejectedValue(error);
    mockPermissionsQuery.mockResolvedValue({ 
      state: 'granted',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.error).toBe("Screen details API failed");
  });

  it("should handle screens change event", async () => {
    expect.hasAssertions();
    
    let screensChangeHandler: (event: Event) => void;
    mockScreenDetails.addEventListener.mockImplementation((event, handler) => {
      if (event === 'screenschange') {
        screensChangeHandler = handler;
      }
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Initial state
    expect(result.current.screens).toHaveLength(2);

    // Mock updated screen details
    const updatedScreenDetails = {
      ...mockScreenDetails,
      screens: [...mockScreenDetails.screens, {
        availLeft: 3360,
        availTop: 0,
        availWidth: 1920,
        availHeight: 1080,
        left: 3360,
        top: 0,
        width: 1920,
        height: 1080,
        colorDepth: 24,
        pixelDepth: 24,
        devicePixelRatio: 1,
        isPrimary: false,
        isInternal: false,
        label: "Third Display",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }],
    };

    // Update mock to return new screen details
    mockGetScreenDetails.mockResolvedValue(updatedScreenDetails);

    // Simulate screens change event
    act(() => {
      screensChangeHandler(new Event('screenschange'));
    });

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.screens).toHaveLength(3);
  });

  it("should handle current screen change event", async () => {
    expect.hasAssertions();
    
    let currentScreenChangeHandler: (event: Event) => void;
    mockScreenDetails.addEventListener.mockImplementation((event, handler) => {
      if (event === 'currentscreenchange') {
        currentScreenChangeHandler = handler;
      }
    });

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Initial state
    expect(result.current.currentScreen?.isPrimary).toBe(true);

    // Mock updated current screen
    const updatedScreenDetails = {
      ...mockScreenDetails,
      currentScreen: mockScreenDetails.screens[1], // Switch to external display
    };

    // Update mock to return new current screen
    mockGetScreenDetails.mockResolvedValue(updatedScreenDetails);

    // Simulate current screen change event
    act(() => {
      currentScreenChangeHandler(new Event('currentscreenchange'));
    });

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.currentScreen?.isPrimary).toBe(false);
    expect(result.current.currentScreen?.label).toBe("External Display");
  });

  it("should manually refresh screen details", async () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Initial state
    expect(result.current.screens).toHaveLength(2);

    // Mock updated screen details
    const updatedScreenDetails = {
      ...mockScreenDetails,
      screens: [mockScreenDetails.screens[0]], // Remove second screen
    };

    mockGetScreenDetails.mockResolvedValue(updatedScreenDetails);

    // Manual refresh
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.screens).toHaveLength(1);
    expect(mockGetScreenDetails).toHaveBeenCalledTimes(2); // Once for initial, once for refresh
  });

  it("should handle refresh error", async () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Mock error on refresh
    const error = new Error("Refresh failed");
    mockGetScreenDetails.mockRejectedValue(error);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.error).toBe("Refresh failed");
  });

  it("should cleanup event listeners on unmount", async () => {
    expect.hasAssertions();
    
    const { result, unmount } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Verify event listeners were added
    expect(mockScreenDetails.addEventListener).toHaveBeenCalledWith(
      'screenschange',
      expect.any(Function)
    );
    expect(mockScreenDetails.addEventListener).toHaveBeenCalledWith(
      'currentscreenchange',
      expect.any(Function)
    );

    // Unmount the hook
    unmount();

    // Verify event listeners were removed
    expect(mockScreenDetails.removeEventListener).toHaveBeenCalledWith(
      'screenschange',
      expect.any(Function)
    );
    expect(mockScreenDetails.removeEventListener).toHaveBeenCalledWith(
      'currentscreenchange',
      expect.any(Function)
    );
  });

  it("should handle loading state correctly", async () => {
    expect.hasAssertions();
    
    let resolveGetScreenDetails: (value: any) => void;
    const screenDetailsPromise = new Promise(resolve => {
      resolveGetScreenDetails = resolve;
    });
    
    mockGetScreenDetails.mockReturnValue(screenDetailsPromise);

    const { result } = renderHook(() => useScreenDetailsApi());

    // Start permission request
    act(() => {
      result.current.requestPermission();
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolveGetScreenDetails(mockScreenDetails);
      await screenDetailsPromise;
    });

    // Should not be loading anymore
    expect(result.current.isLoading).toBe(false);
  });

  it("should provide computed properties for external screens", async () => {
    expect.hasAssertions();
    
    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.screens).toHaveLength(2);
    expect(result.current.primaryScreen).toEqual(mockScreenDetails.screens[0]);
    expect(result.current.externalScreens).toHaveLength(1);
    expect(result.current.externalScreens[0]).toEqual(mockScreenDetails.screens[1]);
  });

  it("should handle single screen setup", async () => {
    expect.hasAssertions();
    
    const singleScreenDetails = {
      ...mockScreenDetails,
      screens: [mockScreenDetails.screens[0]],
    };
    
    mockGetScreenDetails.mockResolvedValue(singleScreenDetails);

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.screens).toHaveLength(1);
    expect(result.current.primaryScreen).toEqual(singleScreenDetails.screens[0]);
    expect(result.current.externalScreens).toHaveLength(0);
  });

  it("should handle options parameter", () => {
    expect.hasAssertions();
    
    const options = {
      requestOnMount: false,
      autoRefresh: false,
    };

    const { result } = renderHook(() => useScreenDetailsApi(options));

    // With requestOnMount false, should not have permission initially
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.screens).toHaveLength(0);
  });

  it("should auto-request permission on mount when requestOnMount is true", async () => {
    expect.hasAssertions();
    
    const options = {
      requestOnMount: true,
    };

    await act(async () => {
      renderHook(() => useScreenDetailsApi(options));
    });

    // Should have called permission query automatically
    expect(mockPermissionsQuery).toHaveBeenCalledWith({ name: 'window-management' });
  });

  it("should handle permission state changes", async () => {
    expect.hasAssertions();
    
    let permissionChangeHandler: (event: Event) => void;
    const mockPermissionStatus = {
      state: 'granted',
      onchange: null,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') {
          permissionChangeHandler = handler;
        }
      }),
      removeEventListener: vi.fn(),
    };

    mockPermissionsQuery.mockResolvedValue(mockPermissionStatus);

    const { result } = renderHook(() => useScreenDetailsApi());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.hasPermission).toBe(true);

    // Simulate permission being revoked
    mockPermissionStatus.state = 'denied';
    
    act(() => {
      permissionChangeHandler(new Event('change'));
    });

    expect(result.current.hasPermission).toBe(false);
  });
});
