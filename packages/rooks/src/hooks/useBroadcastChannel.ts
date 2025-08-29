import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * Type guard to check if an error can be passed to the error callback
 * Accepts both Event (from BroadcastChannel API) and Error objects
 */
function isEventLike(error: unknown): error is Event | Error {
  return error instanceof Event || error instanceof Error;
}

/**
 * Options for the useBroadcastChannel hook
 */
type UseBroadcastChannelOptions<T = any> = {
  /**
   * Callback function called when a message is received
   */
  onMessage?: (data: T) => void;

  /**
   * Callback function called when an error occurs
   */
  onError?: (error: Event) => void;
};

/**
 * Return type for the useBroadcastChannel hook
 */
type UseBroadcastChannelReturn<T = any> = {
  /**
   * Function to send a message to the broadcast channel
   */
  postMessage: (data: T) => void;

  /**
   * Function to manually close the broadcast channel
   */
  close: () => void;

  /**
   * Whether the BroadcastChannel API is supported
   */
  isSupported: boolean;
};

/**
 * useBroadcastChannel
 * 
 * @description A React hook that provides a clean interface to the Broadcast Channel API for cross-tab/window communication
 * @param channelName - The name of the broadcast channel
 * @param options - Configuration options for message and error handling
 * @returns Object with postMessage function, close function, and isSupported flag
 * @see {@link https://rooks.vercel.app/docs/hooks/useBroadcastChannel}
 */
function useBroadcastChannel<T = any>(
  channelName: string,
  options?: UseBroadcastChannelOptions<T>
): UseBroadcastChannelReturn<T> {
  const { onMessage, onError } = options || {};

  // Check if BroadcastChannel API is supported
  const isSupported = useMemo(() => {
    return typeof window !== "undefined" && typeof BroadcastChannel !== "undefined";
  }, []);

  // Store the broadcast channel instance
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Create stable callback references to prevent unnecessary re-initialization
  const stableOnMessage = useCallback(
    (event: MessageEvent<T>) => {
      if (onMessage) {
        onMessage(event.data);
      }
    },
    [onMessage]
  );

  const stableOnError = useCallback(
    (event: Event) => {
      if (onError) {
        onError(event);
      }
    },
    [onError]
  );

  // Initialize and cleanup the broadcast channel
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    try {
      // Create new broadcast channel
      const channel = new BroadcastChannel(channelName);
      channelRef.current = channel;

      // Set up message listener
      channel.addEventListener("message", stableOnMessage);

      // Set up error listener
      channel.addEventListener("messageerror", stableOnError);

      // Cleanup function
      return () => {
        channel.removeEventListener("message", stableOnMessage);
        channel.removeEventListener("messageerror", stableOnError);
        channel.close();
        channelRef.current = null;
      };
    } catch (error) {
      // Handle any errors during channel creation
      if (onError && isEventLike(error)) {
        onError(error as Event);
      }
    }
  }, [channelName, isSupported, stableOnMessage, stableOnError, onError]);

  // Post message function
  const postMessage = useCallback(
    (data: T) => {
      if (!isSupported) {
        console.warn("useBroadcastChannel: BroadcastChannel API is not supported");
        return;
      }

      if (!channelRef.current) {
        console.warn("useBroadcastChannel: Channel is not initialized");
        return;
      }

      try {
        channelRef.current.postMessage(data);
      } catch (error) {
        console.error("useBroadcastChannel: Failed to post message", error);
        if (onError && isEventLike(error)) {
          onError(error as Event);
        }
      }
    },
    [isSupported, onError]
  );

  // Manual close function
  const close = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
  }, []);

  return {
    postMessage,
    close,
    isSupported,
  };
}

export { useBroadcastChannel };