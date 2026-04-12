/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWebSocket, ReadyState } from "@/hooks/useWebSocket";

// ---------------------------------------------------------------------------
// Mock WebSocket
// ---------------------------------------------------------------------------

type WsEventType = "open" | "close" | "message" | "error";

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  protocols?: string | string[];
  readyState: number = ReadyState.CONNECTING;

  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  private _listeners: Map<WsEventType, Set<EventListener>> = new Map();

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    MockWebSocket.instances.push(this);
  }

  send = vi.fn();

  close(code = 1000, _reason?: string): void {
    if (
      this.readyState === ReadyState.CLOSED ||
      this.readyState === ReadyState.CLOSING
    ) {
      return;
    }
    this.readyState = ReadyState.CLOSING;
    // Simulate async close
    setTimeout(() => {
      this.readyState = ReadyState.CLOSED;
      this._dispatchClose(code);
    }, 0);
  }

  // --- Test helpers --------------------------------------------------------

  /** Simulate the server accepting the connection. */
  simulateOpen(): void {
    this.readyState = ReadyState.OPEN;
    const event = new Event("open");
    this.onopen?.(event);
  }

  /** Simulate a message arriving from the server. */
  simulateMessage(data: unknown): void {
    const event = new MessageEvent("message", { data });
    this.onmessage?.(event);
  }

  /** Simulate the server closing the connection. */
  simulateClose(code = 1006, reason = ""): void {
    this.readyState = ReadyState.CLOSED;
    this._dispatchClose(code, reason);
  }

  /** Simulate a connection error. */
  simulateError(): void {
    const event = new Event("error");
    this.onerror?.(event);
  }

  private _dispatchClose(code: number, reason = ""): void {
    const event = new CloseEvent("close", { code, reason, wasClean: code === 1000 });
    this.onclose?.(event);
  }
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

const OriginalWebSocket = (global as any).WebSocket;

beforeEach(() => {
  MockWebSocket.instances = [];
  (global as any).WebSocket = MockWebSocket;
  vi.useFakeTimers();
});

afterEach(() => {
  (global as any).WebSocket = OriginalWebSocket;
  vi.useRealTimers();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Helper: get the most recent MockWebSocket instance
// ---------------------------------------------------------------------------
function lastWs(): MockWebSocket {
  return MockWebSocket.instances[MockWebSocket.instances.length - 1];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useWebSocket", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWebSocket).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------
  describe("Initial state", () => {
    it("returns CLOSED readyState before any connection attempt when manual=true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", { manual: true })
      );
      const [, { readyState }] = result.current;
      expect(readyState).toBe(ReadyState.CLOSED);
    });

    it("returns CONNECTING readyState immediately after auto-connect on mount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com")
      );
      const [, { readyState }] = result.current;
      expect(readyState).toBe(ReadyState.CONNECTING);
    });

    it("latestMessage is null on mount", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", { manual: true })
      );
      const [latestMessage] = result.current;
      expect(latestMessage).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Connection lifecycle
  // -------------------------------------------------------------------------
  describe("Connection lifecycle", () => {
    it("creates a WebSocket with the provided URL", () => {
      expect.hasAssertions();
      renderHook(() => useWebSocket("wss://example.com/socket"));
      expect(MockWebSocket.instances).toHaveLength(1);
      expect(lastWs().url).toBe("wss://example.com/socket");
    });

    it("transitions to OPEN after server accepts the connection", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("wss://example.com"));
      act(() => {
        lastWs().simulateOpen();
      });
      const [, { readyState }] = result.current;
      expect(readyState).toBe(ReadyState.OPEN);
    });

    it("transitions to CLOSED after the server closes the connection", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", { reconnect: false })
      );
      act(() => {
        lastWs().simulateOpen();
      });
      act(() => {
        lastWs().simulateClose(1000);
      });
      const [, { readyState }] = result.current;
      expect(readyState).toBe(ReadyState.CLOSED);
    });

    it("does NOT open a connection on mount when manual=true", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("wss://example.com", { manual: true })
      );
      expect(MockWebSocket.instances).toHaveLength(0);
    });

    it("opens a connection when connect() is called in manual mode", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", { manual: true })
      );
      act(() => {
        result.current[1].connect();
      });
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("closes with code 1000 and transitions to CLOSING on disconnect()", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("wss://example.com"));
      act(() => {
        lastWs().simulateOpen();
      });
      act(() => {
        result.current[1].disconnect();
      });
      const [, { readyState }] = result.current;
      expect(readyState).toBe(ReadyState.CLOSING);
    });

    it("closes the WebSocket on unmount", () => {
      expect.hasAssertions();
      const { unmount } = renderHook(() => useWebSocket("wss://example.com"));
      const ws = lastWs();
      act(() => {
        ws.simulateOpen();
      });
      unmount();
      // Handlers should be detached (no stale callbacks).
      expect(ws.onopen).toBeNull();
      expect(ws.onclose).toBeNull();
      expect(ws.onmessage).toBeNull();
      expect(ws.onerror).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------
  describe("Callbacks", () => {
    it("calls onOpen when the connection opens", () => {
      expect.hasAssertions();
      const onOpen = vi.fn();
      renderHook(() => useWebSocket("wss://example.com", { onOpen }));
      act(() => {
        lastWs().simulateOpen();
      });
      expect(onOpen).toHaveBeenCalledOnce();
    });

    it("calls onClose when the connection closes", () => {
      expect.hasAssertions();
      const onClose = vi.fn();
      renderHook(() =>
        useWebSocket("wss://example.com", { onClose, reconnect: false })
      );
      act(() => {
        lastWs().simulateOpen();
        lastWs().simulateClose(1000);
      });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onMessage with the MessageEvent when a message arrives", () => {
      expect.hasAssertions();
      const onMessage = vi.fn();
      renderHook(() => useWebSocket("wss://example.com", { onMessage }));
      act(() => {
        lastWs().simulateOpen();
        lastWs().simulateMessage("hello");
      });
      expect(onMessage).toHaveBeenCalledOnce();
      expect(onMessage.mock.calls[0][0]).toBeInstanceOf(MessageEvent);
      expect(onMessage.mock.calls[0][0].data).toBe("hello");
    });

    it("calls onError when a connection error occurs", () => {
      expect.hasAssertions();
      const onError = vi.fn();
      renderHook(() => useWebSocket("wss://example.com", { onError }));
      act(() => {
        lastWs().simulateError();
      });
      expect(onError).toHaveBeenCalledOnce();
    });

    it("uses the latest callback reference without recreating the socket", () => {
      expect.hasAssertions();
      const onMessage1 = vi.fn();
      const onMessage2 = vi.fn();
      const { rerender } = renderHook(
        ({ cb }: { cb: (e: MessageEvent) => void }) =>
          useWebSocket("wss://example.com", { onMessage: cb }),
        { initialProps: { cb: onMessage1 } }
      );
      act(() => {
        lastWs().simulateOpen();
      });
      // Swap callback — must NOT cause a new WebSocket to be created.
      rerender({ cb: onMessage2 });
      expect(MockWebSocket.instances).toHaveLength(1);
      // New message should reach the new callback.
      act(() => {
        lastWs().simulateMessage("world");
      });
      expect(onMessage1).not.toHaveBeenCalled();
      expect(onMessage2).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // Messaging
  // -------------------------------------------------------------------------
  describe("sendMessage", () => {
    it("sends data when the socket is OPEN", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("wss://example.com"));
      act(() => {
        lastWs().simulateOpen();
      });
      act(() => {
        result.current[1].sendMessage("ping");
      });
      expect(lastWs().send).toHaveBeenCalledWith("ping");
    });

    it("does not send data when the socket is not OPEN", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("wss://example.com"));
      // Do NOT call simulateOpen — socket is CONNECTING.
      act(() => {
        result.current[1].sendMessage("ping");
      });
      expect(lastWs().send).not.toHaveBeenCalled();
    });

    it("updates latestMessage state when a message is received", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("wss://example.com"));
      act(() => {
        lastWs().simulateOpen();
        lastWs().simulateMessage({ type: "update", value: 42 });
      });
      const [latestMessage] = result.current;
      expect(latestMessage).toBeInstanceOf(MessageEvent);
      expect(latestMessage?.data).toEqual({ type: "update", value: 42 });
    });
  });

  // -------------------------------------------------------------------------
  // Auto-reconnect
  // -------------------------------------------------------------------------
  describe("Auto-reconnect", () => {
    it("reconnects after an abnormal closure (code 1006)", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectLimit: 3,
          reconnectInterval: 1000,
        })
      );
      act(() => {
        lastWs().simulateOpen();
      });
      act(() => {
        lastWs().simulateClose(1006); // abnormal
      });
      // Advance past the reconnect interval.
      act(() => {
        vi.advanceTimersByTime(1100);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("does NOT reconnect after a normal closure (code 1000)", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectInterval: 1000,
        })
      );
      act(() => {
        lastWs().simulateOpen();
        lastWs().simulateClose(1000);
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("does NOT reconnect after a 1001 (going away) closure", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectInterval: 1000,
        })
      );
      act(() => {
        lastWs().simulateOpen();
        lastWs().simulateClose(1001);
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("stops reconnecting after reaching reconnectLimit", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectLimit: 2,
          reconnectInterval: 500,
        })
      );

      // Simulate failing connections (never open) to exhaust the limit
      // without the onopen counter-reset kicking in.
      act(() => { lastWs().simulateClose(1006); }); // count 0→1, schedules socket #2
      act(() => { vi.advanceTimersByTime(600); });  // socket #2 created
      act(() => { lastWs().simulateClose(1006); }); // count 1→2, schedules socket #3
      act(() => { vi.advanceTimersByTime(600); });  // socket #3 created
      act(() => { lastWs().simulateClose(1006); }); // count 2 == limit, no socket #4
      act(() => { vi.advanceTimersByTime(600); });  // nothing created

      // Initial + 2 reconnect attempts = 3 total sockets.
      expect(MockWebSocket.instances).toHaveLength(3);
    });

    it("does NOT reconnect after disconnect() is called", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectInterval: 500,
        })
      );
      act(() => { lastWs().simulateOpen(); });
      act(() => { result.current[1].disconnect(); });
      act(() => { vi.advanceTimersByTime(1000); });
      // Only the initial socket — disconnect should suppress reconnect.
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("connect() resets the reconnect counter, allowing new attempts", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("wss://example.com", {
          reconnect: true,
          reconnectLimit: 1,
          reconnectInterval: 500,
        })
      );
      // Exhaust the limit using failing connections (no open → counter not reset).
      act(() => { lastWs().simulateClose(1006); }); // count 0→1, schedules socket #2
      act(() => { vi.advanceTimersByTime(600); });  // socket #2 created
      act(() => { lastWs().simulateClose(1006); }); // count 1 == limit, no socket #3
      act(() => { vi.advanceTimersByTime(600); });  // nothing created

      // Limit exhausted — 2 sockets so far.
      expect(MockWebSocket.instances).toHaveLength(2);

      // Manual connect() resets the counter and opens a new connection.
      act(() => { result.current[1].connect(); });
      expect(MockWebSocket.instances).toHaveLength(3);
    });
  });

  // -------------------------------------------------------------------------
  // URL change
  // -------------------------------------------------------------------------
  describe("URL change", () => {
    it("closes the old connection and opens a new one when the URL changes", () => {
      expect.hasAssertions();
      const { rerender } = renderHook(
        ({ url }: { url: string }) => useWebSocket(url),
        { initialProps: { url: "wss://first.example.com" } }
      );
      act(() => { lastWs().simulateOpen(); });
      expect(MockWebSocket.instances[0].url).toBe("wss://first.example.com");

      rerender({ url: "wss://second.example.com" });

      expect(MockWebSocket.instances).toHaveLength(2);
      expect(MockWebSocket.instances[1].url).toBe("wss://second.example.com");
    });
  });

  // -------------------------------------------------------------------------
  // ReadyState export
  // -------------------------------------------------------------------------
  describe("ReadyState export", () => {
    it("exports correct constant values", () => {
      expect.hasAssertions();
      expect(ReadyState.CONNECTING).toBe(0);
      expect(ReadyState.OPEN).toBe(1);
      expect(ReadyState.CLOSING).toBe(2);
      expect(ReadyState.CLOSED).toBe(3);
    });
  });
});

// ---------------------------------------------------------------------------
// SSR environment — separate describe block with env override
// ---------------------------------------------------------------------------
describe("useWebSocket – SSR (window undefined simulation)", () => {
  it("returns CLOSED readyState when window is undefined", () => {
    expect.hasAssertions();
    // Temporarily hide the WebSocket constructor to simulate SSR.
    const savedWebSocket = (global as any).WebSocket;
    (global as any).WebSocket = undefined;

    const { result } = renderHook(() =>
      useWebSocket("wss://example.com", { manual: true })
    );
    const [, { readyState }] = result.current;
    expect(readyState).toBe(ReadyState.CLOSED);

    (global as any).WebSocket = savedWebSocket;
  });
});
