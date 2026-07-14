import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useWebSocket } from "@/hooks/useWebSocket";

class MockWebSocket extends EventTarget {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readonly url: string;
  readonly protocols?: string | string[];
  readyState = MockWebSocket.CONNECTING;
  binaryType: BinaryType = "blob";
  send = vi.fn();

  constructor(url: string, protocols?: string | string[]) {
    super();
    this.url = url;
    this.protocols = protocols;
    MockWebSocket.instances.push(this);
  }

  open() {
    this.readyState = MockWebSocket.OPEN;
    this.dispatchEvent(new Event("open"));
  }

  message(data: unknown) {
    this.dispatchEvent(
      new MessageEvent("message", {
        data,
      })
    );
  }

  fail(event: Event = new Event("error")) {
    this.dispatchEvent(event);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.dispatchEvent(new CloseEvent("close"));
  }
}

describe("useWebSocket", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    MockWebSocket.instances = [];
  });

  it("connects, parses messages, and sends json", async () => {
    expect.hasAssertions();
    (global as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      MockWebSocket as unknown as typeof WebSocket;

    const { result } = renderHook(() =>
      useWebSocket<string>("ws://example.test", {
        parseMessage: (event) => String(event.data),
      })
    );

    const socket = MockWebSocket.instances[0]!;
    act(() => {
      socket.open();
      socket.message("hello");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("open");
      expect(result.current.lastMessage).toBe("hello");
    });

    act(() => {
      result.current.sendJson({ ok: true });
    });

    expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ ok: true }));
  });

  it("reconnects after an unexpected close", async () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    (global as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      MockWebSocket as unknown as typeof WebSocket;

    renderHook(() =>
      useWebSocket("ws://example.test", {
        reconnect: { attempts: 1, intervalMs: 25 },
      })
    );

    const firstSocket = MockWebSocket.instances[0]!;
    act(() => {
      firstSocket.open();
      firstSocket.close();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(25);
    });

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it("ignores stale close events from an old socket after the url changes", async () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    (global as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      MockWebSocket as unknown as typeof WebSocket;

    const { result, rerender } = renderHook(
      ({ url }) =>
        useWebSocket(url, {
          reconnect: { attempts: 1, intervalMs: 25 },
        }),
      {
        initialProps: {
          url: "ws://example.test/one",
        },
      }
    );

    const firstSocket = MockWebSocket.instances[0]!;
    firstSocket.close = vi.fn(() => {
      firstSocket.readyState = MockWebSocket.CLOSED;
      window.setTimeout(() => {
        firstSocket.dispatchEvent(new CloseEvent("close"));
      }, 5);
    });

    act(() => {
      firstSocket.open();
    });

    rerender({ url: "ws://example.test/two" });

    const secondSocket = MockWebSocket.instances[1]!;
    act(() => {
      secondSocket.open();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30);
    });

    expect(MockWebSocket.instances).toHaveLength(2);
    expect(result.current.socket).toBe(secondSocket as unknown as WebSocket);
    expect(result.current.status).toBe("open");
  });

  it("does not reconnect after unmount when a close event arrives later", async () => {
    expect.hasAssertions();
    vi.useFakeTimers();
    (global as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      MockWebSocket as unknown as typeof WebSocket;

    const { unmount } = renderHook(() =>
      useWebSocket("ws://example.test/unmount", {
        reconnect: { attempts: 1, intervalMs: 25 },
      })
    );

    const firstSocket = MockWebSocket.instances[0]!;
    firstSocket.close = vi.fn(() => {
      firstSocket.readyState = MockWebSocket.CLOSED;
      window.setTimeout(() => {
        firstSocket.dispatchEvent(new CloseEvent("close"));
      }, 5);
    });

    act(() => {
      firstSocket.open();
    });

    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30);
    });

    expect(MockWebSocket.instances).toHaveLength(1);
  });
});
