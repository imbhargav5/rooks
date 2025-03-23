import { useCallback, useEffect, useRef, useState } from "react";

type WebSocketReadyState = {
    CONNECTING: 0;
    OPEN: 1;
    CLOSING: 2;
    CLOSED: 3;
    [key: number]: string;
};

export type ConnectionStatus = "connecting" | "open" | "closing" | "closed";

export type WebSocketOptions = {
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    reconnectAttempts?: number;
    reconnectInterval?: number;
    shouldReconnect?: boolean;
    protocols?: string | string[];
};

export type WebSocketHandler = {
    sendMessage: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
    lastMessage: MessageEvent | null;
    readyState: number;
    connectionStatus: ConnectionStatus;
    connect: () => void;
    disconnect: () => void;
};

const ReadyState: WebSocketReadyState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    0: "connecting",
    1: "open",
    2: "closing",
    3: "closed",
};

/**
 * useWebSocket
 * @description A hook for WebSocket connections and real-time communication
 * @param {string} url The WebSocket URL to connect to
 * @param {WebSocketOptions} options Options for WebSocket connection
 * @returns {WebSocketHandler} Methods and state for WebSocket management
 * @see {@link https://rooks.vercel.app/docs/useWebSocket}
 *
 * @example
 *
 * const { 
 *   sendMessage, 
 *   lastMessage, 
 *   readyState, 
 *   connectionStatus, 
 *   connect, 
 *   disconnect 
 * } = useWebSocket("wss://echo.websocket.org");
 *
 * // Send a message
 * sendMessage("Hello WebSocket");
 *
 * // Get last received message
 * console.log(lastMessage);
 *
 * // Connect/disconnect manually
 * disconnect();
 * connect();
 */
function useWebSocket(url: string, options: WebSocketOptions = {}): WebSocketHandler {
    const {
        onOpen,
        onClose,
        onMessage,
        onError,
        reconnectAttempts = 5,
        reconnectInterval = 3000,
        shouldReconnect = true,
        protocols,
    } = options;

    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const [readyState, setReadyState] = useState<number>(ReadyState.CLOSED);
    const webSocketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectCountRef = useRef<number>(0);

    const connect = useCallback(() => {
        if (webSocketRef.current?.readyState === ReadyState.OPEN) {
            return;
        }

        // Close any existing socket
        if (webSocketRef.current) {
            webSocketRef.current.close();
        }

        // Create a new WebSocket connection
        webSocketRef.current = new WebSocket(url, protocols);
        setReadyState(ReadyState.CONNECTING);

        webSocketRef.current.onopen = (event: Event) => {
            setReadyState(ReadyState.OPEN);
            reconnectCountRef.current = 0;
            onOpen?.(event);
        };

        webSocketRef.current.onclose = (event: CloseEvent) => {
            setReadyState(ReadyState.CLOSED);
            onClose?.(event);

            // Attempt to reconnect if enabled
            if (shouldReconnect && reconnectCountRef.current < reconnectAttempts) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectCountRef.current += 1;
                    connect();
                }, reconnectInterval);
            }
        };

        webSocketRef.current.onmessage = (event: MessageEvent) => {
            setLastMessage(event);
            onMessage?.(event);
        };

        webSocketRef.current.onerror = (event: Event) => {
            onError?.(event);
        };
    }, [url, protocols, reconnectAttempts, reconnectInterval, shouldReconnect, onOpen, onClose, onMessage, onError]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (webSocketRef.current) {
            webSocketRef.current.close();
        }
    }, []);

    const sendMessage = useCallback(
        (message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
            if (webSocketRef.current?.readyState !== ReadyState.OPEN) {
                throw new Error("WebSocket is not connected");
            }

            webSocketRef.current.send(message);
        },
        []
    );

    // Connect when the component mounts
    useEffect(() => {
        connect();

        // Clean up when the component unmounts
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Update the readyState when the socket state changes
    useEffect(() => {
        const handleReadyStateChange = () => {
            if (webSocketRef.current) {
                setReadyState(webSocketRef.current.readyState);
            }
        };

        // Need to poll as there's no direct event for readyState changes
        const interval = setInterval(handleReadyStateChange, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const connectionStatus = ReadyState[readyState] as ConnectionStatus;

    return {
        sendMessage,
        lastMessage,
        readyState,
        connectionStatus,
        connect,
        disconnect,
    };
}

export { useWebSocket }; 