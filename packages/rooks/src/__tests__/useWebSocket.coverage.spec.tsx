import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useWebSocket } from "@/hooks/useWebSocket";

class MockWebSocket extends EventTarget {
  static instances: MockWebSocket[] = [];
  static throwOnConstruct: unknown = null;
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = 0;
  binaryType: BinaryType = "blob";
  send = vi.fn();
  closeImpl: (() => void) | null = null;

  constructor(
    public url: string,
    public protocols?: string | string[]
  ) {
    super();
    if (MockWebSocket.throwOnConstruct !== null) {
      throw MockWebSocket.throwOnConstruct;
    }
    MockWebSocket.instances.push(this);
  }

  open() {
    this.readyState = 1;
    this.dispatchEvent(new Event("open"));
  }
  message(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }
  fail() {
    this.dispatchEvent(new Event("error"));
  }
  serverClose() {
    this.readyState = 3;
    this.dispatchEvent(new CloseEvent("close"));
  }
  close() {
    if (this.closeImpl) return this.closeImpl();
    this.serverClose();
  }
}

const last = () => MockWebSocket.instances[MockWebSocket.instances.length - 1]!;

describe("useWebSocket coverage", () => {
  beforeEach(() => {
    vi.stubGlobal("WebSocket", MockWebSocket);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    MockWebSocket.instances = [];
    MockWebSocket.throwOnConstruct = null;
  });

  it("reports unsupported when WebSocket is missing", () => {
    vi.stubGlobal("WebSocket", undefined);
    const { result } = renderHook(() => useWebSocket("ws://x"));
    expect(result.current.status).toBe("unsupported");
    act(() => result.current.connect());
    expect(result.current.status).toBe("unsupported");
    expect(result.current.socket).toBeNull();
  });

  it("stays idle with autoConnect false and connects manually", () => {
    const { result } = renderHook(() =>
      useWebSocket("ws://x", { autoConnect: false })
    );
    expect(result.current.status).toBe("idle");
    expect(MockWebSocket.instances).toHaveLength(0);
    act(() => result.current.connect());
    expect(result.current.status).toBe("connecting");
    // connecting again while CONNECTING is a no-op
    act(() => result.current.connect());
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it("applies binaryType and protocols", () => {
    renderHook(() =>
      useWebSocket("ws://x", { binaryType: "arraybuffer", protocols: ["a"] })
    );
    expect(last().binaryType).toBe("arraybuffer");
    expect(last().protocols).toEqual(["a"]);
  });

  it("handles Error thrown by the constructor", () => {
    MockWebSocket.throwOnConstruct = new Error("bad url");
    const onError = vi.fn();
    const { result } = renderHook(() => useWebSocket("ws://x", { onError }));
    expect(result.current.status).toBe("closed");
    expect((result.current.error as Error).message).toBe("bad url");
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("normalizes non-Error constructor failures", () => {
    MockWebSocket.throwOnConstruct = "nope";
    const { result } = renderHook(() => useWebSocket("ws://x"));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("nope");
  });

  it("sets error on socket error events and calls onError", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useWebSocket("ws://x", { onError }));
    act(() => last().fail());
    expect(result.current.error).toBeInstanceOf(Event);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("handles parse errors (Error and non-Error) and callback throws", () => {
    let mode: "error" | "string" = "error";
    const onError = vi.fn(() => {
      throw new Error("consumer");
    });
    const { result } = renderHook(() =>
      useWebSocket("ws://x", {
        onError,
        parseMessage: () => {
          if (mode === "error") throw new Error("parse");
          throw "raw";
        },
      })
    );
    act(() => last().open());
    act(() => last().message("x"));
    expect((result.current.error as Error).message).toBe("parse");
    mode = "string";
    act(() => last().message("y"));
    expect((result.current.error as Error).message).toBe("raw");
    expect(onError).toHaveBeenCalledTimes(2);
    expect(result.current.lastMessageEvent).not.toBeNull();
  });

  it("calls onOpen/onMessage/onClose", () => {
    const onOpen = vi.fn();
    const onMessage = vi.fn();
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useWebSocket("ws://x", { onOpen, onMessage, onClose })
    );
    act(() => last().open());
    act(() => last().message("m"));
    expect(onOpen).toHaveBeenCalled();
    expect(onMessage).toHaveBeenCalledWith(expect.anything(), "m");
    act(() => last().serverClose());
    expect(onClose).toHaveBeenCalled();
    expect(result.current.status).toBe("closed");
    expect(result.current.socket).toBeNull();
  });

  it("send only transmits when open", () => {
    const { result } = renderHook(() => useWebSocket("ws://x"));
    act(() => result.current.send("early"));
    expect(last().send).not.toHaveBeenCalled();
    act(() => last().open());
    act(() => result.current.send("hi"));
    expect(last().send).toHaveBeenCalledWith("hi");
  });

  it("sendJson serializes values when open", () => {
    const { result } = renderHook(() => useWebSocket("ws://x"));
    act(() => last().open());
    act(() => result.current.sendJson({ a: 1 }));
    expect(last().send).toHaveBeenCalledWith('{"a":1}');
  });

  describe("reconnect", () => {
    it("reconnects with default delay when reconnect is true", () => {
      vi.useFakeTimers();
      renderHook(() => useWebSocket("ws://x", { reconnect: true }));
      act(() => last().serverClose());
      expect(MockWebSocket.instances).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(MockWebSocket.instances).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("uses numeric intervalMs and respects attempts limit", () => {
      vi.useFakeTimers();
      renderHook(() =>
        useWebSocket("ws://x", { reconnect: { attempts: 1, intervalMs: 50 } })
      );
      act(() => last().serverClose());
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
      act(() => last().serverClose());
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("uses function intervalMs and default object interval", () => {
      vi.useFakeTimers();
      const intervalMs = vi.fn((attempt: number) => attempt * 100);
      renderHook(() => useWebSocket("ws://x", { reconnect: { intervalMs } }));
      act(() => last().serverClose());
      expect(intervalMs).toHaveBeenCalledWith(1);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("defaults to 1s for an empty options object", () => {
      vi.useFakeTimers();
      renderHook(() => useWebSocket("ws://x", { reconnect: {} }));
      act(() => last().serverClose());
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("reports errors thrown by the interval function (Error and non-Error)", () => {
      let thrown: unknown = new Error("delay");
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useWebSocket("ws://x", {
          onError,
          reconnect: {
            intervalMs: () => {
              throw thrown;
            },
          },
        })
      );
      act(() => last().serverClose());
      expect((result.current.error as Error).message).toBe("delay");
      expect(onError).toHaveBeenCalledTimes(1);
      expect(MockWebSocket.instances).toHaveLength(1);

      thrown = "str";
      act(() => result.current.connect());
      act(() => last().serverClose());
      expect((result.current.error as Error).message).toBe("str");
    });

    it("does not reconnect when disabled", () => {
      vi.useFakeTimers();
      renderHook(() => useWebSocket("ws://x"));
      act(() => last().serverClose());
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("does not reconnect after explicit disconnect or unmount", () => {
      vi.useFakeTimers();
      const { result, unmount } = renderHook(() =>
        useWebSocket("ws://x", { reconnect: true })
      );
      act(() => last().open());
      act(() => result.current.disconnect());
      expect(result.current.status).toBe("closed");
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(MockWebSocket.instances).toHaveLength(1);

      act(() => result.current.connect());
      act(() => last().serverClose());
      unmount();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(MockWebSocket.instances).toHaveLength(2);
    });
  });

  describe("disconnect / reconnect controls", () => {
    it("disconnect without a socket sets closed", () => {
      const { result } = renderHook(() =>
        useWebSocket("ws://x", { autoConnect: false })
      );
      act(() => result.current.disconnect());
      expect(result.current.status).toBe("closed");
    });

    it("disconnect sets closing while the socket close is pending", () => {
      const { result } = renderHook(() => useWebSocket("ws://x"));
      act(() => last().open());
      last().closeImpl = () => {};
      act(() => result.current.disconnect());
      expect(result.current.status).toBe("closing");
    });

    it("reconnect replaces the active socket and ignores stale events", () => {
      const { result } = renderHook(() => useWebSocket("ws://x"));
      const first = last();
      act(() => first.open());
      act(() => result.current.reconnect());
      expect(MockWebSocket.instances).toHaveLength(2);
      const second = last();
      expect(second).not.toBe(first);
      expect(result.current.status).toBe("connecting");

      // stale socket events are ignored
      act(() => {
        first.message("stale");
        first.fail();
        first.open();
      });
      expect(result.current.lastMessage).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.status).toBe("connecting");
    });

    it("reconnect still proceeds when closing throws", () => {
      const { result } = renderHook(() => useWebSocket("ws://x"));
      last().open();
      last().closeImpl = () => {
        throw new Error("close fail");
      };
      act(() => result.current.reconnect());
      expect(MockWebSocket.instances).toHaveLength(2);
    });

    it("unmount tolerates a throwing close", () => {
      const { unmount } = renderHook(() => useWebSocket("ws://x"));
      last().closeImpl = () => {
        throw new Error("close fail");
      };
      expect(() => unmount()).not.toThrow();
    });

    it("connect, disconnect and reconnect are no-ops after unmount", () => {
      const { result, unmount } = renderHook(() => useWebSocket("ws://x"));
      unmount();
      const count = MockWebSocket.instances.length;
      result.current.connect();
      result.current.disconnect();
      result.current.reconnect();
      expect(MockWebSocket.instances).toHaveLength(count);
    });

    it("reconnects to a new url when url changes", () => {
      const { rerender } = renderHook(({ url }) => useWebSocket(url), {
        initialProps: { url: "ws://a" },
      });
      rerender({ url: "ws://b" });
      expect(last().url).toBe("ws://b");
      expect(MockWebSocket.instances).toHaveLength(2);
    });
  });
});
