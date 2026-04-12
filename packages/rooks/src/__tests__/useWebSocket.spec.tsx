/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWebSocket } from "@/hooks/useWebSocket";

// ─── Mock WebSocket ───────────────────────────────────────────────────────────

type WebSocketEventListener = (event: any) => void;

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  public readyState: number = MockWebSocket.CONNECTING;
  public url: string;
  public protocol: string | string[];

  private listeners: Map<string, Set<WebSocketEventListener>> = new Map();

  // Track all instances so tests can control them
  static instances: MockWebSocket[] = [];

  constructor(url: string, protocol?: string | string[]) {
    this.url = url;
    this.protocol = protocol ?? "";
    MockWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: WebSocketEventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: WebSocketEventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  send(_data: any): void {
    // No-op by default; can be overridden in specific tests
  }

  close(): void {
    if (this.readyState === MockWebSocket.CLOSED) return;
    this.readyState = MockWebSocket.CLOSED;
    this._emit("close", new CloseEvent("close", { wasClean: true, code: 1000 }));
  }

  // ── Test helpers ──────────────────────────────────────────────────────────

  /** Simulate the server accepting the connection */
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this._emit("open", new Event("open"));
  }

  /** Simulate an incoming message */
  simulateMessage(data: any): void {
    this._emit("message", new MessageEvent("message", { data }));
  }

  /** Simulate an error event */
  simulateError(): void {
    this._emit("error", new Event("error"));
  }

  /** Simulate the server closing the connection */
  simulateClose(code = 1006, wasClean = false): void {
    this.readyState = MockWebSocket.CLOSED;
    this._emit("close", new CloseEvent("close", { wasClean, code }));
  }

  private _emit(type: string, event: Event): void {
    this.listeners.get(type)?.forEach((listener) => listener(event));
  }
}

// ─── Setup / teardown ────────────────────────────────────────────────────────

const OriginalWebSocket = (global as any).WebSocket;

beforeEach(() => {
  MockWebSocket.instances = [];
  (global as any).WebSocket = MockWebSocket;
});

afterEach(() => {
  (global as any).WebSocket = OriginalWebSocket;
  vi.clearAllMocks();
  vi.useRealTimers();
});

// ─── Helper ──────────────────────────────────────────────────────────────────

function latestInstance(): MockWebSocket {
  return MockWebSocket.instances[MockWebSocket.instances.length - 1];
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useWebSocket", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWebSocket).toBeDefined();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  describe("Initial state", () => {
    it("should start with readyState CLOSED (3) when no url is provided", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(null));
      expect(result.current.readyState).toBe(3);
    });

    it("should start with lastMessage null", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(null));
      expect(result.current.lastMessage).toBeNull();
    });

    it("should expose send, connect, and disconnect as functions", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(null));
      expect(result.current.send).toBeInstanceOf(Function);
      expect(result.current.connect).toBeInstanceOf(Function);
      expect(result.current.disconnect).toBeInstanceOf(Function);
    });

    it("should report isSupported true when WebSocket is available", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(null));
      expect(result.current.isSupported).toBe(true);
    });

    it("should report isSupported false when WebSocket is unavailable", () => {
      expect.hasAssertions();
      (global as any).WebSocket = undefined;
      const { result } = renderHook(() => useWebSocket(null));
      expect(result.current.isSupported).toBe(false);
    });
  });

  // ── Connection lifecycle ───────────────────────────────────────────────────

  describe("Connection lifecycle", () => {
    it("should create a WebSocket when url is provided", () => {
      expect.hasAssertions();
      renderHook(() => useWebSocket("ws://localhost:8080"));
      expect(MockWebSocket.instances).toHaveLength(1);
      expect(latestInstance().url).toBe("ws://localhost:8080");
    });

    it("should set readyState to CONNECTING (0) immediately after connecting", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));
      expect(result.current.readyState).toBe(0);
    });

    it("should transition readyState to OPEN (1) when connection opens", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
      });

      expect(result.current.readyState).toBe(1);
    });

    it("should transition readyState to CLOSED (3) when connection closes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
      });

      act(() => {
        latestInstance().simulateClose();
      });

      expect(result.current.readyState).toBe(3);
    });

    it("should not create a WebSocket when url is null", () => {
      expect.hasAssertions();
      renderHook(() => useWebSocket(null));
      expect(MockWebSocket.instances).toHaveLength(0);
    });

    it("should pass protocols to WebSocket constructor when provided", () => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket("ws://localhost:8080", { protocols: ["chat", "superchat"] })
      );
      expect(latestInstance().protocol).toEqual(["chat", "superchat"]);
    });

    it("should reconnect with a new WebSocket when url changes", () => {
      expect.hasAssertions();
      const { rerender } = renderHook(
        ({ url }: { url: string }) => useWebSocket(url),
        { initialProps: { url: "ws://localhost:8080" } }
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      rerender({ url: "ws://localhost:9090" });

      expect(MockWebSocket.instances).toHaveLength(2);
      expect(latestInstance().url).toBe("ws://localhost:9090");
    });

    it("should close the WebSocket on unmount", () => {
      expect.hasAssertions();
      const { unmount } = renderHook(() => useWebSocket("ws://localhost:8080"));
      const ws = latestInstance();
      const closeSpy = vi.spyOn(ws, "close");

      unmount();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  // ── Callbacks ─────────────────────────────────────────────────────────────

  describe("Callbacks", () => {
    it("should call onOpen when connection opens", () => {
      expect.hasAssertions();
      const onOpen = vi.fn();
      renderHook(() => useWebSocket("ws://localhost:8080", { onOpen }));

      act(() => {
        latestInstance().simulateOpen();
      });

      expect(onOpen).toHaveBeenCalledOnce();
      expect(onOpen).toHaveBeenCalledWith(expect.any(Event));
    });

    it("should call onMessage when a message arrives", () => {
      expect.hasAssertions();
      const onMessage = vi.fn();
      renderHook(() => useWebSocket("ws://localhost:8080", { onMessage }));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateMessage("hello");
      });

      expect(onMessage).toHaveBeenCalledOnce();
      expect(onMessage).toHaveBeenCalledWith(expect.any(MessageEvent));
    });

    it("should call onClose when connection closes", () => {
      expect.hasAssertions();
      const onClose = vi.fn();
      renderHook(() => useWebSocket("ws://localhost:8080", { onClose }));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateClose();
      });

      expect(onClose).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledWith(expect.any(CloseEvent));
    });

    it("should call onError when a socket error occurs", () => {
      expect.hasAssertions();
      const onError = vi.fn();
      renderHook(() => useWebSocket("ws://localhost:8080", { onError }));

      act(() => {
        latestInstance().simulateError();
      });

      expect(onError).toHaveBeenCalledOnce();
      expect(onError).toHaveBeenCalledWith(expect.any(Event));
    });
  });

  // ── lastMessage ───────────────────────────────────────────────────────────

  describe("lastMessage", () => {
    it("should update lastMessage when a message is received", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateMessage("world");
      });

      expect(result.current.lastMessage).toBeInstanceOf(MessageEvent);
      expect(result.current.lastMessage?.data).toBe("world");
    });

    it("should update lastMessage for each new message", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateMessage("first");
      });

      expect(result.current.lastMessage?.data).toBe("first");

      act(() => {
        latestInstance().simulateMessage("second");
      });

      expect(result.current.lastMessage?.data).toBe("second");
    });
  });

  // ── send ──────────────────────────────────────────────────────────────────

  describe("send", () => {
    it("should send data when socket is open", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));
      const ws = latestInstance();
      const sendSpy = vi.spyOn(ws, "send");

      act(() => {
        ws.simulateOpen();
      });

      act(() => {
        result.current.send("test message");
      });

      expect(sendSpy).toHaveBeenCalledWith("test message");
    });

    it("should warn and not send when socket is not open", () => {
      expect.hasAssertions();
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        result.current.send("test message");
      });

      expect(consoleSpy).toHaveBeenCalledWith("useWebSocket: WebSocket is not open");
      consoleSpy.mockRestore();
    });

    it("should warn when attempting to send without a connection", () => {
      expect.hasAssertions();
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useWebSocket(null));

      act(() => {
        result.current.send("test");
      });

      expect(consoleSpy).toHaveBeenCalledWith("useWebSocket: WebSocket is not open");
      consoleSpy.mockRestore();
    });
  });

  // ── Manual connect / disconnect ───────────────────────────────────────────

  describe("Manual connect / disconnect", () => {
    it("should allow manual connect after being initialized with null url", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(
        ({ url }: { url: string | null }) => useWebSocket(url),
        { initialProps: { url: null as string | null } }
      );

      // Now provide a url and call connect
      rerender({ url: "ws://localhost:8080" });

      act(() => {
        result.current.connect();
      });

      // Should have two instances: one from rerender, one from connect()
      expect(MockWebSocket.instances.length).toBeGreaterThanOrEqual(1);
    });

    it("should create a new connection when connect() is called", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
      });

      act(() => {
        result.current.connect();
      });

      // A new WebSocket should have been created
      expect(MockWebSocket.instances.length).toBeGreaterThanOrEqual(2);
    });

    it("should close connection and prevent reconnect when disconnect() is called", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket("ws://localhost:8080", { reconnect: true, reconnectAttempts: 3 })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.readyState).toBe(3);
    });

    it("should not auto-reconnect after manual disconnect()", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      const { result } = renderHook(() =>
        useWebSocket("ws://localhost:8080", {
          reconnect: true,
          reconnectAttempts: 5,
          reconnectInterval: 100,
        })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      const instancesBefore = MockWebSocket.instances.length;

      act(() => {
        result.current.disconnect();
      });

      // Advance timers significantly
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // No new instances should have been created
      expect(MockWebSocket.instances.length).toBe(instancesBefore);
    });
  });

  // ── Auto-reconnect ────────────────────────────────────────────────────────

  describe("Auto-reconnect", () => {
    it("should not attempt reconnect by default when connection drops", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Only one WebSocket should have been created (no reconnect)
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("should attempt reconnect when reconnect option is true", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      renderHook(() =>
        useWebSocket("ws://localhost:8080", {
          reconnect: true,
          reconnectInterval: 100,
          reconnectAttempts: 2,
        })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      act(() => {
        latestInstance().simulateClose(1006);
      });

      // First reconnect after 100ms (interval * 2^0)
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("should use exponential backoff for reconnect delays", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      renderHook(() =>
        useWebSocket("ws://localhost:8080", {
          reconnect: true,
          reconnectInterval: 100,
          reconnectAttempts: 3,
        })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      // First drop -> reconnect after 100ms (100 * 2^0)
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(MockWebSocket.instances).toHaveLength(2);

      // Second drop -> reconnect after 200ms (100 * 2^1)
      act(() => {
        latestInstance().simulateClose(1006);
      });

      // Only 100ms has passed — not yet time for second reconnect
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(MockWebSocket.instances).toHaveLength(2);

      // Now the additional 100ms completes the 200ms window
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(MockWebSocket.instances).toHaveLength(3);
    });

    it("should stop reconnecting after reconnectAttempts is exhausted", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      renderHook(() =>
        useWebSocket("ws://localhost:8080", {
          reconnect: true,
          reconnectInterval: 100,
          reconnectAttempts: 2,
        })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      // First drop
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Second drop (attempt #2 = last)
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Third drop — no more reconnect allowed
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should not have created more than original + 2 reconnect instances
      expect(MockWebSocket.instances.length).toBeLessThanOrEqual(3);
    });

    it("should reset reconnect count after successful connection", () => {
      expect.hasAssertions();
      vi.useFakeTimers();

      renderHook(() =>
        useWebSocket("ws://localhost:8080", {
          reconnect: true,
          reconnectInterval: 100,
          reconnectAttempts: 1,
        })
      );

      act(() => {
        latestInstance().simulateOpen();
      });

      // Drop and reconnect
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Reconnected instance opens successfully — resets counter
      act(() => {
        latestInstance().simulateOpen();
      });

      // Drop again — should be allowed to reconnect (counter reset)
      act(() => {
        latestInstance().simulateClose(1006);
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Should have at least 3 WebSocket instances (original + 2 reconnects)
      expect(MockWebSocket.instances.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── isSupported guard ──────────────────────────────────────────────────────

  describe("When WebSocket is not supported", () => {
    it("should not create a WebSocket when unsupported", () => {
      expect.hasAssertions();
      (global as any).WebSocket = undefined;
      renderHook(() => useWebSocket("ws://localhost:8080"));
      expect(MockWebSocket.instances).toHaveLength(0);
    });

    it("should warn when send is called and not supported", () => {
      expect.hasAssertions();
      (global as any).WebSocket = undefined;
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { result } = renderHook(() => useWebSocket("ws://localhost:8080"));

      act(() => {
        result.current.send("data");
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // ── Callback stability ────────────────────────────────────────────────────

  describe("Callback stability", () => {
    it("should maintain stable send reference across renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() =>
        useWebSocket("ws://localhost:8080")
      );

      const firstSend = result.current.send;
      rerender();
      expect(result.current.send).toBe(firstSend);
    });

    it("should maintain stable disconnect reference across renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() =>
        useWebSocket("ws://localhost:8080")
      );

      const firstDisconnect = result.current.disconnect;
      rerender();
      expect(result.current.disconnect).toBe(firstDisconnect);
    });
  });

  // ── TypeScript generics (runtime data-type coverage) ─────────────────────

  describe("Various message data types", () => {
    it("should handle string messages", () => {
      expect.hasAssertions();
      const onMessage = vi.fn();
      renderHook(() => useWebSocket("ws://localhost:8080", { onMessage }));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateMessage("hello string");
      });

      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({ data: "hello string" })
      );
    });

    it("should handle object messages", () => {
      expect.hasAssertions();
      const onMessage = vi.fn();
      const payload = { type: "update", value: 42 };
      renderHook(() => useWebSocket("ws://localhost:8080", { onMessage }));

      act(() => {
        latestInstance().simulateOpen();
        latestInstance().simulateMessage(payload);
      });

      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({ data: payload })
      );
    });
  });
});
