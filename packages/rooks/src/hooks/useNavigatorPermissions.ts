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
): Promise<{ status: PermissionStatus | null; permissionStatus: any; cleanup: () => void }> {
  try {
    const result = await navigator.permissions.query({ 
      name: permissionName as never
    });
    
    if (result && isValidPermissionStatus(result.state)) {
      result.addEventListener('change', changeHandler);
      
      return {
        status: result.state,
        permissionStatus: result,
        cleanup: () => result.removeEventListener('change', changeHandler)
      };
    }
    
    return {
      status: null,
      permissionStatus: null,
      cleanup: () => {}
    };
  } catch {
    return {
      status: null,
      permissionStatus: null,
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
  
  const permissionObjectRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const callbacksRef = useRef({ onStatusChange, onGranted, onDenied, onPrompt });

  // Update callbacks ref
  useEffect(() => {
    callbacksRef.current = { onStatusChange, onGranted, onDenied, onPrompt };
  }, [onStatusChange, onGranted, onDenied, onPrompt]);

  // Check if Permissions API is supported - make it reactive for tests
  const [isSupported, setIsSupported] = useState(
    typeof navigator !== 'undefined' && hasPermissionsAPI(navigator)
  );

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
    if (permissionObjectRef.current && permissionObjectRef.current.state) {
      handleStatusChange(permissionObjectRef.current.state);
    }
  }, [handleStatusChange]);

  // Request permission function
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    // Re-check support at request time
    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    if (!currentSupported) {
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
  }, [permissionName, onError, handleStatusChange]);

  // Initial permission check
  useEffect(() => {
    // Re-check navigator support in case it changed (for tests)
    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    setIsSupported(currentSupported);
    
    if (!currentSupported) {
      setIsInitialized(true);
      return;
    }

    const checkPermission = async () => {
      try {
        const { status: permissionStatus, permissionStatus: permissionObject, cleanup } = await queryPermissionWithListener(
          permissionName,
          handlePermissionChange
        );
        
        if (permissionStatus) {
          permissionObjectRef.current = permissionObject;
          cleanupRef.current = cleanup;
          handleStatusChange(permissionStatus);
        }
        
        // Always set initialized to true after attempting to check
        setIsInitialized(true);
      } catch (error) {
        const permissionError = createPermissionError(
          'REQUEST_FAILED',
          `Failed to check permission: ${error}`,
          permissionName,
          error
        );
        onError(permissionError);
        setIsInitialized(true); // Still set initialized even on error
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
  }, [permissionName, onError, handleStatusChange, handlePermissionChange]);

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
