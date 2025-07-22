/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import React, { useRef } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFullscreen } from "@/hooks/useFullscreen";

// Mock fullscreen API methods
const mockRequestFullscreen = jest.fn();
const mockExitFullscreen = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock element for testing
const mockElement = {
  requestFullscreen: mockRequestFullscreen,
  webkitRequestFullscreen: mockRequestFullscreen,
  mozRequestFullScreen: mockRequestFullscreen,
  msRequestFullscreen: mockRequestFullscreen,
} as any;

describe("useFullscreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
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

    it("should enable fullscreen with custom target element", async () => {
      expect.hasAssertions();
      const targetRef = { current: mockElement };
      const { result } = renderHook(() => useFullscreen({ target: targetRef }));
      
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

    it("should pass options to requestFullscreen", async () => {
      expect.hasAssertions();
      const options = { navigationUI: "hide" } as FullscreenOptions;
      const { result } = renderHook(() => 
        useFullscreen({ requestFullScreenOptions: options })
      );
      
      await act(async () => {
        await result.current.enableFullscreen();
      });
      
      expect(mockRequestFullscreen).toHaveBeenCalledWith(options);
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
      const onChange = jest.fn();
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

    it("should call onError callback when fullscreen error occurs", () => {
      expect.hasAssertions();
      const onError = jest.fn();
      renderHook(() => useFullscreen({ onError }));
      
      // Get the error handler that was registered
      const errorHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === "fullscreenerror"
      )?.[1];
      
      expect(errorHandler).toBeDefined();
      
      // Simulate fullscreen error event
      act(() => {
        errorHandler?.(new Event("fullscreenerror"));
      });
      
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("Cross-browser Support", () => {
    it("should work with webkit prefix", async () => {
      expect.hasAssertions();
      
      // Mock webkit-prefixed API
      delete (document as any).fullscreenEnabled;
      delete (document as any).exitFullscreen;
      
      Object.defineProperty(document, 'webkitFullscreenEnabled', {
        value: true,
        writable: true,
        configurable: true,
      });
      
      Object.defineProperty(document, 'webkitExitFullscreen', {
        value: mockExitFullscreen,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreenAvailable).toBe(true);
      
      await act(async () => {
        await result.current.disableFullscreen();
      });
      
      expect(mockExitFullscreen).toHaveBeenCalled();
    });

    it("should work with moz prefix", async () => {
      expect.hasAssertions();
      
      // Mock moz-prefixed API
      delete (document as any).fullscreenEnabled;
      delete (document as any).exitFullscreen;
      
      Object.defineProperty(document, 'mozFullScreenEnabled', {
        value: true,
        writable: true,
        configurable: true,
      });
      
      Object.defineProperty(document, 'mozCancelFullScreen', {
        value: mockExitFullscreen,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreenAvailable).toBe(true);
    });

    it("should work with ms prefix", async () => {
      expect.hasAssertions();
      
      // Mock ms-prefixed API
      delete (document as any).fullscreenEnabled;
      delete (document as any).exitFullscreen;
      
      Object.defineProperty(document, 'msFullscreenEnabled', {
        value: true,
        writable: true,
        configurable: true,
      });
      
      Object.defineProperty(document, 'msExitFullscreen', {
        value: mockExitFullscreen,
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreenAvailable).toBe(true);
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

    it("should throw error when fullscreen is not supported", async () => {
      expect.hasAssertions();
      
      // Mock unsupported environment
      Object.defineProperty(document, 'documentElement', {
        value: {},
        writable: true,
        configurable: true,
      });
      
      const { result } = renderHook(() => useFullscreen());
      
      await expect(result.current.enableFullscreen()).rejects.toThrow(
        "Your browser does not support Fullscreen API."
      );
    });
  });

  describe("State Updates", () => {
    it("should update fullscreen state when entering fullscreen", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      // Mock fullscreen element
      Object.defineProperty(document, 'fullscreenElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });
      
      // Get the change handler and trigger it
      const changeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === "fullscreenchange"
      )?.[1];
      
      act(() => {
        changeHandler?.(new Event("fullscreenchange"));
      });
      
      expect(result.current.fullscreenElement).toBe(mockElement);
      expect(result.current.isFullscreenEnabled).toBe(true);
    });

    it("should update fullscreen state when exiting fullscreen", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useFullscreen());
      
      // First enter fullscreen
      Object.defineProperty(document, 'fullscreenElement', {
        value: mockElement,
        writable: true,
        configurable: true,
      });
      
      const changeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === "fullscreenchange"
      )?.[1];
      
      act(() => {
        changeHandler?.(new Event("fullscreenchange"));
      });
      
      expect(result.current.isFullscreenEnabled).toBe(true);
      
      // Then exit fullscreen
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        writable: true,
        configurable: true,
      });
      
      act(() => {
        changeHandler?.(new Event("fullscreenchange"));
      });
      
      expect(result.current.fullscreenElement).toBe(null);
      expect(result.current.isFullscreenEnabled).toBe(false);
    });
  });

  describe("Integration Test", () => {
    it("should work in a complete component scenario", async () => {
      expect.hasAssertions();
      
      const TestComponent = () => {
        const divRef = useRef<HTMLDivElement>(null);
        const { 
          isFullscreenAvailable, 
          isFullscreenEnabled, 
          enableFullscreen, 
          disableFullscreen 
        } = useFullscreen({ target: divRef });
        
        return (
          <div>
            <div ref={divRef} data-testid="target">Target Element</div>
            <div data-testid="available">
              {isFullscreenAvailable ? "Available" : "Not Available"}
            </div>
            <div data-testid="enabled">
              {isFullscreenEnabled ? "Enabled" : "Disabled"}
            </div>
            <button onClick={enableFullscreen} data-testid="enable">
              Enable
            </button>
            <button onClick={disableFullscreen} data-testid="disable">
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
