import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * WebSocket ready state values matching the WebSocket API specification
 */
type WebSocketReadyState = 0 | 1 | 2 | 3;

/**
 * Options for the useWebSocket hook
 */
type UseWebSocketOptions = {
  /**
   * Callback fired when the WebSocket connection opens
   */
  onOpen?: (event: Event) => void;

  /**
   * Callback fired when a message is received
   */
  onMessage?: (event: MessageEvent) => void;

  /**
   * Callback fired when the WebSocket connection closes
   */
  onClose?: (event: CloseEvent) => void;

  /**
   * Callback fired when a WebSocket error occurs
   */
  onError?: (event: Event) => void;

  /**
   * Whether to automatically reconnect on connection loss
   * @default false
   */
  reconnect?: boolean;

  /**
   * Base interval in milliseconds between reconnection attempts (uses exponential backoff)
   * @default 1000
   */
  reconnectInterval?: number;

  /**
   * Maximum number of reconnection attempts
   * @default 3
   */
  reconnectAttempts?: number;

  /**
   * Optional WebSocket sub-protocol(s) to use
   */
  protocols?: string | string[];
};

/**
 * Return type for the useWebSocket hook
 */
type UseWebSocketReturn = {
  /**
   * Current WebSocket ready state: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
   */
  readyState: WebSocketReadyState;

  /**
   * The most recently received MessageEvent, or null if no message received yet
   */
  lastMessage: MessageEvent | null;

  /**
   * Send data through the WebSocket connection
   */
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;

  /**
   * Manually initiate or re-establish the WebSocket connection
   */
  connect: () => void;

  /**
   * Manually close the WebSocket connection and disable auto-reconnect
   */
  disconnect: () => void;

  /**
   * Whether the WebSocket API is supported in the current environment
   */
  isSupported: boolean;
};

/**
 * useWebSocket
 *
 * @description A React hook that manages a WebSocket connection with auto-reconnect,
 * message handling, ready state tracking, and manual connect/disconnect control.
 * @param url - The WebSocket URL to connect to, or null to skip connecting
 * @param options - Configuration options for callbacks, reconnect behavior, and protocols
 * @returns Object with readyState, lastMessage, send, connect, disconnect, and isSupported
 * @see {@link https://rooks.vercel.app/docs/hooks/useWebSocket}
 */
function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  // Check WebSocket API support
  const isSupported = useMemo(() => {
    return typeof window !== "undefined" && typeof WebSocket !== "undefined";
  }, []);

  // Refs for the socket instance and reconnect timer
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectCountRef = useRef(0);
  const manualDisconnectRef = useRef(false);

  // Keep fresh references to url and options without triggering re-connections
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  useEffect(() => {
    optionsRef.current = options;
  });

  const [readyState, setReadyState] = useState<WebSocketReadyState>(3); // WebSocket.CLOSED
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  // Internal function to create and wire up a new WebSocket connection
  const createConnection = useCallback(
    (wsUrl: string) => {
      if (!isSupported) return;

      try {
        const { protocols } = optionsRef.current;
        const ws = protocols
          ? new WebSocket(wsUrl, protocols)
          : new WebSocket(wsUrl);

        wsRef.current = ws;
        setReadyState(0); // WebSocket.CONNECTING

        ws.addEventListener("open", (event) => {
          reconnectCountRef.current = 0;
          setReadyState(1); // WebSocket.OPEN
          optionsRef.current.onOpen?.(event);
        });

        ws.addEventListener("message", (event: MessageEvent) => {
          setLastMessage(event);
          optionsRef.current.onMessage?.(event);
        });

        ws.addEventListener("close", (event: CloseEvent) => {
          setReadyState(3); // WebSocket.CLOSED
          optionsRef.current.onClose?.(event);

          // Attempt auto-reconnect if enabled and not manually disconnected
          const {
            reconnect = false,
            reconnectInterval = 1000,
            reconnectAttempts = 3,
          } = optionsRef.current;

          if (
            !manualDisconnectRef.current &&
            reconnect &&
            reconnectCountRef.current < reconnectAttempts
          ) {
            const delay =
              reconnectInterval * Math.pow(2, reconnectCountRef.current);
            reconnectCountRef.current += 1;
            reconnectTimerRef.current = setTimeout(() => {
              if (!manualDisconnectRef.current && urlRef.current) {
                createConnection(urlRef.current);
              }
            }, delay);
          }
        });

        ws.addEventListener("error", (event) => {
          setReadyState(ws.readyState as WebSocketReadyState);
          optionsRef.current.onError?.(event);
        });
      } catch (error) {
        console.error("useWebSocket: Failed to create WebSocket connection", error);
      }
    },
    [isSupported]
  );

  // Manually initiate or re-establish the connection
  const connect = useCallback(() => {
    if (!isSupported || !urlRef.current) return;

    manualDisconnectRef.current = false;
    reconnectCountRef.current = 0;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    createConnection(urlRef.current);
  }, [isSupported, createConnection]);

  // Manually close and prevent auto-reconnect
  const disconnect = useCallback(() => {
    manualDisconnectRef.current = true;
    reconnectCountRef.current = 0;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setReadyState(3); // WebSocket.CLOSED
  }, []);

  // Send data through the open WebSocket
  const send = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (!wsRef.current || wsRef.current.readyState !== 1 /* WebSocket.OPEN */) {
        console.warn("useWebSocket: WebSocket is not open");
        return;
      }
      wsRef.current.send(data);
    },
    []
  );

  // Auto-connect when url is provided; re-connect when url changes
  useEffect(() => {
    if (!isSupported || !url) return;

    manualDisconnectRef.current = false;
    createConnection(url);

    return () => {
      manualDisconnectRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url, isSupported, createConnection]);

  return {
    readyState,
    lastMessage,
    send,
    connect,
    disconnect,
    isSupported,
  };
}

export { useWebSocket };
export type { UseWebSocketOptions, UseWebSocketReturn, WebSocketReadyState };
