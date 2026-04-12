/**
 * useWebSocket
 * @description Manages a WebSocket connection with auto-reconnect, manual connect/disconnect, and SSR safety.
 * @see {@link https://rooks.vercel.app/docs/hooks/useWebSocket}
 */
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * WebSocket ready state values mirroring the WebSocket API constants.
 *
 * - 0 CONNECTING: Socket has been created and the connection is not yet open.
 * - 1 OPEN: The connection is open and ready to communicate.
 * - 2 CLOSING: The connection is in the process of closing.
 * - 3 CLOSED: The connection is closed or couldn't be opened.
 */
const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

type ReadyStateValue = (typeof ReadyState)[keyof typeof ReadyState];

/**
 * Options for the useWebSocket hook.
 */
type UseWebSocketOptions = {
  /**
   * WebSocket sub-protocols to negotiate with the server.
   */
  protocols?: string | string[];
  /**
   * Whether to automatically reconnect when the connection closes abnormally.
   * @default true
   */
  reconnect?: boolean;
  /**
   * Maximum number of automatic reconnect attempts before giving up.
   * @default 3
   */
  reconnectLimit?: number;
  /**
   * Milliseconds to wait between reconnect attempts.
   * @default 3000
   */
  reconnectInterval?: number;
  /**
   * When true the connection is NOT opened automatically on mount.
   * Call the returned `connect` function to connect manually.
   * @default false
   */
  manual?: boolean;
  /**
   * Callback fired when the connection is successfully opened.
   */
  onOpen?: (event: Event) => void;
  /**
   * Callback fired when the connection is closed.
   */
  onClose?: (event: CloseEvent) => void;
  /**
   * Callback fired when a message is received.
   */
  onMessage?: (event: MessageEvent) => void;
  /**
   * Callback fired when a connection error occurs.
   */
  onError?: (event: Event) => void;
};

/**
 * Controls returned as the second element of the useWebSocket tuple.
 */
type UseWebSocketControls = {
  /**
   * Current ready state of the WebSocket connection.
   * Mirrors WebSocket constants: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED.
   * Returns CLOSED (3) during SSR.
   */
  readyState: ReadyStateValue;
  /**
   * Sends data through the open WebSocket connection.
   * Is a no-op when the socket is not OPEN or during SSR.
   */
  sendMessage: (
    data: string | ArrayBufferLike | Blob | ArrayBufferView
  ) => void;
  /**
   * Opens the WebSocket connection (or re-opens it after disconnect).
   * Resets the reconnect attempt counter. No-op during SSR.
   */
  connect: () => void;
  /**
   * Closes the WebSocket connection with a normal closure code (1000).
   * Suppresses any subsequent auto-reconnect. No-op during SSR.
   */
  disconnect: () => void;
};

/**
 * Return type of useWebSocket: `[latestMessage, controls]`.
 */
type UseWebSocketReturn = [MessageEvent | null, UseWebSocketControls];

const IS_SERVER = typeof window === "undefined";

/**
 * useWebSocket hook
 *
 * Manages a WebSocket connection lifecycle: connects on mount (unless `manual`
 * is set), auto-reconnects on abnormal closure up to `reconnectLimit` times,
 * and cleans up on unmount. Safe to use with SSR frameworks — on the server
 * `readyState` is CLOSED and all control functions are no-ops.
 *
 * @param {string} url - The WebSocket server URL to connect to (e.g. `"wss://example.com/ws"`).
 * @param {UseWebSocketOptions} options - Optional configuration.
 * @param {string | string[]} options.protocols - Sub-protocols to negotiate.
 * @param {boolean} options.reconnect - Auto-reconnect on abnormal close. Defaults to `true`.
 * @param {number} options.reconnectLimit - Max reconnect attempts. Defaults to `3`.
 * @param {number} options.reconnectInterval - Ms between retries. Defaults to `3000`.
 * @param {boolean} options.manual - Skip auto-connect on mount. Defaults to `false`.
 * @param {(event: Event) => void} options.onOpen - Called when connection opens.
 * @param {(event: CloseEvent) => void} options.onClose - Called when connection closes.
 * @param {(event: MessageEvent) => void} options.onMessage - Called when a message arrives.
 * @param {(event: Event) => void} options.onError - Called on connection error.
 * @returns {UseWebSocketReturn} Tuple of `[latestMessage, { readyState, sendMessage, connect, disconnect }]`.
 * @see https://rooks.vercel.app/docs/hooks/useWebSocket
 *
 * @example
 * function ChatRoom() {
 *   const [message, { readyState, sendMessage, disconnect, connect }] = useWebSocket(
 *     "wss://echo.example.com",
 *     {
 *       onMessage: (event) => console.log("received:", event.data),
 *       reconnect: true,
 *       reconnectLimit: 5,
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       <p>Status: {readyState === 1 ? "Open" : "Closed"}</p>
 *       <p>Last message: {message?.data ?? "—"}</p>
 *       <button onClick={() => sendMessage("ping")}>Ping</button>
 *       <button onClick={disconnect}>Disconnect</button>
 *       <button onClick={connect}>Connect</button>
 *     </div>
 *   );
 * }
 */
function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    protocols,
    reconnect = true,
    reconnectLimit = 3,
    reconnectInterval = 3000,
    manual = false,
    onOpen,
    onClose,
    onMessage,
    onError,
  } = options;

  const [readyState, setReadyState] = useState<ReadyStateValue>(
    ReadyState.CLOSED
  );
  const [latestMessage, setLatestMessage] = useState<MessageEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * When false the reconnect loop is suppressed (set by disconnect() or on unmount).
   */
  const shouldReconnectRef = useRef(!manual);
  const unmountedRef = useRef(false);

  // Consolidate volatile options into a single ref so connectInternal always
  // reads the latest values without being recreated on every option change.
  const optionsRef = useRef({
    url,
    protocols,
    reconnect,
    reconnectLimit,
    reconnectInterval,
  });
  // No deps — runs after every render to stay in sync.
  useEffect(() => {
    optionsRef.current = {
      url,
      protocols,
      reconnect,
      reconnectLimit,
      reconnectInterval,
    };
  });

  // Keep event-handler callbacks in refs so they never cause the WebSocket to
  // be recreated when the caller passes a new function reference.
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onOpenRef.current = onOpen;
  });
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    onMessageRef.current = onMessage;
  });
  useEffect(() => {
    onErrorRef.current = onError;
  });

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  /**
   * Ref used by the reconnect timer to invoke connectInternal without
   * creating a circular useCallback dependency.
   */
  const connectInternalRef = useRef<() => void>(() => {});

  /**
   * Creates (or re-creates) the WebSocket instance. Reads all connection
   * parameters from optionsRef so it is safe to keep a stable reference.
   */
  const connectInternal = useCallback(() => {
    if (IS_SERVER) return;

    // Detach handlers from any existing socket before closing it so the
    // onclose handler of the old socket cannot trigger a reconnect loop.
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    clearReconnectTimer();

    const {
      url: currentUrl,
      protocols: currentProtocols,
    } = optionsRef.current;

    const ws = new WebSocket(currentUrl, currentProtocols);
    wsRef.current = ws;
    setReadyState(ReadyState.CONNECTING);

    ws.onopen = (event: Event) => {
      if (unmountedRef.current) return;
      reconnectCountRef.current = 0;
      setReadyState(ReadyState.OPEN);
      onOpenRef.current?.(event);
    };

    ws.onclose = (event: CloseEvent) => {
      if (unmountedRef.current) return;
      wsRef.current = null;
      setReadyState(ReadyState.CLOSED);
      onCloseRef.current?.(event);

      const {
        reconnect: shouldAutoReconnect,
        reconnectLimit: limit,
        reconnectInterval: interval,
      } = optionsRef.current;

      // Only reconnect on abnormal closures:
      // 1000 = normal closure, 1001 = going away (page navigation).
      const isAbnormalClose = event.code !== 1000 && event.code !== 1001;

      if (
        shouldAutoReconnect &&
        shouldReconnectRef.current &&
        isAbnormalClose &&
        reconnectCountRef.current < limit
      ) {
        reconnectCountRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          if (!unmountedRef.current && shouldReconnectRef.current) {
            connectInternalRef.current();
          }
        }, interval);
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      if (unmountedRef.current) return;
      setLatestMessage(event);
      onMessageRef.current?.(event);
    };

    ws.onerror = (event: Event) => {
      if (unmountedRef.current) return;
      onErrorRef.current?.(event);
    };
  }, [clearReconnectTimer]);

  // Keep the ref pointing at the latest (stable) function.
  connectInternalRef.current = connectInternal;

  /**
   * Exposed `connect`: resets counters and opens the connection.
   * Use when `manual: true` or after calling `disconnect`.
   */
  const connect = useCallback(() => {
    if (IS_SERVER) return;
    shouldReconnectRef.current = true;
    reconnectCountRef.current = 0;
    connectInternal();
  }, [connectInternal]);

  /**
   * Exposed `disconnect`: closes the connection with a normal code and
   * prevents any pending or future auto-reconnect from firing.
   */
  const disconnect = useCallback(() => {
    if (IS_SERVER) return;
    shouldReconnectRef.current = false;
    clearReconnectTimer();
    if (wsRef.current) {
      setReadyState(ReadyState.CLOSING);
      wsRef.current.close(1000);
    }
  }, [clearReconnectTimer]);

  /**
   * Sends data over the open connection. Silently no-ops if not OPEN.
   */
  const sendMessage = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (IS_SERVER) return;
      if (wsRef.current?.readyState === ReadyState.OPEN) {
        wsRef.current.send(data);
      }
    },
    []
  );

  // Connect (or disconnect) when the URL, protocols, or manual flag changes.
  useEffect(() => {
    if (IS_SERVER) return;

    unmountedRef.current = false;
    shouldReconnectRef.current = !manual;

    if (!manual) {
      connectInternal();
    }

    return () => {
      unmountedRef.current = true;
      clearReconnectTimer();
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onclose = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url, protocols, manual, connectInternal, clearReconnectTimer]);

  return [
    latestMessage,
    {
      readyState,
      sendMessage,
      connect,
      disconnect,
    },
  ];
}

export { useWebSocket, ReadyState };
export type {
  UseWebSocketOptions,
  UseWebSocketControls,
  UseWebSocketReturn,
  ReadyStateValue,
};
