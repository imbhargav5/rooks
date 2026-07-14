import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFreshRef } from "./useFreshRef";

export type UseWebSocketStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "unsupported";

export type UseWebSocketReconnectOptions = {
  attempts?: number;
  intervalMs?: number | ((attempt: number) => number);
};

export type UseWebSocketOptions<TIncoming> = {
  protocols?: string | string[];
  autoConnect?: boolean;
  reconnect?: boolean | UseWebSocketReconnectOptions;
  parseMessage?: (event: MessageEvent) => TIncoming;
  binaryType?: BinaryType;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent, parsed: TIncoming) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event | Error) => void;
};

export type UseWebSocketReturnValue<TIncoming> = {
  socket: WebSocket | null;
  status: UseWebSocketStatus;
  lastMessage: TIncoming | null;
  lastMessageEvent: MessageEvent | null;
  error: Event | Error | null;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  sendJson: (data: unknown) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
};

function toReconnectDelay(
  reconnect: boolean | UseWebSocketReconnectOptions | undefined,
  attempt: number
) {
  if (!reconnect || reconnect === true) {
    return 1_000;
  }

  if (typeof reconnect.intervalMs === "function") {
    return reconnect.intervalMs(attempt);
  }

  return reconnect.intervalMs ?? 1_000;
}

function shouldReconnect(
  reconnect: boolean | UseWebSocketReconnectOptions | undefined,
  attempt: number
) {
  if (!reconnect) {
    return false;
  }

  if (reconnect === true) {
    return true;
  }

  const maxAttempts = reconnect.attempts ?? Infinity;
  return attempt <= maxAttempts;
}

function callWebSocketCallback<TArgs extends unknown[]>(
  callback: ((...args: TArgs) => void) | undefined,
  ...args: TArgs
) {
  try {
    callback?.(...args);
  } catch {
    // Consumer callbacks cannot interrupt connection bookkeeping.
  }
}

/**
 * useWebSocket
 * @description WebSocket lifecycle hook with optional reconnection.
 * @see {@link https://rooks.vercel.app/docs/hooks/useWebSocket}
 */
function useWebSocket<TIncoming = unknown>(
  url: string,
  options: UseWebSocketOptions<TIncoming> = {}
): UseWebSocketReturnValue<TIncoming> {
  const {
    protocols,
    autoConnect = true,
    reconnect = false,
    parseMessage = (event: MessageEvent) => event.data as TIncoming,
    binaryType,
    onOpen,
    onMessage,
    onClose,
    onError,
  } = options;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<UseWebSocketStatus>("idle");
  const [lastMessage, setLastMessage] = useState<TIncoming | null>(null);
  const [lastMessageEvent, setLastMessageEvent] = useState<MessageEvent | null>(
    null
  );
  const [error, setError] = useState<Event | Error | null>(null);
  const protocolsKey = JSON.stringify({
    kind: Array.isArray(protocols) ? "array" : typeof protocols,
    value: protocols,
  });
  const normalizedProtocols = useMemo(
    () =>
      JSON.parse(protocolsKey) as {
        kind: "array" | "string" | "undefined";
        value?: string | string[];
      },
    [protocolsKey]
  );

  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const explicitDisconnectRef = useRef(false);
  const activeSocketRef = useRef<WebSocket | null>(null);
  const isMountedRef = useRef(false);
  const reconnectRef = useFreshRef(reconnect, true);
  const callbacksRef = useFreshRef(
    {
      parseMessage,
      onOpen,
      onMessage,
      onClose,
      onError,
    },
    true
  );

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const disposeActiveSocket = useCallback(() => {
    clearReconnectTimer();
    const currentSocket = activeSocketRef.current;
    activeSocketRef.current = null;
    explicitDisconnectRef.current = true;

    if (
      currentSocket &&
      currentSocket.readyState !== 3 &&
      currentSocket.readyState !== 2
    ) {
      try {
        currentSocket.close();
      } catch {
        // Cleanup is best-effort and stale socket events are ignored by identity.
      }
    }
  }, [clearReconnectTimer]);

  const connect = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (typeof WebSocket === "undefined") {
      setStatus("unsupported");
      setSocket(null);
      return;
    }

    const currentSocket = activeSocketRef.current;
    if (
      currentSocket &&
      (currentSocket.readyState === WebSocket.CONNECTING ||
        currentSocket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    clearReconnectTimer();
    explicitDisconnectRef.current = false;
    setStatus("connecting");
    setError(null);

    let nextSocket: WebSocket;
    try {
      nextSocket = new WebSocket(url, normalizedProtocols.value);
    } catch (connectionError) {
      const normalizedError =
        connectionError instanceof Error
          ? connectionError
          : new Error(String(connectionError));
      setError(normalizedError);
      setStatus("closed");
      callWebSocketCallback(callbacksRef.current.onError, normalizedError);
      return;
    }

    if (binaryType) {
      nextSocket.binaryType = binaryType;
    }
    activeSocketRef.current = nextSocket;
    setSocket(nextSocket);

    nextSocket.addEventListener("open", (event) => {
      if (!isMountedRef.current || activeSocketRef.current !== nextSocket) {
        return;
      }

      reconnectAttemptsRef.current = 0;
      setStatus("open");
      callWebSocketCallback(callbacksRef.current.onOpen, event);
    });

    nextSocket.addEventListener("message", (event) => {
      if (!isMountedRef.current || activeSocketRef.current !== nextSocket) {
        return;
      }

      setLastMessageEvent(event);
      try {
        const parsed = callbacksRef.current.parseMessage(event);
        setLastMessage(parsed);
        callWebSocketCallback(callbacksRef.current.onMessage, event, parsed);
      } catch (parseError) {
        const normalizedError =
          parseError instanceof Error
            ? parseError
            : new Error(String(parseError));
        setError(normalizedError);
        callWebSocketCallback(callbacksRef.current.onError, normalizedError);
      }
    });

    nextSocket.addEventListener("error", (event) => {
      if (!isMountedRef.current || activeSocketRef.current !== nextSocket) {
        return;
      }

      setError(event);
      callWebSocketCallback(callbacksRef.current.onError, event);
    });

    nextSocket.addEventListener("close", (event) => {
      if (!isMountedRef.current || activeSocketRef.current !== nextSocket) {
        return;
      }

      activeSocketRef.current = null;
      setSocket(null);
      setStatus("closed");
      callWebSocketCallback(callbacksRef.current.onClose, event);

      if (explicitDisconnectRef.current) {
        explicitDisconnectRef.current = false;
        return;
      }

      reconnectAttemptsRef.current += 1;

      if (shouldReconnect(reconnectRef.current, reconnectAttemptsRef.current)) {
        let delay: number;
        try {
          delay = toReconnectDelay(
            reconnectRef.current,
            reconnectAttemptsRef.current
          );
        } catch (delayError) {
          const normalizedError =
            delayError instanceof Error
              ? delayError
              : new Error(String(delayError));
          setError(normalizedError);
          callWebSocketCallback(callbacksRef.current.onError, normalizedError);
          return;
        }
        reconnectTimerRef.current = window.setTimeout(
          () => {
            reconnectTimerRef.current = null;
            if (isMountedRef.current && !explicitDisconnectRef.current) {
              connect();
            }
          },
          Math.max(0, delay)
        );
      }
    });
  }, [
    activeSocketRef,
    binaryType,
    callbacksRef,
    clearReconnectTimer,
    isMountedRef,
    normalizedProtocols.value,
    reconnectRef,
    url,
  ]);

  const disconnect = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    explicitDisconnectRef.current = true;
    clearReconnectTimer();

    const currentSocket = activeSocketRef.current;
    if (!currentSocket) {
      setStatus("closed");
      return;
    }

    setStatus("closing");
    currentSocket.close();
  }, [activeSocketRef, clearReconnectTimer]);

  const reconnectSocket = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    clearReconnectTimer();
    const currentSocket = activeSocketRef.current;
    activeSocketRef.current = null;
    setSocket(null);
    explicitDisconnectRef.current = true;

    if (
      currentSocket &&
      currentSocket.readyState !== 3 &&
      currentSocket.readyState !== 2
    ) {
      try {
        currentSocket.close();
      } catch {
        // The replacement connection still proceeds when closing fails.
      }
    }

    explicitDisconnectRef.current = false;
    connect();
  }, [activeSocketRef, clearReconnectTimer, connect]);

  const send = useCallback(
    (dataToSend: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      const currentSocket = activeSocketRef.current;
      if (currentSocket?.readyState === 1) {
        currentSocket.send(dataToSend);
      }
    },
    [activeSocketRef]
  );

  const sendJson = useCallback(
    (value: unknown) => {
      send(JSON.stringify(value));
    },
    [send]
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      disposeActiveSocket();
    };
  }, [disposeActiveSocket]);

  useEffect(() => {
    if (typeof WebSocket === "undefined") {
      setSocket(null);
      setStatus("unsupported");
    } else if (autoConnect) {
      connect();
    } else {
      setSocket(null);
      setStatus("idle");
    }

    return () => {
      disposeActiveSocket();
    };
  }, [
    autoConnect,
    binaryType,
    connect,
    disposeActiveSocket,
    protocolsKey,
    url,
  ]);

  return {
    socket,
    status,
    lastMessage,
    lastMessageEvent,
    error,
    send,
    sendJson,
    connect,
    disconnect,
    reconnect: reconnectSocket,
  };
}

export { useWebSocket };
