import { useCallback, useState } from "react";

export type ShareContent = {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
};

export type ShareHandler = {
    share: (content: ShareContent) => Promise<boolean>;
    canShare: (content?: ShareContent) => boolean;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useShare
 * @description A hook for the Web Share API
 * @returns {ShareHandler} Methods and state for sharing content
 * @see {@link https://rooks.vercel.app/docs/useShare}
 *
 * @example
 *
 * const { share, canShare, error } = useShare();
 *
 * // Share content
 * if (canShare) {
 *   share({
 *     title: "Check this out!",
 *     text: "Interesting article about React hooks",
 *     url: "https://example.com/article"
 *   });
 * }
 */
function useShare(): ShareHandler {
    const [error, setError] = useState<Error | null>(null);
    const isSupported = typeof navigator !== "undefined" && !!navigator.share;

    const canShare = useCallback((content?: ShareContent): boolean => {
        if (!isSupported) {
            return false;
        }

        if (!content) {
            return true;
        }

        // Check if we can share files
        if (content.files && content.files.length > 0) {
            return typeof navigator !== "undefined" && !!navigator.canShare && navigator.canShare({ files: content.files });
        }

        // We can share without files if supported
        return true;
    }, [isSupported]);

    const share = useCallback(async (content: ShareContent): Promise<boolean> => {
        if (!isSupported) {
            const error = new Error("Web Share API is not supported in this browser");
            setError(error);
            return false;
        }

        try {
            await navigator.share(content);
            return true;
        } catch (err) {
            // Don't set error if user cancelled sharing
            if (err instanceof Error && err.name === "AbortError") {
                return false;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported]);

    return {
        share,
        canShare,
        error,
        isSupported
    };
}

export { useShare }; 