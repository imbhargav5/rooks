import { useCallback, useEffect, useState, RefObject } from "react";

type PictureInPictureApi = {
  isPiPActive: boolean;
  isSupported: boolean;
  error: Error | null;
  pipWindow: PictureInPictureWindow | null;
  enterPiP: () => Promise<void>;
  exitPiP: () => Promise<void>;
  toggle: () => Promise<void>;
};

/**
 * Hook for managing Picture-in-Picture video functionality
 *
 * @param videoRef - Reference to the video element
 * @returns Object containing PiP state and control functions
 * @see https://rooks.vercel.app/docs/hooks/usePictureInPictureApi
 */
function usePictureInPictureApi(videoRef: RefObject<HTMLVideoElement>): PictureInPictureApi {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pipWindow, setPipWindow] = useState<PictureInPictureWindow | null>(null);

  // Check if Picture-in-Picture is supported (reactive)
  const isSupported = useCallback((): boolean => {
    if (!videoRef.current) return false;
    if (!document.pictureInPictureEnabled) return false;
    if (!videoRef.current.requestPictureInPicture) return false;
    if (videoRef.current.disablePictureInPicture) return false;
    return true;
  }, [videoRef]);

  // Check if current video is in PiP mode
  const checkPiPActive = useCallback((): boolean => {
    return document.pictureInPictureElement === videoRef.current;
  }, [videoRef]);

  // Update PiP active state
  const updatePiPState = useCallback(() => {
    setIsPiPActive(checkPiPActive());
  }, [checkPiPActive]);

  // Enter Picture-in-Picture mode
  const enterPiP = useCallback(async (): Promise<void> => {
    if (!isSupported() || !videoRef.current) {
      return;
    }

    try {
      setError(null);
      await videoRef.current.requestPictureInPicture();
      // Note: pipWindow is set via enterpictureinpicture event (best practice)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [isSupported, videoRef]);

  // Exit Picture-in-Picture mode
  const exitPiP = useCallback(async (): Promise<void> => {
    if (!document.pictureInPictureElement) {
      return;
    }

    try {
      setError(null);
      await document.exitPictureInPicture();
      // Note: pipWindow is cleared via leavepictureinpicture event (best practice)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  // Toggle Picture-in-Picture mode
  const toggle = useCallback(async (): Promise<void> => {
    if (checkPiPActive()) {
      await exitPiP();
    } else {
      await enterPiP();
    }
  }, [checkPiPActive, exitPiP, enterPiP]);

  // Handle enter Picture-in-Picture event
  const handleEnterPiP = useCallback((event: Event) => {
    const pipEvent = event as PictureInPictureEvent;
    setPipWindow(pipEvent.pictureInPictureWindow);
    setIsPiPActive(true);
  }, []);

  // Handle leave Picture-in-Picture event
  const handleLeavePiP = useCallback(() => {
    setPipWindow(null);
    setIsPiPActive(false);
  }, []);

  // Set up event listeners and handle video element changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

    // Initialize PiP state
    updatePiPState();

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [videoRef.current, handleEnterPiP, handleLeavePiP, updatePiPState]);

  return {
    isPiPActive,
    isSupported: isSupported(),
    error,
    pipWindow,
    enterPiP,
    exitPiP,
    toggle,
  };
}

export { usePictureInPictureApi };