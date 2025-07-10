import { useCallback, useEffect, useRef, useState } from "react";

// Type definitions for the native Idle Detection API
interface IdleDetector extends EventTarget {
  userState: "active" | "idle" | null;
  screenState: "locked" | "unlocked" | null;
  start(options?: { threshold?: number; signal?: AbortSignal }): Promise<void>;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

interface IdleDetectorConstructor {
  new(): IdleDetector;
  requestPermission(): Promise<"granted" | "denied">;
}

declare global {
  interface Window {
    IdleDetector?: IdleDetectorConstructor;
  }
}

// Options interface for useIdle hook
interface UseIdleOptions {
  threshold?: number;
  autoStart?: boolean;
  requestPermission?: boolean;
  onIdleChange?: (state: {
    isIdle: boolean;
    userState: "active" | "idle";
    screenState: "locked" | "unlocked";
  }) => void;
  onError?: (error: Error) => void;
}

// Return type for useIdle hook
interface UseIdleReturn {
  isSupported: boolean;
  isIdle: boolean;
  userState: "active" | "idle";
  screenState: "locked" | "unlocked";
  isPermissionGranted: boolean;
  start: () => void;
  stop: () => void;
}

// Simple polyfill implementation using DOM events
class IdlePolyfill {
  private threshold: number;
  private isIdle: boolean = false;
  private _userState: "active" | "idle" = "active";
  private _screenState: "locked" | "unlocked" = "unlocked";
  private listeners: Array<() => void> = [];
  private timeoutId: number | null = null;
  private started: boolean = false;
  
  private events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'keydown'
  ];

  constructor(threshold: number = 60000) {
    this.threshold = Math.max(threshold, 60000); // Minimum 60 seconds
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleUserActivity = this.handleUserActivity.bind(this);
  }

  addEventListener(type: string, listener: () => void) {
    if (type === 'change') {
      this.listeners.push(listener);
    }
  }

  removeEventListener(type: string, listener: () => void) {
    if (type === 'change') {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  start() {
    if (this.started) return;
    
    this.started = true;
    
    // Add activity listeners
    this.events.forEach(event => {
      document.addEventListener(event, this.handleUserActivity, true);
    });
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Start the idle timer
    this.resetIdleTimer();
  }

  stop() {
    if (!this.started) return;
    
    this.started = false;
    
    // Remove activity listeners
    this.events.forEach(event => {
      document.removeEventListener(event, this.handleUserActivity, true);
    });
    
    // Remove visibility change listener
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Clear timer
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private handleUserActivity = () => {
    if (this.isIdle) {
      this.isIdle = false;
      this._userState = "active";
      this.notifyListeners();
    }
    this.resetIdleTimer();
  };

  private handleVisibilityChange = () => {
    // Use Page Visibility API to approximate screen state
    this._screenState = document.hidden ? "locked" : "unlocked";
    this.notifyListeners();
  };

  private resetIdleTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.isIdle = true;
      this._userState = "idle";
      this.notifyListeners();
    }, this.threshold) as number;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  get userState() {
    return this._userState;
  }

  get screenState() {
    return this._screenState;
  }
}

/**
 * useIdle hook for detecting user idle state using the native Idle Detection API
 * with polyfill fallback for browsers that don't support it.
 * 
 * @param options - Configuration options for idle detection
 * @returns Object containing idle state and control methods
 * 
 * @example
 * ```tsx
 * import { useIdle } from 'rooks';
 * 
 * function MyComponent() {
 *   const { isIdle, userState, screenState, start, stop } = useIdle({
 *     threshold: 60000, // 1 minute
 *     autoStart: true,
 *     requestPermission: true,
 *     onIdleChange: (state) => {
 *       console.log('Idle state changed:', state);
 *     },
 *     onError: (error) => {
 *       console.error('Idle detection error:', error);
 *     }
 *   });
 * 
 *   return (
 *     <div>
 *       <p>Is Idle: {isIdle ? 'Yes' : 'No'}</p>
 *       <p>User State: {userState}</p>
 *       <p>Screen State: {screenState}</p>
 *       <button onClick={start}>Start Detection</button>
 *       <button onClick={stop}>Stop Detection</button>
 *     </div>
 *   );
 * }
 * ```
 */
function useIdle(options: UseIdleOptions = {}): UseIdleReturn {
  const {
    threshold = 60000,
    autoStart = false,
    requestPermission = false,
    onIdleChange,
    onError
  } = options;

  // Ensure minimum threshold of 60 seconds (as per spec)
  const validThreshold = Math.max(threshold, 60000);

  // State management
  const [isSupported, setIsSupported] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [userState, setUserState] = useState<"active" | "idle">("active");
  const [screenState, setScreenState] = useState<"locked" | "unlocked">("unlocked");
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // Refs for cleanup
  const idleDetectorRef = useRef<IdleDetector | null>(null);
  const polyfillRef = useRef<IdlePolyfill | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if native Idle Detection API is supported
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'IdleDetector' in window;
    setIsSupported(supported);
  }, []);

  // Handle idle state changes
  const handleIdleChange = useCallback(() => {
    if (idleDetectorRef.current) {
      // Native API
      const detector = idleDetectorRef.current;
      const newIsIdle = detector.userState === "idle";
      const newUserState = detector.userState || "active";
      const newScreenState = detector.screenState || "unlocked";
      
      setIsIdle(newIsIdle);
      setUserState(newUserState);
      setScreenState(newScreenState);
      
      onIdleChange?.({
        isIdle: newIsIdle,
        userState: newUserState,
        screenState: newScreenState
      });
    } else if (polyfillRef.current) {
      // Polyfill
      const polyfill = polyfillRef.current;
      const newIsIdle = polyfill.userState === "idle";
      const newUserState = polyfill.userState;
      const newScreenState = polyfill.screenState;
      
      setIsIdle(newIsIdle);
      setUserState(newUserState);
      setScreenState(newScreenState);
      
      onIdleChange?.({
        isIdle: newIsIdle,
        userState: newUserState,
        screenState: newScreenState
      });
    }
  }, [onIdleChange]);

  // Start idle detection
  const start = useCallback(async () => {
    try {
      if (isSupported && window.IdleDetector) {
        // Use native API
        if (requestPermission) {
          const permission = await window.IdleDetector.requestPermission();
          setIsPermissionGranted(permission === "granted");
          
          if (permission !== "granted") {
            onError?.(new Error("Idle detection permission denied"));
            return;
          }
        }

        // Create abort controller for cleanup
        abortControllerRef.current = new AbortController();
        
        const detector = new window.IdleDetector();
        detector.addEventListener("change", handleIdleChange);
        
        await detector.start({
          threshold: validThreshold,
          signal: abortControllerRef.current.signal
        });
        
        idleDetectorRef.current = detector;
        
        // Initialize state
        setIsIdle(detector.userState === "idle");
        setUserState(detector.userState || "active");
        setScreenState(detector.screenState || "unlocked");
        
      } else {
        // Use polyfill
        const polyfill = new IdlePolyfill(validThreshold);
        polyfill.addEventListener("change", handleIdleChange);
        polyfill.start();
        
        polyfillRef.current = polyfill;
        
        // Initialize state
        setIsIdle(false);
        setUserState("active");
        setScreenState("unlocked");
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to start idle detection"));
    }
  }, [isSupported, requestPermission, validThreshold, handleIdleChange, onError]);

  // Stop idle detection
  const stop = useCallback(() => {
    if (idleDetectorRef.current) {
      idleDetectorRef.current.removeEventListener("change", handleIdleChange);
      idleDetectorRef.current = null;
    }
    
    if (polyfillRef.current) {
      polyfillRef.current.removeEventListener("change", handleIdleChange);
      polyfillRef.current.stop();
      polyfillRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Reset state
    setIsIdle(false);
    setUserState("active");
    setScreenState("unlocked");
  }, [handleIdleChange]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSupported,
    isIdle,
    userState,
    screenState,
    isPermissionGranted,
    start,
    stop
  };
}

export { useIdle };
export type { UseIdleOptions, UseIdleReturn };