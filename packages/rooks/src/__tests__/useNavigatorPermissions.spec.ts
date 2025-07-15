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

// Helper function to wait for async operations
const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

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
    it("should initialize with correct default values", async () => {
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
      
      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });
      
      expect(result.current.isInitialized).toBe(true);
    });

    it("should handle unsupported permissions API", async () => {
      // Mock unsupported API
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(result.current.isSupported).toBe(false);
      expect(result.current.isInitialized).toBe(true);
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
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
      expect(result.current.isDenied).toBe(false);
      expect(result.current.isPrompt).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });

    it("should handle denied permission status", async () => {
      mockPermissionStatus.state = 'denied';
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(result.current.status).toBe('denied');
      expect(result.current.isGranted).toBe(false);
      expect(result.current.isDenied).toBe(true);
      expect(result.current.isPrompt).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe("Permission Request", () => {
    it("should handle successful permission request", async () => {
      mockPermissionStatus.state = 'prompt';
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for initial setup
      await act(async () => {
        await waitForAsync();
      });

      // Mock permission request result
      mockPermissionStatus.state = 'granted';
      mockPermissions.query.mockResolvedValue(mockPermissionStatus);

      await act(async () => {
        const requestResult = await result.current.requestPermission();
        expect(requestResult).toBe('granted');
      });

      expect(result.current.status).toBe('granted');
      expect(result.current.isGranted).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle permission request denial", async () => {
      mockPermissionStatus.state = 'prompt';
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for initial setup
      await act(async () => {
        await waitForAsync();
      });

      // Mock permission request result
      mockPermissionStatus.state = 'denied';
      mockPermissions.query.mockResolvedValue(mockPermissionStatus);

      await act(async () => {
        const requestResult = await result.current.requestPermission();
        expect(requestResult).toBe('denied');
      });

      expect(result.current.status).toBe('denied');
      expect(result.current.isDenied).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Callback Handlers", () => {
    it("should call onStatusChange when status changes", async () => {
      const onStatusChange = jest.fn();
      mockPermissionStatus.state = 'granted';
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onStatusChange })
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(onStatusChange).toHaveBeenCalledWith('granted');
    });

    it("should call onGranted when permission is granted", async () => {
      const onGranted = jest.fn();
      mockPermissionStatus.state = 'granted';
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onGranted })
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(onGranted).toHaveBeenCalled();
    });

    it("should call onError with noop by default", async () => {
      // Mock a failing query
      mockPermissions.query.mockRejectedValue(new Error('Test error'));
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      // Should not throw and should still initialize
      expect(result.current.isInitialized).toBe(true);
    });

    it("should call custom onError when provided", async () => {
      const onError = jest.fn();
      // Mock a failing query
      mockPermissions.query.mockRejectedValue(new Error('Test error'));
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation', { onError })
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toHaveProperty('type', 'REQUEST_FAILED');
    });
  });

  describe("Event Listeners", () => {
    it("should add event listeners on mount", async () => {
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(mockPermissionStatus.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it("should remove event listeners on unmount", async () => {
      const { result, unmount } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(mockPermissionStatus.addEventListener).toHaveBeenCalled();

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
        useNavigatorPermissions('geolocation', { onError })
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(onError).toHaveBeenCalled();
      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined permission status", async () => {
      mockPermissions.query.mockResolvedValue(null);
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(result.current.status).toBe(null);
      expect(result.current.isInitialized).toBe(true);
    });

    it("should handle permission status without state property", async () => {
      mockPermissions.query.mockResolvedValue({ state: undefined });
      
      const { result } = renderHook(() =>
        useNavigatorPermissions('geolocation')
      );

      // Wait for async initialization to complete
      await act(async () => {
        await waitForAsync();
      });

      expect(result.current.status).toBe(null);
      expect(result.current.isInitialized).toBe(true);
    });
  });
});
