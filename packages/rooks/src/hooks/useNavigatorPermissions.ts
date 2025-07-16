import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useFreshRef } from "./useFreshRef";
import { useGetIsMounted } from "./useGetIsMounted";

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

// Type guards
function isValidPermissionStatus(status: unknown): status is PermissionStatus {
  return typeof status === 'string' && 
         ['granted', 'denied', 'prompt'].includes(status);
}

function hasPermissionsAPI(nav: unknown): nav is Navigator & { permissions: Permissions } {
  return typeof nav === 'object' && 
         nav !== null && 
         'permissions' in nav &&
         typeof (nav as any).permissions === 'object' &&
         (nav as any).permissions !== null &&
         typeof (nav as any).permissions.query === 'function';
}

// Error factory
function createPermissionError(
  type: PermissionErrorType,
  message: string,
  permissionName: SupportedPermissionName,
  originalError?: unknown
): PermissionError {
  const error = new Error(message) as PermissionError;
  error.type = type;
  error.permissionName = permissionName;
  error.timestamp = new Date();
  error.originalError = originalError;
  return error;
}

/**
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
  
  // Safe async pattern - call ID tracking and mount checks
  const lastCallId = useRef(0);
  const getIsMounted = useGetIsMounted();

  // Fresh refs for callbacks to avoid stale closures
  const onErrorRef = useFreshRef(onError);
  const onStatusChangeRef = useFreshRef(onStatusChange);
  const onGrantedRef = useFreshRef(onGranted);
  const onDeniedRef = useFreshRef(onDenied);
  const onPromptRef = useFreshRef(onPrompt);

  // Handle status change and call callbacks
  const handleStatusChange = useCallback((newStatus: PermissionStatus) => {
    if (!getIsMounted()) return;
    
    flushSync(() => {
      setStatus(newStatus);
    });
    
    // Call callbacks using fresh refs to avoid stale closures
    onStatusChangeRef.current?.(newStatus);
    
    switch (newStatus) {
      case 'granted':
        onGrantedRef.current?.();
        break;
      case 'denied':
        onDeniedRef.current?.();
        break;
      case 'prompt':
        onPromptRef.current?.();
        break;
    }
  }, [getIsMounted, onStatusChangeRef, onGrantedRef, onDeniedRef, onPromptRef]);

  // Permission change event handler
  const handlePermissionChange = useCallback(() => {
    if (!getIsMounted()) return;
    if (permissionObjectRef.current && permissionObjectRef.current.state) {
      handleStatusChange(permissionObjectRef.current.state);
    }
  }, [getIsMounted, handleStatusChange]);

  // Safe async permission check with proper cleanup
  const checkPermissionSafely = useCallback(async (shouldContinue: () => boolean) => {
    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    
    if (!shouldContinue()) return;
    
    // Use flushSync to force synchronous updates for testing
    flushSync(() => {
      setIsSupported(currentSupported);
    });
    
    if (!currentSupported) {
      if (!shouldContinue()) return;
      flushSync(() => {
        setIsInitialized(true);
      });
      return;
    }

    try {
      const result = await navigator.permissions.query({ 
        name: permissionName as never
      });
      
      if (!shouldContinue()) return;
      
      if (result && isValidPermissionStatus(result.state)) {
        permissionObjectRef.current = result;
        
        // Add event listener
        result.addEventListener('change', handlePermissionChange);
        cleanupRef.current = () => result.removeEventListener('change', handlePermissionChange);
        
        // Update status with flushSync
        if (shouldContinue()) {
          flushSync(() => {
            handleStatusChange(result.state);
          });
        }
      }
    } catch (error) {
      if (!shouldContinue()) return;
      
      const permissionError = createPermissionError(
        'REQUEST_FAILED',
        `Failed to check permission: ${String(error)}`,
        permissionName,
        error
      );
      onErrorRef.current(permissionError);
    } finally {
      if (shouldContinue()) {
        flushSync(() => {
          setIsInitialized(true);
        });
      }
    }
  }, [permissionName, handlePermissionChange, handleStatusChange, onErrorRef]);

  // Initial permission check using safe async pattern
  useEffect(() => {
    const callId = ++lastCallId.current;
    const shouldContinue = () => {
      return getIsMounted() && callId === lastCallId.current;
    };

    checkPermissionSafely(shouldContinue);

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [checkPermissionSafely, getIsMounted]);

  // Request permission function using safe async pattern
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    const callId = ++lastCallId.current;
    const shouldContinue = () => {
      return getIsMounted() && callId === lastCallId.current;
    };

    const currentSupported = typeof navigator !== 'undefined' && hasPermissionsAPI(navigator);
    if (!currentSupported) {
      const error = createPermissionError('NOT_SUPPORTED', 'Permissions API is not supported', permissionName);
      onErrorRef.current(error);
      throw error;
    }

    if (!shouldContinue()) {
      throw new Error('Component unmounted during permission request');
    }

    setIsLoading(true);
    
    try {
      const result = await navigator.permissions.query({ 
        name: permissionName as never
      });
      
      if (!shouldContinue()) {
        throw new Error('Component unmounted during permission request');
      }
      
      if (result && isValidPermissionStatus(result.state)) {
        handleStatusChange(result.state);
        return result.state;
      }
      
      const error = createPermissionError('SYSTEM_ERROR', 'Permission query returned invalid result', permissionName);
      onErrorRef.current(error);
      throw error;
    } catch (error) {
      if (!shouldContinue()) {
        throw new Error('Component unmounted during permission request');
      }
      
      const permissionError = createPermissionError(
        'REQUEST_FAILED',
        `Failed to request permission: ${String(error)}`,
        permissionName,
        error
      );
      onErrorRef.current(permissionError);
      throw permissionError;
    } finally {
      if (shouldContinue()) {
        setIsLoading(false);
      }
    }
  }, [permissionName, getIsMounted, handleStatusChange, onErrorRef]);

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
