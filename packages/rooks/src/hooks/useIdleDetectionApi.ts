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

// Options interface for useIdleDetectionApi hook
interface UseIdleDetectionApiOptions {
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

interface UseIdleDetectionApiReturn {
  isIdle: boolean;
  userState: "active" | "idle";
  screenState: "locked" | "unlocked";
  isSupported: boolean;
  isPermissionGranted: boolean;
  start: () => Promise<void>;
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

  constructor(threshold: number) {
    this.threshold = Math.max(threshold, 60000); // Minimum 60 seconds
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
    
    this.timeoutId = window.setTimeout(() => {
      this.isIdle = true;
      this._userState = "idle";
      this.notifyListeners();
    }, this.threshold);
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

  get isIdleState() {
    return this.isIdle;
  }

  addEventListener(event: string, listener: () => void) {
    if (event === "change") {
      this.listeners.push(listener);
    }
  }

  removeEventListener(event: string, listener: () => void) {
    if (event === "change") {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  start() {
    if (this.started) return;
    this.started = true;

    // Add event listeners for user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => {
      document.addEventListener(event, this.handleUserActivity, true);
    });

    // Add visibility change listener
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Start the idle timer
    this.resetIdleTimer();
  }

  stop() {
    if (!this.started) return;
    this.started = false;

    // Remove event listeners
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => {
      document.removeEventListener(event, this.handleUserActivity, true);
    });

    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    // Clear timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Reset state
    this.isIdle = false;
    this._userState = "active";
    this._screenState = "unlocked";
  }
}

/**
 * useIdleDetectionApi hook - Detects when user is idle using Idle Detection API with polyfill
 *
 * @param options Configuration options
 * @returns Object with idle state and control methods
 */
export function useIdleDetectionApi(options: UseIdleDetectionApiOptions = {}): UseIdleDetectionApiReturn {
  const {
    threshold = 60000, // Default 60 seconds
    autoStart = false,
    requestPermission = false,
    onIdleChange,
    onError,
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [userState, setUserState] = useState<"active" | "idle">("active");
  const [screenState, setScreenState] = useState<"locked" | "unlocked">("unlocked");
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  
  const detectorRef = useRef<IdleDetector | null>(null);
  const polyfillRef = useRef<IdlePolyfill | null>(null);
  const startedRef = useRef(false);

  // Check if native API is supported
  const isSupported = typeof window !== "undefined" && "IdleDetector" in window;

  // Enforce minimum threshold
  const actualThreshold = Math.max(threshold, 60000);

  // Change handler
  const handleChange = useCallback(() => {
    const detector = detectorRef.current;
    const polyfill = polyfillRef.current;
    
    let newIsIdle = false;
    let newUserState: "active" | "idle" = "active";
    let newScreenState: "locked" | "unlocked" = "unlocked";

    if (detector && detector.userState && detector.screenState) {
      newIsIdle = detector.userState === "idle";
      newUserState = detector.userState;
      newScreenState = detector.screenState;
         } else if (polyfill) {
       newIsIdle = polyfill.isIdleState;
       newUserState = polyfill.userState;
       newScreenState = polyfill.screenState;
     }

    setIsIdle(newIsIdle);
    setUserState(newUserState);
    setScreenState(newScreenState);

    onIdleChange?.({
      isIdle: newIsIdle,
      userState: newUserState,
      screenState: newScreenState
    });
  }, [onIdleChange]);

  // Start detection
  const start = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    try {
      if (isSupported && window.IdleDetector) {
        // Use native API
        const detector = new window.IdleDetector();
        detectorRef.current = detector;

        // Request permission if needed
        if (requestPermission) {
          const permission = await window.IdleDetector.requestPermission();
          setIsPermissionGranted(permission === "granted");
          
          if (permission === "denied") {
            onError?.(new Error("Permission denied"));
            return;
          }
        } else {
          setIsPermissionGranted(true);
        }

        // Add event listener
        detector.addEventListener("change", handleChange);

        // Start detection
        await detector.start({ threshold: actualThreshold });
      } else {
        // Use polyfill
        const polyfill = new IdlePolyfill(actualThreshold);
        polyfillRef.current = polyfill;
        
        polyfill.addEventListener("change", handleChange);
        polyfill.start();
        
        setIsPermissionGranted(true); // Polyfill doesn't need permission
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to start idle detection"));
    }
  }, [isSupported, requestPermission, actualThreshold, handleChange, onError]);

  // Stop detection
  const stop = useCallback(() => {
    if (!startedRef.current) return;
    startedRef.current = false;

    if (detectorRef.current) {
      detectorRef.current.removeEventListener("change", handleChange);
      detectorRef.current = null;
    }

    if (polyfillRef.current) {
      polyfillRef.current.removeEventListener("change", handleChange);
      polyfillRef.current.stop();
      polyfillRef.current = null;
    }

    // Reset state
    setIsIdle(false);
    setUserState("active");
    setScreenState("unlocked");
  }, [handleChange]);

  // Auto-start effect
  useEffect(() => {
    if (autoStart && !startedRef.current) {
      start();
    }
  }, [autoStart, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isIdle,
    userState,
    screenState,
    isSupported,
    isPermissionGranted,
    start,
    stop,
  };
}
