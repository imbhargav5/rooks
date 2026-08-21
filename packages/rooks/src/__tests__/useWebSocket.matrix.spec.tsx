import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useWebSocket } from "@/hooks/useWebSocket";

class MockWebSocket extends EventTarget {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readonly protocols?: string | string[];
  readonly url: string;
  binaryType: BinaryType = "blob";
  readyState = MockWebSocket.CONNECTING;
  send = vi.fn();

  constructor(url: string, protocols?: string | string[]) {
    super();
    this.url = url;
    this.protocols = protocols;
    MockWebSocket.instances.push(this);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.dispatchEvent(new CloseEvent("close"));
  }

  emitError(event: Event = new Event("error")) {
    this.dispatchEvent(event);
  }

  emitMessage(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  open() {
    this.readyState = MockWebSocket.OPEN;
    this.dispatchEvent(new Event("open"));
  }
}

const socketConfigs = Array.from({ length: 10 }, (_, index) => ({
  binaryType: index % 2 === 0 ? "arraybuffer" : "blob",
  intervalMs: index + 5,
  label: `socket-${index}`,
  protocols:
    index % 3 === 0
      ? undefined
      : index % 3 === 1
        ? `proto-${index}`
        : [`proto-${index}`, `fallback-${index}`],
  url: `ws://example.test/${index}`,
}));

describe("useWebSocket matrix", () => {
  const originalWebSocket = globalThis.WebSocket;

  beforeEach(() => {
    (globalThis as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      MockWebSocket as unknown as typeof WebSocket;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    MockWebSocket.instances = [];
    (globalThis as typeof globalThis & { WebSocket?: typeof WebSocket }).WebSocket =
      originalWebSocket;
  });

  it.each(socketConfigs)(
    "autoConnect creates a socket immediately for $label",
    ({ binaryType, protocols, url }) => {
      expect.hasAssertions();
      renderHook(() =>
        useWebSocket(url, {
          binaryType,
          protocols,
        })
      );

      expect(MockWebSocket.instances).toHaveLength(1);
      expect(MockWebSocket.instances[0]!.url).toBe(url);
      expect(MockWebSocket.instances[0]!.protocols).toEqual(protocols);
      expect(MockWebSocket.instances[0]!.binaryType).toBe(binaryType);
    }
  );

  it.each(socketConfigs)(
    "manual connect waits for explicit invocation for $label",
    ({ binaryType, protocols, url }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket(url, {
          autoConnect: false,
          binaryType,
          protocols,
        })
      );

      expect(MockWebSocket.instances).toHaveLength(0);
      expect(result.current.status).toBe("idle");

      act(() => {
        result.current.connect();
      });

      expect(MockWebSocket.instances).toHaveLength(1);
      expect(MockWebSocket.instances[0]!.url).toBe(url);
    }
  );

  it.each(
    socketConfigs.map((config, index) => ({
      ...config,
      payload:
        index % 4 === 0
          ? `text-${index}`
          : index % 4 === 1
            ? new ArrayBuffer(index + 1)
            : index % 4 === 2
              ? new Uint8Array([index])
              : new Blob([`blob-${index}`]),
    }))
  )(
    "send transmits raw payloads while open for $label",
    ({ payload, url }) => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(url));
      const socket = MockWebSocket.instances[0]!;

      act(() => {
        socket.open();
        result.current.send(payload as never);
      });

      expect(socket.send).toHaveBeenCalledWith(payload);
    }
  );

  it.each(socketConfigs)(
    "send does nothing before the socket opens for $label",
    ({ url }) => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(url));
      const socket = MockWebSocket.instances[0]!;

      act(() => {
        result.current.send("before-open");
      });

      expect(socket.send).not.toHaveBeenCalled();
    }
  );

  it.each(
    socketConfigs.map((config, index) => ({
      ...config,
      payload: { index, ok: true },
    }))
  )(
    "sendJson serializes payloads for $label",
    ({ payload, url }) => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWebSocket(url));
      const socket = MockWebSocket.instances[0]!;

      act(() => {
        socket.open();
        result.current.sendJson(payload);
      });

      expect(socket.send).toHaveBeenCalledWith(JSON.stringify(payload));
    }
  );

  it.each(
    socketConfigs.map((config, index) => ({
      ...config,
      payload: JSON.stringify({ text: `message-${index}` }),
    }))
  )(
    "parseMessage transforms incoming data for $label",
    async ({ payload, url }) => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        useWebSocket<{ text: string }>(url, {
          parseMessage: (event) => JSON.parse(String(event.data)) as { text: string },
        })
      );
      const socket = MockWebSocket.instances[0]!;

      act(() => {
        socket.open();
        socket.emitMessage(payload);
      });

      await waitFor(() => {
        expect(result.current.lastMessage).toEqual(JSON.parse(payload));
      });
      expect(result.current.error).toBeNull();
    }
  );

  it.each(
    socketConfigs.map((config, index) => ({
      ...config,
      payload: `not-json-${index}`,
    }))
  )(
    "parse failures surface errors for $label",
    async ({ payload, url }) => {
      expect.hasAssertions();
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useWebSocket(url, {
          onError,
          parseMessage: (event) => JSON.parse(String(event.data)) as { text: string },
        })
      );
      const socket = MockWebSocket.instances[0]!;

      act(() => {
        socket.open();
        socket.emitMessage(payload);
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
      });
      expect(onError).toHaveBeenCalled();
    }
  );

  it.each(socketConfigs)(
    "reconnects after an unexpected close for $label",
    async ({ intervalMs, url }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      renderHook(() =>
        useWebSocket(url, {
          reconnect: { attempts: 1, intervalMs },
        })
      );

      const firstSocket = MockWebSocket.instances[0]!;
      act(() => {
        firstSocket.open();
        firstSocket.close();
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(intervalMs);
      });

      expect(MockWebSocket.instances).toHaveLength(2);
    }
  );

  it.each(socketConfigs)(
    "explicit disconnect blocks reconnects for $label",
    async ({ intervalMs, url }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const { result } = renderHook(() =>
        useWebSocket(url, {
          reconnect: { attempts: 3, intervalMs },
        })
      );

      const socket = MockWebSocket.instances[0]!;
      act(() => {
        socket.open();
        result.current.disconnect();
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(intervalMs * 2);
      });

      expect(MockWebSocket.instances).toHaveLength(1);
      expect(result.current.status).toBe("closed");
    }
  );

  it.each(socketConfigs)(
    "manual reconnect creates a single replacement socket for $label",
    async ({ intervalMs, url }) => {
      expect.hasAssertions();
      vi.useFakeTimers();
      const { result } = renderHook(() =>
        useWebSocket(url, {
          reconnect: { attempts: 3, intervalMs },
        })
      );

      const socket = MockWebSocket.instances[0]!;
      act(() => {
        socket.open();
        result.current.reconnect();
      });

      expect(MockWebSocket.instances).toHaveLength(2);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(intervalMs * 2);
      });

      expect(MockWebSocket.instances).toHaveLength(2);
    }
  );
});
