/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  screen,
  render,
  waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNavigatorPermissions } from "@/hooks/useNavigatorPermissions";

// Mock the navigator.permissions API
const mockPermissions = {
  query: jest.fn(),
};

const mockPermissionStatus = {
  state: 'prompt' as PermissionState,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  onchange: null,
};

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    permissions: mockPermissions,
  },
  writable: true,
});

describe("useNavigatorPermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPermissionStatus.state = 'prompt';
    mockPermissions.query.mockResolvedValue(mockPermissionStatus);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should be defined", () => {
    expect(useNavigatorPermissions).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should initialize with correct default values", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      expect(result.current.status).toBe(null);
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSupported).toBe(true);
      expect(result.current.lastUpdated).toBe(null);
    });

    it("should check permission status on mount", async () => {
      mockPermissionStatus.state = 'granted';
      
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' });
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(false);
      expect(result.current.lastUpdated).toBeInstanceOf(Date);
    });

    it("should handle 'denied' permission status", async () => {
      mockPermissionStatus.state = 'denied';
      
      const { result } = renderHook(() => 
        useNavigatorPermissions('camera')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe('denied');
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(true);
      expect(result.current.isPrompt).toBe(false);
    });

    it("should handle 'prompt' permission status", async () => {
      mockPermissionStatus.state = 'prompt';
      
      const { result } = renderHook(() => 
        useNavigatorPermissions('microphone')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe('prompt');
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(true);
    });
  });

  describe("Permission Request", () => {
    it("should request permission successfully", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockPermissionStatus.state = 'granted';
      
      await act(async () => {
        const status = await result.current.requestPermission();
        expect(status).toBe('granted');
      });

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle permission denial", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('notifications')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      mockPermissionStatus.state = 'denied';
      
      await act(async () => {
        const status = await result.current.requestPermission();
        expect(status).toBe('denied');
      });

      expect(result.current.status).toBe('denied');
      expect(result.current.isDenied).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should set loading state during request", async () => {
      let resolveQuery: (value: any) => void;
      mockPermissions.query.mockImplementation(() => 
        new Promise(resolve => {
          resolveQuery = resolve;
        })
      );

      const { result } = renderHook(() => 
        useNavigatorPermissions('camera')
      );

      expect(result.current.isLoading).toBe(true);

      act(() => {
        resolveQuery(mockPermissionStatus);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Callback Handling", () => {
    it("should call onGranted when permission is granted", async () => {
      const onGranted = jest.fn();
      const onStatusChange = jest.fn();
      
      mockPermissionStatus.state = 'granted';
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          onGranted,
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onGranted).toHaveBeenCalledTimes(1);
      expect(onStatusChange).toHaveBeenCalledWith('granted');
    });

    it("should call onDenied when permission is denied", async () => {
      const onDenied = jest.fn();
      const onStatusChange = jest.fn();
      
      mockPermissionStatus.state = 'denied';
      
      renderHook(() => 
        useNavigatorPermissions('camera', {
          onDenied,
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onDenied).toHaveBeenCalledTimes(1);
      expect(onStatusChange).toHaveBeenCalledWith('denied');
    });

    it("should call onPrompt when permission is prompt", async () => {
      const onPrompt = jest.fn();
      const onStatusChange = jest.fn();
      
      mockPermissionStatus.state = 'prompt';
      
      renderHook(() => 
        useNavigatorPermissions('microphone', {
          onPrompt,
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onPrompt).toHaveBeenCalledTimes(1);
      expect(onStatusChange).toHaveBeenCalledWith('prompt');
    });

    it("should only call onStatusChange when status actually changes", async () => {
      const onStatusChange = jest.fn();
      
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation', {
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onStatusChange).toHaveBeenCalledTimes(1);
      expect(onStatusChange).toHaveBeenCalledWith('prompt');

      // Refresh with same status - should not call onStatusChange
      await act(async () => {
        await result.current.refresh();
      });

      expect(onStatusChange).toHaveBeenCalledTimes(1);
    });

    it("should clean up callbacks on unmount", async () => {
      const onStatusChange = jest.fn();
      
      const { unmount } = renderHook(() => 
        useNavigatorPermissions('geolocation', {
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissionStatus.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      unmount();

      // Should not call callbacks after unmount
      expect(onStatusChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("should handle unsupported permissions API", async () => {
      const onError = jest.fn();
      
      // Mock unsupported API
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          onError
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'NOT_SUPPORTED',
          permissionName: 'geolocation'
        })
      );
    });

    it("should handle invalid permission names", async () => {
      const onError = jest.fn();
      
      mockPermissions.query.mockRejectedValue(new Error('Invalid permission'));
      
      renderHook(() => 
        useNavigatorPermissions('invalid-permission' as any, {
          onError
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'INVALID_PERMISSION',
          permissionName: 'invalid-permission'
        })
      );
    });

    it("should handle request failures", async () => {
      const onError = jest.fn();
      
      mockPermissions.query.mockRejectedValue(new Error('Request failed'));
      
      renderHook(() => 
        useNavigatorPermissions('camera', {
          onError
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REQUEST_FAILED',
          permissionName: 'camera'
        })
      );
    });

    it("should use noop error handler by default", async () => {
      // Mock unsupported API
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isSupported).toBe(false);
      // Should not throw error
    });
  });

  describe("Auto Request", () => {
    it("should auto-request permission when autoRequest is true and status is prompt", async () => {
      const onStatusChange = jest.fn();
      
      mockPermissionStatus.state = 'prompt';
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          autoRequest: true,
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(2); // Initial check + auto request
    });

    it("should not auto-request when permission is already granted", async () => {
      mockPermissionStatus.state = 'granted';
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          autoRequest: true
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1); // Only initial check
    });

    it("should not auto-request when permission is denied", async () => {
      mockPermissionStatus.state = 'denied';
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          autoRequest: true
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1); // Only initial check
    });
  });

  describe("Polling", () => {
    it("should poll for permission changes when enabled", async () => {
      jest.useFakeTimers();
      
      const onStatusChange = jest.fn();
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          enablePolling: true,
          pollingInterval: 1000,
          onStatusChange
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1);

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
    });

    it("should use custom polling interval", async () => {
      jest.useFakeTimers();
      
      renderHook(() => 
        useNavigatorPermissions('geolocation', {
          enablePolling: true,
          pollingInterval: 2000
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });

    it("should clean up polling on unmount", async () => {
      jest.useFakeTimers();
      
      const { unmount } = renderHook(() => 
        useNavigatorPermissions('geolocation', {
          enablePolling: true,
          pollingInterval: 1000
        })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1); // Only initial call

      jest.useRealTimers();
    });
  });

  describe("Refresh Functionality", () => {
    it("should refresh permission status", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockPermissions.query).toHaveBeenCalledTimes(2);
    });

    it("should update status after refresh", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe('prompt');

      // Change mock status
      mockPermissionStatus.state = 'granted';

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle component unmounting during permission request", async () => {
      let resolveQuery: (value: any) => void;
      mockPermissions.query.mockImplementation(() => 
        new Promise(resolve => {
          resolveQuery = resolve;
        })
      );

      const { result, unmount } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      expect(result.current.isLoading).toBe(true);

      unmount();

      // Resolve after unmount
      act(() => {
        resolveQuery(mockPermissionStatus);
      });

      // Should not throw error or cause memory leaks
    });

    it("should handle multiple rapid permission requests", async () => {
      const { result } = renderHook(() => 
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Make multiple rapid requests
      await act(async () => {
        const promises = [
          result.current.requestPermission(),
          result.current.requestPermission(),
          result.current.requestPermission()
        ];
        
        await Promise.all(promises);
      });

      // Should handle gracefully without errors
      expect(result.current.status).toBe('prompt');
    });
  });
});