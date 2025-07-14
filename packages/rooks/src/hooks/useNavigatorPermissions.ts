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
  enablePolling?: boolean;
  pollingInterval?: number;
}

interface UseNavigatorPermissionsReturn {
  // Current State
  status: PermissionStatus | null;
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
  isLoading: boolean;
  isSupported: boolean;
  
  // Actions
  requestPermission: () => Promise<PermissionStatus>;
  refresh: () => Promise<void>;
  
  // Meta
  lastUpdated: Date | null;
}

const noop = () => {};

/**
 * Hook to manage browser navigator permissions with comprehensive error handling and status tracking
 *
 * @param permissionName The name of the permission to manage
 * @param options Configuration options for the hook
 * @returns Object containing permission state and actions
 */
function useNavigatorPermissions(
  permissionName: PermissionName,
  options: UseNavigatorPermissionsOptions = {}
): UseNavigatorPermissionsReturn {
  const {
    onError = noop,
    onStatusChange,
    onGranted,
    onDenied,
    onPrompt,
    autoRequest = false,
    enablePolling = false,
    pollingInterval = 1000,
  } = options;

  // State
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup and preventing memory leaks
  const isMountedRef = useRef(true);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);
  const callbacksRef = useRef({ onStatusChange, onGranted, onDenied, onPrompt });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onStatusChange, onGranted, onDenied, onPrompt };
  }, [onStatusChange, onGranted, onDenied, onPrompt]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  // Create permission error
  const createPermissionError = useCallback((
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

  // Update permission status and trigger callbacks
  const updatePermissionStatus = useCallback((newStatus: PermissionStatus) => {
    if (!isMountedRef.current) return;

    const previousStatus = permissionStatusRef.current;
    permissionStatusRef.current = newStatus;

    setStatus(newStatus);
    setLastUpdated(new Date());

    // Only trigger callbacks if status actually changed
    if (previousStatus !== newStatus) {
      callbacksRef.current.onStatusChange?.(newStatus);
      
      switch (newStatus) {
        case 'granted':
          callbacksRef.current.onGranted?.();
          break;
        case 'denied':
          callbacksRef.current.onDenied?.();
          break;
        case 'prompt':
          callbacksRef.current.onPrompt?.();
          break;
      }
    }
  }, []);

  // Query permission status
  const queryPermissionStatus = useCallback(async (): Promise<PermissionStatus | null> => {
    if (!navigator.permissions) {
      setIsSupported(false);
      onError(createPermissionError(
        'NOT_SUPPORTED',
        'Permissions API is not supported by this browser'
      ));
      return null;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: permissionName });
      
      if (!isMountedRef.current) return null;

      const status = permissionStatus.state as PermissionStatus;
      
      // Set up event listener for real-time permission changes
      const handlePermissionChange = () => {
        if (isMountedRef.current) {
          updatePermissionStatus(permissionStatus.state as PermissionStatus);
        }
      };

      permissionStatus.addEventListener('change', handlePermissionChange);
      
      // Clean up event listener on unmount
      const cleanup = () => {
        permissionStatus.removeEventListener('change', handlePermissionChange);
      };

      // Store cleanup for later
      useEffect(() => cleanup, []);

      return status;
    } catch (error) {
      if (!isMountedRef.current) return null;

      let errorType: PermissionErrorType = 'REQUEST_FAILED';
      let errorMessage = 'Failed to query permission status';

      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('invalid')) {
          errorType = 'INVALID_PERMISSION';
          errorMessage = `Invalid permission name: ${permissionName}`;
        }
      }

      onError(createPermissionError(errorType, errorMessage, error));
      return null;
    }
  }, [permissionName, onError, createPermissionError, updatePermissionStatus]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    if (!isMountedRef.current) return 'denied';

    setIsLoading(true);

    try {
      const newStatus = await queryPermissionStatus();
      
      if (!isMountedRef.current) return 'denied';

      if (newStatus) {
        updatePermissionStatus(newStatus);
        return newStatus;
      }
      
      return 'denied';
    } catch (error) {
      if (!isMountedRef.current) return 'denied';

      onError(createPermissionError(
        'REQUEST_FAILED',
        'Failed to request permission',
        error
      ));
      return 'denied';
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryPermissionStatus, updatePermissionStatus, onError, createPermissionError]);

  // Refresh permission status
  const refresh = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      const newStatus = await queryPermissionStatus();
      if (newStatus && isMountedRef.current) {
        updatePermissionStatus(newStatus);
      }
    } catch (error) {
      if (isMountedRef.current) {
        onError(createPermissionError(
          'REQUEST_FAILED',
          'Failed to refresh permission status',
          error
        ));
      }
    }
  }, [queryPermissionStatus, updatePermissionStatus, onError, createPermissionError]);

  // Polling functionality
  const startPolling = useCallback(() => {
    if (!enablePolling || !isMountedRef.current) return;

    const poll = async () => {
      await refresh();
      
      if (isMountedRef.current && enablePolling) {
        pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
      }
    };

    pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
  }, [enablePolling, pollingInterval, refresh]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  // Initial permission check and setup
  useEffect(() => {
    let mounted = true;

    const initializePermission = async () => {
      if (!mounted) return;

      setIsLoading(true);

      try {
        const initialStatus = await queryPermissionStatus();
        
        if (!mounted) return;

        if (initialStatus) {
          updatePermissionStatus(initialStatus);

          // Auto-request if enabled and status is prompt
          if (autoRequest && initialStatus === 'prompt') {
            await requestPermission();
          }
        }
      } catch (error) {
        if (mounted) {
          onError(createPermissionError(
            'SYSTEM_ERROR',
            'Failed to initialize permission',
            error
          ));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializePermission();

    return () => {
      mounted = false;
    };
  }, [permissionName, autoRequest, queryPermissionStatus, updatePermissionStatus, requestPermission, onError, createPermissionError]);

  // Start/stop polling based on enablePolling
  useEffect(() => {
    if (enablePolling) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enablePolling, startPolling, stopPolling]);

  // Computed values
  const isGranted = status === 'granted';
  const isDenied = status === 'denied';
  const isPrompt = status === 'prompt';

  return {
    status,
    isGranted,
    isDenied,
    isPrompt,
    isLoading,
    isSupported,
    requestPermission,
    refresh,
    lastUpdated,
  };
}

export { useNavigatorPermissions };
export type { 
  UseNavigatorPermissionsOptions, 
  UseNavigatorPermissionsReturn, 
  PermissionName, 
  PermissionStatus, 
  PermissionError, 
  PermissionErrorType 
};