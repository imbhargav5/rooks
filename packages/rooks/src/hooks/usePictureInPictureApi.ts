import { useCallback, useEffect, useRef, useState, RefObject } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";

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
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pipWindow, setPipWindow] = useState<PictureInPictureWindow | null>(null);
  const attachedVideoRef = useRef<HTMLVideoElement | null>(null);

  // Check if Picture-in-Picture is supported (reactive)
  const getIsSupported = useCallback((): boolean => {
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
    if (!getIsSupported() || !videoRef.current) {
      return;
    }

    try {
      setError(null);
      await videoRef.current.requestPictureInPicture();
      // Note: pipWindow is set via enterpictureinpicture event (best practice)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [getIsSupported, videoRef]);

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

  // Reconcile after refs have been committed. RefObject.current can change
  // without the RefObject identity changing.
  useIsomorphicEffect(() => {
    const video = videoRef.current;
    const nextIsSupported = getIsSupported();
    setIsSupported((current) =>
      current === nextIsSupported ? current : nextIsSupported
    );

    if (attachedVideoRef.current === video) {
      return;
    }

    attachedVideoRef.current?.removeEventListener(
      "enterpictureinpicture",
      handleEnterPiP
    );
    attachedVideoRef.current?.removeEventListener(
      "leavepictureinpicture",
      handleLeavePiP
    );
    attachedVideoRef.current = video;

    if (video) {
      video.addEventListener("enterpictureinpicture", handleEnterPiP);
      video.addEventListener("leavepictureinpicture", handleLeavePiP);
      updatePiPState();
    }
  });

  useEffect(() => {
    return () => {
      attachedVideoRef.current?.removeEventListener(
        "enterpictureinpicture",
        handleEnterPiP
      );
      attachedVideoRef.current?.removeEventListener(
        "leavepictureinpicture",
        handleLeavePiP
      );
      attachedVideoRef.current = null;
    };
  }, [handleEnterPiP, handleLeavePiP]);

  return {
    isPiPActive,
    isSupported,
    error,
    pipWindow,
    enterPiP,
    exitPiP,
    toggle,
  };
}

export { usePictureInPictureApi };
