/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
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

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useNavigatorPermissions).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      expect(result.current.isSupported).toBe(true);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.status).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(false);
    });

    it("should handle unsupported permissions API", () => {
      // Mock unsupported API
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      expect(result.current.isSupported).toBe(false);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.status).toBe(null);
      
      // Restore navigator
      Object.defineProperty(global, 'navigator', {
        value: {
          permissions: mockPermissions,
        },
        writable: true,
      });
    });

    it("should handle granted permission status", async () => {
      mockPermissionStatus.state = 'granted';
      
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(false);
    });

    it("should handle denied permission status", async () => {
      mockPermissionStatus.state = 'denied';
      
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      expect(result.current.status).toBe('denied');
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(true);
      expect(result.current.isPrompt).toBe(false);
    });
  });

  describe("Permission Request", () => {
    it("should handle successful permission request", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      await act(async () => {
        mockPermissionStatus.state = 'granted';
        const requestResult = await result.current.requestPermission();
        expect(requestResult).toBe('granted');
      });

      expect(result.current.isGranted).toBe(true);
    });

    it("should handle permission request denial", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      await act(async () => {
        mockPermissionStatus.state = 'denied';
        const requestResult = await result.current.requestPermission();
        expect(requestResult).toBe('denied');
      });

      expect(result.current.isDenied).toBe(true);
    });
  });

  describe("Callback Handlers", () => {
    it("should call onStatusChange when status changes", async () => {
      const onStatusChange = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onStatusChange })
      );

      await waitForNextUpdate();
      expect(onStatusChange).toHaveBeenCalledWith('prompt');
    });

    it("should call onGranted when permission is granted", async () => {
      const onGranted = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onGranted })
      );

      await waitForNextUpdate();

      act(() => {
        mockPermissionStatus.state = 'granted';
        const changeEvent = new Event('change');
        mockPermissionStatus.addEventListener.mock.calls.forEach(([event, callback]) => {
          if (event === 'change') callback(changeEvent);
        });
      });

      expect(onGranted).toHaveBeenCalled();
    });

    it("should call onError with noop by default", async () => {
      mockPermissions.query.mockRejectedValue(new Error('Test error'));
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Should not throw error since onError defaults to noop
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isSupported).toBe(true);
    });

    it("should call custom onError when provided", async () => {
      const onError = jest.fn();
      mockPermissions.query.mockRejectedValue(new Error('Test error'));
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onError })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REQUEST_FAILED',
          permissionName: 'geolocation',
        })
      );
    });
  });

  describe("Event Listeners", () => {
    it("should add event listeners on mount", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      expect(mockPermissionStatus.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it("should remove event listeners on unmount", async () => {
      const { result, waitForNextUpdate, unmount } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await waitForNextUpdate();

      unmount();

      expect(mockPermissionStatus.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid permission names", async () => {
      const onError = jest.fn();
      mockPermissions.query.mockRejectedValue(new Error('Invalid permission'));
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('invalid-permission' as any, { onError })
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REQUEST_FAILED',
          permissionName: 'invalid-permission',
        })
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined permission status", async () => {
      mockPermissions.query.mockResolvedValue(null);
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe(null);
      expect(result.current.isInitialized).toBe(false);
    });

    it("should handle permission status without state property", async () => {
      mockPermissions.query.mockResolvedValue({});
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.status).toBe(null);
    });
  });
});
