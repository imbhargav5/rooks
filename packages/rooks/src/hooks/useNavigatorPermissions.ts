import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type PermissionStatus = 'granted' | 'denied' | 'prompt';

type SupportedPermissionName = 
  | 'geolocation' 
  | 'camera' 
  | 'microphone' 
  | 'notifications' 
  | 'persistent-storage' 
  | 'push' 
  | 'midi' 
  | 'background-sync'
  | 'clipboard-read'
  | 'clipboard-write';

type PermissionErrorType = 
  | 'NOT_SUPPORTED'
  | 'INVALID_PERMISSION'
  | 'REQUEST_FAILED'
  | 'USER_ABORT'
  | 'SYSTEM_ERROR';

interface PermissionError extends Error {
  type: PermissionErrorType;
  permissionName: SupportedPermissionName;
  timestamp: Date;
  originalError?: unknown;
}

interface UseNavigatorPermissionsOptions {
  onError?: (error: PermissionError) => void;
  onStatusChange?: (status: PermissionStatus) => void;
  onGranted?: () => void;
  onDenied?: () => void;
  onPrompt?: () => void;
  autoRequest?: boolean;
}

interface UseNavigatorPermissionsReturn {
  status: PermissionStatus | null;
  isSupported: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
  requestPermission: () => Promise<PermissionStatus>;
}

// Type guard for PermissionStatus
function isValidPermissionStatus(value: unknown): value is PermissionStatus {
  return typeof value === 'string' && ['granted', 'denied', 'prompt'].includes(value);
}

// Type guard for Navigator with permissions
function hasPermissionsAPI(nav: unknown): nav is Navigator & { permissions: Permissions } {
  return typeof nav === 'object' && 
         nav !== null && 
         'permissions' in nav &&
         typeof (nav as any).permissions === 'object' &&
         (nav as any).permissions !== null &&
         typeof (nav as any).permissions.query === 'function';
}

// Factory function to create PermissionError
function createPermissionError(
  type: PermissionErrorType,
  message: string,
  permissionName: SupportedPermissionName,
  originalError?: unknown
): PermissionError {
  const error = new Error(message);
  const permissionError: PermissionError = {
    ...error,
    name: 'PermissionError',
    type,
    permissionName,
    timestamp: new Date(),
    originalError,
  };
  return permissionError;
}

/**
 * useNavigatorPermissions
 * @description Hook to manage browser navigator permissions with comprehensive error handling and status tracking
 * @see {@link https://rooks.vercel.app/docs/useNavigatorPermissions}
*/
function useNavigatorPermissions(
  permissionName: SupportedPermissionName,
  options: UseNavigatorPermissionsOptions = {}
): UseNavigatorPermissionsReturn {
  const {
    onError = () => {}, // Default to noop
    onStatusChange,
    onGranted,
    onDenied,
    onPrompt,
  } = options;

  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const permissionObjectRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Handle status change and call callbacks
  const handleStatusChange = useCallback((newStatus: PermissionStatus) => {
    setStatus(newStatus);
    
    // Call callbacks
    onStatusChange?.(newStatus);
    
    switch (newStatus) {
      case 'granted':
        onGranted?.();
        break;
      case 'denied':
        onDenied?.();
        break;
      case 'prompt':
        onPrompt?.();
        break;
    }
  }, [onStatusChange, onGranted, onDenied, onPrompt]);

  // Permission change event handler
  const handlePermissionChange = useCallback(() => {
    if (permissionObjectRef.current && permissionObjectRef.current.state) {
      handleStatusChange(permissionObjectRef.current.state);
    }
  }, [handleStatusChange]);

  // Check permissions and setup listeners
  const checkPermission = useCallback(async () => {
    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    
    // Use flushSync to force synchronous updates for testing
    flushSync(() => {
      setIsSupported(currentSupported);
    });
    
    if (!currentSupported) {
      flushSync(() => {
        setIsInitialized(true);
      });
      return;
    }

    try {
      const result = await navigator.permissions.query({ 
        name: permissionName as never
      });
      
      if (result && isValidPermissionStatus(result.state)) {
        permissionObjectRef.current = result;
        
        // Add event listener
        result.addEventListener('change', handlePermissionChange);
        cleanupRef.current = () => result.removeEventListener('change', handlePermissionChange);
        
        // Update status with flushSync
        flushSync(() => {
          handleStatusChange(result.state);
        });
      }
    } catch (error) {
      const permissionError = createPermissionError(
        'REQUEST_FAILED',
        `Failed to check permission: ${String(error)}`,
        permissionName,
        error
      );
      onError(permissionError);
    } finally {
      flushSync(() => {
        setIsInitialized(true);
      });
    }
  }, [permissionName, onError, handleStatusChange, handlePermissionChange]);

  // Request permission function
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    if (!currentSupported) {
      const error = createPermissionError('NOT_SUPPORTED', 'Permissions API is not supported', permissionName);
      onError(error);
      throw error;
    }

    setIsLoading(true);
    
    try {
      const result = await navigator.permissions.query({ 
        name: permissionName as never
      });
      
      if (result && isValidPermissionStatus(result.state)) {
        handleStatusChange(result.state);
        return result.state;
      }
      
      const error = createPermissionError('SYSTEM_ERROR', 'Permission query returned invalid result', permissionName);
      onError(error);
      throw error;
    } catch (error) {
      const permissionError = createPermissionError(
        'REQUEST_FAILED',
        `Failed to request permission: ${String(error)}`,
        permissionName,
        error
      );
      onError(permissionError);
      throw permissionError;
    } finally {
      setIsLoading(false);
    }
  }, [permissionName, onError, handleStatusChange]);

  // Initial permission check
  useEffect(() => {
    checkPermission();

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [checkPermission]);

  // Computed convenience flags
  const isGranted = status === 'granted';
  const isDenied = status === 'denied';
  const isPrompt = status === 'prompt';

  return {
    status,
    isSupported,
    isInitialized,
    isLoading,
    isGranted,
    isDenied,
    isPrompt,
    requestPermission,
  };
}

export { useNavigatorPermissions };
