import { useState, useCallback } from "react";

/**
 * Options for the Web Share API
 */
interface ShareData {
  /**
   * Title to share
   */
  title?: string;
  /**
   * Text to share
   */
  text?: string;
  /**
   * URL to share
   */
  url?: string;
  /**
   * Files to share (if supported)
   */
  files?: File[];
}

/**
 * Return value for the useShare hook
 */
interface UseShareReturnValue {
  /**
   * Share content using the Web Share API
   * @param data - Data to share
   * @returns Promise that resolves when sharing is complete
   */
  share: (data: ShareData) => Promise<void>;
  /**
   * Whether the Web Share API is supported
   */
  isSupported: boolean;
  /**
   * Any error that occurred during sharing
   */
  error: Error | null;
  /**
   * Whether sharing is currently in progress
   */
  isSharing: boolean;
}

/**
 * useShare hook
 *
 * Web Share API for native sharing on mobile and desktop.
 * Provides an easy way to share content using the device's native share dialog.
 *
 * @returns Object containing share function and state
 *
 * @example
 * ```tsx
 * import { useShare } from "rooks";
 *
 * function ShareButton() {
 *   const { share, isSupported, error, isSharing } = useShare();
 *
 *   const handleShare = async () => {
 *     await share({
 *       title: "Check this out!",
 *       text: "This is an amazing article",
 *       url: "https://example.com/article",
 *     });
 *   };
 *
 *   if (!isSupported) {
 *     return <div>Sharing not supported on this device</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleShare} disabled={isSharing}>
 *         {isSharing ? "Sharing..." : "Share"}
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useShare
 */
function useShare(): UseShareReturnValue {
  const [error, setError] = useState<Error | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "share" in navigator;

  const share = useCallback(
    async (data: ShareData): Promise<void> => {
      if (!isSupported) {
        const err = new Error("Web Share API is not supported");
        setError(err);
        throw err;
      }

      try {
        setIsSharing(true);
        setError(null);

        await navigator.share(data);
      } catch (err) {
        // AbortError is thrown when user cancels the share dialog
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled, don't treat as error
          setError(null);
        } else {
          const error =
            err instanceof Error ? err : new Error("Failed to share");
          setError(error);
          throw error;
        }
      } finally {
        setIsSharing(false);
      }
    },
    [isSupported]
  );

  return {
    share,
    isSupported,
    error,
    isSharing,
  };
}

export { useShare };
export type { UseShareReturnValue, ShareData };
