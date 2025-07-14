import { useCallback, useEffect, useRef, useState } from "react";

type PermissionStatus = 'granted' | 'denied' | 'prompt';

type PermissionName = 
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
  permissionName: PermissionName;
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

/**
 * useNavigatorPermissions
 * @description Hook to manage browser navigator permissions with comprehensive error handling and status tracking
 * @see {@link https://rooks.vercel.app/docs/useNavigatorPermissions}
*/
function useNavigatorPermissions(
  permissionName: PermissionName,
  options: UseNavigatorPermissionsOptions = {}
): UseNavigatorPermissionsReturn {
  const {
    onError = () => {}, // Default to noop
    onStatusChange,
    onGranted,
    onDenied,
    onPrompt,
    autoRequest = false,
  } = options;

  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const permissionObjectRef = useRef<any>(null);
  const callbacksRef = useRef({ onStatusChange, onGranted, onDenied, onPrompt });

  // Update callbacks ref
  useEffect(() => {
    callbacksRef.current = { onStatusChange, onGranted, onDenied, onPrompt };
  }, [onStatusChange, onGranted, onDenied, onPrompt]);

  // Check if Permissions API is supported
  const isSupported = typeof navigator !== 'undefined' && 'permissions' in navigator;

  // Create error helper
  const createError = useCallback((
    type: PermissionErrorType,
    message: string,
    originalError?: unknown
  ): PermissionError => {
    const error = new Error(message) as PermissionError;
    error.type = type;
    error.permissionName = permissionName;
    error.timestamp = new Date();
    error.originalError = originalError;
    return error;
  }, [permissionName]);

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
    if (permissionObjectRef.current?.state) {
      handleStatusChange(permissionObjectRef.current.state);
    }
  }, [handleStatusChange]);

  // Request permission function
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    if (!isSupported) {
      const error = createError('NOT_SUPPORTED', 'Permissions API is not supported');
      onError(error);
      throw error;
    }

    setIsLoading(true);
    
    try {
      const permissionStatus = await navigator.permissions.query({ name: permissionName as any });
      
      if (permissionStatus?.state) {
        handleStatusChange(permissionStatus.state);
        return permissionStatus.state;
      }
      
      const error = createError('SYSTEM_ERROR', 'Permission query returned invalid result');
      onError(error);
      throw error;
    } catch (error) {
      const permissionError = createError(
        'REQUEST_FAILED',
        `Failed to request permission: ${error}`,
        error
      );
      onError(permissionError);
      throw permissionError;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permissionName, onError, createError, handleStatusChange]);

  // Initial permission check
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const checkPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: permissionName as any });
        
        if (permissionStatus?.state) {
          permissionObjectRef.current = permissionStatus;
          handleStatusChange(permissionStatus.state);
          
          // Add event listener for permission changes
          permissionStatus.addEventListener('change', handlePermissionChange);
          
          setIsInitialized(true);
        }
      } catch (error) {
        const permissionError = createError(
          'REQUEST_FAILED',
          `Failed to check permission: ${error}`,
          error
        );
        onError(permissionError);
      }
    };

    checkPermission();

    // Cleanup function
    return () => {
      if (permissionObjectRef.current) {
        permissionObjectRef.current.removeEventListener('change', handlePermissionChange);
      }
    };
  }, [isSupported, permissionName, onError, createError, handleStatusChange, handlePermissionChange]);

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
