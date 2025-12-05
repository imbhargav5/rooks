import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFullscreen } from "@/hooks/useFullscreen";

// Mock fullscreen API methods
const mockRequestFullscreen = vi.fn();
const mockExitFullscreen = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Mock element for testing
const mockElement = {
  requestFullscreen: mockRequestFullscreen,
  webkitRequestFullscreen: mockRequestFullscreen,
  mozRequestFullScreen: mockRequestFullscreen,
  msRequestFullscreen: mockRequestFullscreen,
} as any;

describe("useFullscreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock document properties
    Object.defineProperty(document, 'fullscreenEnabled', {
      value: true,
      writable: true,
      configurable: true,
    });
    
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    });
    
    Object.defineProperty(document, 'exitFullscreen', {
      value: mockExitFullscreen,
      writable: true,
      configurable: true,
    });
    
    Object.defineProperty(document, 'documentElement', {
      value: mockElement,
      writable: true,
      configurable: true,
    });
    
    // Mock event listeners
    document.addEventListener = mockAddEventListener;
    document.removeEventListener = mockRemoveEventListener;
    
    // Mock promises to resolve
    mockRequestFullscreen.mockResolvedValue(undefined);
    mockExitFullscreen.mockResolvedValue(undefined);
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFullscreen).toBeDefined();
  });

  describe("Initial State", () => {
    it("should return correct initial state when fullscreen is available", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreenAvailable).toBe(true);
      expect(result.current.fullscreenElement).toBe(null);
      expect(result.current.isFullscreenEnabled).toBe(false);
      expect(result.current.enableFullscreen).toBeInstanceOf(Function);
      expect(result.current.disableFullscreen).toBeInstanceOf(Function);
      expect(result.current.toggleFullscreen).toBeInstanceOf(Function);
    });

    it("should return false for availability when fullscreen is not supported", () => {
      expect.hasAssertions();
      
      // Mock unsupported environment
      Object.defineProperty(document, 'fullscreenEnabled', {
        value: false,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreenAvailable).toBe(false);
    });
  });

  describe("Fullscreen Controls", () => {
    it("should enable fullscreen on document element by default", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.enableFullscreen();
      });
      
      expect(mockRequestFullscreen).toHaveBeenCalledWith(undefined);
    });

    it("should disable fullscreen", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.disableFullscreen();
      });
      
      expect(mockExitFullscreen).toHaveBeenCalled();
    });

    it("should toggle fullscreen when not in fullscreen", async () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.toggleFullscreen();
      });
      
      expect(mockRequestFullscreen).toHaveBeenCalled();
    });

    it("should toggle fullscreen when already in fullscreen", async () => {
      expect.hasAssertions();
      
      // Mock fullscreen element exists
      Object.defineProperty(document, 'fullscreenElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.toggleFullscreen();
      });
      
      expect(mockExitFullscreen).toHaveBeenCalled();
    });
  });

  describe("Event Handling", () => {
    it("should register event listeners on mount", () => {
      expect.hasAssertions();
      renderHook(() => useFullscreen());
      
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "fullscreenchange",
        expect.any(Function)
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "fullscreenerror",
        expect.any(Function)
      );
    });

    it("should remove event listeners on unmount", () => {
      expect.hasAssertions();
      const { unmount } = renderHook(() => useFullscreen());
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "fullscreenchange",
        expect.any(Function)
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "fullscreenerror",
        expect.any(Function)
      );
    });

    it("should call onChange callback when fullscreen changes", () => {
      expect.hasAssertions();
      const onChange = vi.fn();
      renderHook(() => useFullscreen({ onChange }));
      
      // Get the change handler that was registered
      const changeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === "fullscreenchange"
      )?.[1];
      
      expect(changeHandler).toBeDefined();
      
      // Simulate fullscreen change event
      act(() => {
        changeHandler?.(new Event("fullscreenchange"));
      });
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle requestFullscreen errors", async () => {
      expect.hasAssertions();
      const error = new Error("Fullscreen not allowed");
      mockRequestFullscreen.mockRejectedValue(error);
      
      const { result } = renderHook(() => useFullscreen());
      
      await expect(result.current.enableFullscreen()).rejects.toThrow(
        "Fullscreen not allowed"
      );
    });

    it("should handle exitFullscreen errors", async () => {
      expect.hasAssertions();
      const error = new Error("Exit fullscreen failed");
      mockExitFullscreen.mockRejectedValue(error);
      
      const { result } = renderHook(() => useFullscreen());
      
      await expect(result.current.disableFullscreen()).rejects.toThrow(
        "Exit fullscreen failed"
      );
    });

    it.skip("should throw error when fullscreen is not supported", async () => {
      expect.hasAssertions();
      
      // Create a mock element without fullscreen methods
      const unsupportedElement = {};
      
      // Mock unsupported environment
      Object.defineProperty(document, 'documentElement', {
        value: unsupportedElement,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      await expect(result.current.enableFullscreen()).rejects.toThrow(
        "Your browser does not support Fullscreen API."
      );
    });
  });

  describe("Integration Test", () => {
    it("should work in a complete component scenario", async () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const { 
          isFullscreenAvailable, 
          isFullscreenEnabled, 
          enableFullscreen, 
          disableFullscreen 
        } = useFullscreen();
        
        return (
          <div>
            <div data-testid="target">Target Element</div>
            <div data-testid="available">
              {isFullscreenAvailable ? "Available" : "Not Available"}
            </div>
            <div data-testid="enabled">
              {isFullscreenEnabled ? "Enabled" : "Disabled"}
            </div>
            <button onClick={() => enableFullscreen().catch(() => {})} data-testid="enable">
              Enable
            </button>
            <button onClick={() => disableFullscreen().catch(() => {})} data-testid="disable">
              Disable
            </button>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      expect(screen.getByTestId("available")).toHaveTextContent("Available");
      expect(screen.getByTestId("enabled")).toHaveTextContent("Disabled");
      
      // Test enable button
      const enableButton = screen.getByTestId("enable");
      fireEvent.click(enableButton);
      
      await waitFor(() => {
        expect(mockRequestFullscreen).toHaveBeenCalled();
      });
    });
  });
});
