import { useCallback, useEffect, useRef, useState } from "react";

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
  return typeof nav === 'object' && nav !== null && 'permissions' in nav;
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

// Safe permission query wrapper
async function queryPermission(
  permissionName: SupportedPermissionName
): Promise<PermissionStatus | null> {
  try {
    const result = await navigator.permissions.query({ 
      name: permissionName as never
    });
    
    if (result && isValidPermissionStatus(result.state)) {
      return result.state;
    }
    return null;
  } catch {
    return null;
  }
}

// Safe permission query with event listener
async function queryPermissionWithListener(
  permissionName: SupportedPermissionName,
  changeHandler: () => void
): Promise<{ status: PermissionStatus | null; cleanup: () => void }> {
  try {
    const result = await navigator.permissions.query({ 
      name: permissionName as never
    });
    
    if (result && isValidPermissionStatus(result.state)) {
      result.addEventListener('change', changeHandler);
      
      return {
        status: result.state,
        cleanup: () => result.removeEventListener('change', changeHandler)
      };
    }
    
    return {
      status: null,
      cleanup: () => {}
    };
  } catch {
    return {
      status: null,
      cleanup: () => {}
    };
  }
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
  
  const permissionObjectRef = useRef<PermissionStatus | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const callbacksRef = useRef({ onStatusChange, onGranted, onDenied, onPrompt });

  // Update callbacks ref
  useEffect(() => {
    callbacksRef.current = { onStatusChange, onGranted, onDenied, onPrompt };
  }, [onStatusChange, onGranted, onDenied, onPrompt]);

  // Check if Permissions API is supported
  const isSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);

  // Handle status change
  const handleStatusChange = useCallback((newStatus: PermissionStatus) => {
    setStatus(newStatus);
    const callbacks = callbacksRef.current;
    
    // Call status change callback
    callbacks.onStatusChange?.(newStatus);
    
    // Call specific callbacks
    switch (newStatus) {
      case 'granted':
        callbacks.onGranted?.();
        break;
      case 'denied':
        callbacks.onDenied?.();
        break;
      case 'prompt':
        callbacks.onPrompt?.();
        break;
    }
  }, []);

  // Permission change event handler
  const handlePermissionChange = useCallback(() => {
    if (permissionObjectRef.current) {
      handleStatusChange(permissionObjectRef.current);
    }
  }, [handleStatusChange]);

  // Request permission function
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    if (!isSupported) {
      const error = createPermissionError('NOT_SUPPORTED', 'Permissions API is not supported', permissionName);
      onError(error);
      throw error;
    }

    setIsLoading(true);
    
    try {
      const result = await queryPermission(permissionName);
      
      if (result) {
        handleStatusChange(result);
        return result;
      }
      
      const error = createPermissionError('SYSTEM_ERROR', 'Permission query returned invalid result', permissionName);
      onError(error);
      throw error;
    } catch (error) {
      const permissionError = createPermissionError(
        'REQUEST_FAILED',
        `Failed to request permission: ${error}`,
        permissionName,
        error
      );
      onError(permissionError);
      throw permissionError;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permissionName, onError, handleStatusChange]);

  // Initial permission check
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const checkPermission = async () => {
      try {
        const { status: permissionStatus, cleanup } = await queryPermissionWithListener(
          permissionName,
          handlePermissionChange
        );
        
        if (permissionStatus) {
          permissionObjectRef.current = permissionStatus;
          cleanupRef.current = cleanup;
          handleStatusChange(permissionStatus);
          setIsInitialized(true);
        }
      } catch (error) {
        const permissionError = createPermissionError(
          'REQUEST_FAILED',
          `Failed to check permission: ${error}`,
          permissionName,
          error
        );
        onError(permissionError);
      }
    };

    checkPermission();

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isSupported, permissionName, onError, handleStatusChange, handlePermissionChange]);

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
