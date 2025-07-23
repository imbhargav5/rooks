import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Types for Screen Details API
interface ScreenDetailed {
  availLeft: number;
  availTop: number;
  availWidth: number;
  availHeight: number;
  left: number;
  top: number;
  width: number;
  height: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  isPrimary: boolean;
  isInternal: boolean;
  label: string;
  addEventListener: (event: string, handler: (event: Event) => void) => void;
  removeEventListener: (event: string, handler: (event: Event) => void) => void;
}

interface ScreenDetails {
  screens: ScreenDetailed[];
  currentScreen: ScreenDetailed;
  addEventListener: (event: string, handler: (event: Event) => void) => void;
  removeEventListener: (event: string, handler: (event: Event) => void) => void;
}

interface UseScreenDetailsApiOptions {
  /**
   * Whether to automatically request permission on mount
   * @default false
   */
  requestOnMount?: boolean;
  /**
   * Whether to automatically refresh screen details on events
   * @default true
   */
  autoRefresh?: boolean;
}

interface UseScreenDetailsApiReturn {
  /** Array of all available screens */
  screens: ScreenDetailed[];
  /** Current screen where the browser window is displayed */
  currentScreen: ScreenDetailed | null;
  /** Primary screen (the main display) */
  primaryScreen: ScreenDetailed | null;
  /** External screens (non-primary screens) */
  externalScreens: ScreenDetailed[];
  /** Whether the Screen Details API is supported */
  isSupported: boolean;
  /** Whether the hook is currently loading screen details */
  isLoading: boolean;
  /** Whether permission has been granted */
  hasPermission: boolean;
  /** Error message if any operation failed */
  error: string | null;
  /** Request permission to access screen details */
  requestPermission: () => Promise<void>;
  /** Manually refresh screen details */
  refresh: () => Promise<void>;
}

/**
 * Hook for multi-screen information and management using Screen Details API
 * @param options Configuration options for the hook
 * @returns Object containing screen details and control functions
 * @see {@link https://rooks.vercel.app/docs/hooks/useScreenDetailsApi}
 */
function useScreenDetailsApi(options: UseScreenDetailsApiOptions = {}): UseScreenDetailsApiReturn {
  const { requestOnMount = false, autoRefresh = true } = options;
  
  const [screens, setScreens] = useState<ScreenDetailed[]>([]);
  const [currentScreen, setCurrentScreen] = useState<ScreenDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const screenDetailsRef = useRef<ScreenDetails | null>(null);
  const permissionStatusRef = useRef<PermissionStatus | null>(null);
  
  // Check if Screen Details API is supported
  const isSupported = useMemo(() => {
    return typeof window !== "undefined" && typeof (window as any).getScreenDetails === "function";
  }, []);
  
  // Computed properties
  const primaryScreen = useMemo(() => {
    return screens.find(screen => screen.isPrimary) || null;
  }, [screens]);
  
  const externalScreens = useMemo(() => {
    return screens.filter(screen => !screen.isPrimary);
  }, [screens]);
  
  // Fetch screen details from the API
  const fetchScreenDetails = useCallback(async (): Promise<void> => {
    if (!isSupported) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const screenDetails = await (window as any).getScreenDetails();
      screenDetailsRef.current = screenDetails;
      setScreens(screenDetails.screens);
      setCurrentScreen(screenDetails.currentScreen);
      setHasPermission(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);
  
  // Request permission to access screen details
  const requestPermission = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError("Screen Details API is not supported");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check current permission status
      const permissionStatus = await navigator.permissions.query({ 
        name: "window-management" as PermissionName 
      });
      
      permissionStatusRef.current = permissionStatus;
      
      if (permissionStatus.state === "denied") {
        setError("Permission denied for window-management");
        setHasPermission(false);
        setIsLoading(false);
        return;
      }
      
      // If permission is granted or prompt, attempt to get screen details
      await fetchScreenDetails();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setHasPermission(false);
      setIsLoading(false);
    }
  }, [isSupported, fetchScreenDetails]);
  
  // Refresh screen details
  const refresh = useCallback(async (): Promise<void> => {
    if (!hasPermission) return;
    
    try {
      await fetchScreenDetails();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    }
  }, [hasPermission, fetchScreenDetails]);
  
  // Handle screen change events
  const handleScreensChange = useCallback(() => {
    if (autoRefresh) {
      refresh();
    }
  }, [autoRefresh, refresh]);
  
  const handleCurrentScreenChange = useCallback(() => {
    if (autoRefresh) {
      refresh();
    }
  }, [autoRefresh, refresh]);
  
  const handlePermissionChange = useCallback(() => {
    if (permissionStatusRef.current) {
      const newState = permissionStatusRef.current.state;
      if (newState === "denied") {
        setHasPermission(false);
        setScreens([]);
        setCurrentScreen(null);
        setError("Permission denied for window-management");
      } else if (newState === "granted") {
        setHasPermission(true);
        setError(null);
        // Optionally refresh screen details when permission is granted
        if (autoRefresh) {
          refresh();
        }
      }
    }
  }, [autoRefresh, refresh]);
  
  // Set up event listeners
  useEffect(() => {
    if (!screenDetailsRef.current) return;
    
    const screenDetails = screenDetailsRef.current;
    
    screenDetails.addEventListener("screenschange", handleScreensChange);
    screenDetails.addEventListener("currentscreenchange", handleCurrentScreenChange);
    
    return () => {
      screenDetails.removeEventListener("screenschange", handleScreensChange);
      screenDetails.removeEventListener("currentscreenchange", handleCurrentScreenChange);
    };
  }, [handleScreensChange, handleCurrentScreenChange]);
  
  // Set up permission status listener
  useEffect(() => {
    if (!permissionStatusRef.current) return;
    
    const permissionStatus = permissionStatusRef.current;
    
    permissionStatus.addEventListener("change", handlePermissionChange);
    
    return () => {
      permissionStatus.removeEventListener("change", handlePermissionChange);
    };
  }, [handlePermissionChange]);
  
  // Auto-request permission on mount if requested
  useEffect(() => {
    if (requestOnMount && isSupported) {
      requestPermission();
    }
  }, [requestOnMount, isSupported, requestPermission]);
  
  return {
    screens,
    currentScreen,
    primaryScreen,
    externalScreens,
    isSupported,
    isLoading,
    hasPermission,
    error,
    requestPermission,
    refresh,
  };
}

export { useScreenDetailsApi };
export type { 
  UseScreenDetailsApiOptions, 
  UseScreenDetailsApiReturn, 
  ScreenDetailed, 
  ScreenDetails 
};
