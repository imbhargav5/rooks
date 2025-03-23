import { useCallback, useEffect, useRef, useState } from "react";

export type BroadcastChannelHandler = {
    postMessage: <T>(message: T) => void;
    lastMessage: any;
    error: Error | null;
    isSupported: boolean;
    close: () => void;
};

/**
 * useBroadcastChannel
 * @description A hook for communication between browser tabs
 * @param {string} channelName The name of the broadcast channel
 * @returns {BroadcastChannelHandler} Methods and state for broadcast communication
 * @see {@link https://rooks.vercel.app/docs/useBroadcastChannel}
 *
 * @example
 *
 * const { postMessage, lastMessage, error } = useBroadcastChannel("app-sync");
 *
 * // Send a message to other tabs
 * postMessage({ type: "USER_LOGGED_IN", payload: { userId: 123 } });
 *
 * // React to messages from other tabs
 * console.log(lastMessage);
 */
function useBroadcastChannel(channelName: string): BroadcastChannelHandler {
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        const isBroadcastChannelSupported = typeof BroadcastChannel !== "undefined";
        setIsSupported(isBroadcastChannelSupported);

        if (!isBroadcastChannelSupported) {
            setError(new Error("BroadcastChannel API is not supported in this browser"));
            return;
        }

        try {
            // Create a new channel
            channelRef.current = new BroadcastChannel(channelName);

            // Set up message handler
            channelRef.current.onmessage = (event: MessageEvent) => {
                setLastMessage(event.data);
            };

            // Set up error handler
            channelRef.current.onmessageerror = (event: MessageEvent) => {
                setError(new Error(`Failed to deserialize message: ${JSON.stringify(event)}`));
            };
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }

        // Clean up when unmounting or when channel name changes
        return () => {
            if (channelRef.current) {
                channelRef.current.close();
                channelRef.current = null;
            }
        };
    }, [channelName]);

    const postMessage = useCallback(<T>(message: T): void => {
        if (!isSupported) {
            setError(new Error("BroadcastChannel API is not supported in this browser"));
            return;
        }

        if (!channelRef.current) {
            setError(new Error("BroadcastChannel not initialized"));
            return;
        }

        try {
            channelRef.current.postMessage(message);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported]);

    const close = useCallback((): void => {
        if (channelRef.current) {
            channelRef.current.close();
            channelRef.current = null;
        }
    }, []);

    return {
        postMessage,
        lastMessage,
        error,
        isSupported,
        close
    };
}

export { useBroadcastChannel }; 