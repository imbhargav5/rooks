import { useRef } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { vi } from "vitest";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { useBrowserCookieState } from "@/hooks/useBrowserCookieState";
import { useEventListener } from "@/hooks/useEventListener";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useLocationSnapshot } from "@/hooks/useLocationSnapshot";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { usePermission } from "@/hooks/usePermission";
import { useRequest } from "@/hooks/useRequest";
import { useResponsive } from "@/hooks/useResponsive";
import { useScript } from "@/hooks/useScript";
import { useScroll } from "@/hooks/useScroll";
import { useSize } from "@/hooks/useSize";
import { useVirtualList } from "@/hooks/useVirtualList";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getCookieValue } from "@/utils/cookies";
import { __resetLocationStoreForTests } from "@/utils/locationStore";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

class MockPermissionStatus extends EventTarget {
  onchange: ((this: PermissionStatus, event: Event) => unknown) | null = null;

  constructor(public state: PermissionState) {
    super();
  }

  setState(state: PermissionState) {
    this.state = state;
    this.dispatchEvent(new Event("change"));
  }
}

class RegressionWebSocket extends EventTarget {
  static instances: RegressionWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = RegressionWebSocket.CONNECTING;
  binaryType: BinaryType = "blob";
  closeCalls = 0;
  send = vi.fn();

  constructor(
    readonly url: string,
    readonly protocols?: string | string[]
  ) {
    super();
    RegressionWebSocket.instances.push(this);
  }

  open() {
    this.readyState = RegressionWebSocket.OPEN;
    this.dispatchEvent(new Event("open"));
  }

  close() {
    this.closeCalls += 1;
    this.readyState = RegressionWebSocket.CLOSED;
    this.dispatchEvent(new CloseEvent("close"));
  }
}

const originalWebSocket = globalThis.WebSocket;
const originalMatchMedia = window.matchMedia;
const originalPermissions = navigator.permissions;
const originalMediaDevices = navigator.mediaDevices;
const originalResizeObserver = globalThis.ResizeObserver;
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

function restoreNavigatorProperty(
  key: "mediaDevices" | "permissions",
  value: MediaDevices | Permissions
) {
  Object.defineProperty(navigator, key, {
    configurable: true,
    value,
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  RegressionWebSocket.instances = [];
  globalThis.WebSocket = originalWebSocket;
  window.matchMedia = originalMatchMedia;
  restoreNavigatorProperty("permissions", originalPermissions);
  restoreNavigatorProperty("mediaDevices", originalMediaDevices);
  globalThis.ResizeObserver = originalResizeObserver;
  __resetLocationStoreForTests();
  history.pushState = originalPushState;
  history.replaceState = originalReplaceState;
  document.cookie = "rapid-cookie=; Max-Age=0; Path=/";
  document.cookie = "codec-cookie=; Max-Age=0; Path=/";
  document
    .querySelectorAll("script[data-regression-script]")
    .forEach((script) => {
      script.remove();
    });
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
});

describe("experimental hook regressions", () => {
  it("retargets a RefObject after React replaces its DOM node during commit", () => {
    const callback = vi.fn();

    function Harness({ second }: { second: boolean }) {
      const targetRef = useRef<HTMLButtonElement | null>(null);
      useEventListener("click", callback, { target: targetRef });
      return (
        <button
          data-testid={second ? "second" : "first"}
          key={second ? "second" : "first"}
          ref={targetRef}
        />
      );
    }

    const view = render(<Harness second={false} />);
    const first = view.getByTestId("first");
    fireEvent.click(first);
    expect(callback).toHaveBeenCalledTimes(1);

    view.rerender(<Harness second />);
    const second = view.getByTestId("second");
    fireEvent.click(first);
    fireEvent.click(second);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("ignores permission changes from the previous descriptor while a new query is pending", async () => {
    const firstStatus = new MockPermissionStatus("granted");
    const secondStatus = new MockPermissionStatus("prompt");
    const secondQuery = createDeferred<PermissionStatus>();
    const query = vi
      .fn()
      .mockResolvedValueOnce(firstStatus)
      .mockReturnValueOnce(secondQuery.promise);
    restoreNavigatorProperty("permissions", {
      query,
    } as unknown as Permissions);

    const { result, rerender } = renderHook(
      ({ name }) => usePermission({ name }),
      { initialProps: { name: "camera" } }
    );
    await waitFor(() => expect(result.current.state).toBe("granted"));

    rerender({ name: "microphone" });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    act(() => firstStatus.setState("denied"));
    expect(result.current.state).toBe("granted");

    secondQuery.resolve(secondStatus as unknown as PermissionStatus);
    await waitFor(() => {
      expect(result.current.state).toBe("prompt");
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("requests inline media constraints once under StrictMode", async () => {
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop }],
    });
    const enumerateDevices = vi.fn().mockResolvedValue([]);
    restoreNavigatorProperty("mediaDevices", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      enumerateDevices,
      getUserMedia,
    } as unknown as MediaDevices);

    renderHook(
      () => useMediaDevices({ requestAccessOnMount: { video: true } }),
      { reactStrictMode: true }
    );

    await waitFor(() => expect(enumerateDevices).toHaveBeenCalledTimes(1));
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("does not let stale media enumeration overwrite a permission-backed result", async () => {
    const staleEnumeration = createDeferred<MediaDeviceInfo[]>();
    const labeledDevice = {
      deviceId: "camera",
      groupId: "group",
      kind: "videoinput",
      label: "Front camera",
      toJSON: () => ({}),
    } as MediaDeviceInfo;
    const enumerateDevices = vi
      .fn()
      .mockReturnValueOnce(staleEnumeration.promise)
      .mockResolvedValueOnce([labeledDevice]);
    const getUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    restoreNavigatorProperty("mediaDevices", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      enumerateDevices,
      getUserMedia,
    } as unknown as MediaDevices);

    const { result } = renderHook(() => useMediaDevices());
    await act(async () => result.current.requestAccess({ video: true }));
    expect(result.current.devices).toEqual([labeledDevice]);

    await act(async () => {
      staleEnumeration.resolve([]);
      await staleEnumeration.promise;
    });
    expect(result.current.devices).toEqual([labeledDevice]);
  });

  it("settles runAsync when cancellation happens during retry backoff", async () => {
    vi.useFakeTimers();
    const service = vi.fn().mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() =>
      useRequest(service, {
        manual: true,
        retryCount: 2,
        retryInterval: 100,
      })
    );

    const request = result.current.runAsync();
    const rejection = expect(request).rejects.toThrow("Request cancelled");
    await act(async () => Promise.resolve());
    act(() => result.current.cancel());

    await rejection;
    expect(service).toHaveBeenCalledTimes(1);
  });

  it("pauses an already scheduled poll while hidden and resumes it when visible", async () => {
    vi.useFakeTimers();
    const service = vi.fn().mockResolvedValue("ok");
    renderHook(() => useRequest(service, { pollingInterval: 20 }));
    await act(async () => Promise.resolve());
    expect(service).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await act(async () => vi.advanceTimersByTimeAsync(100));
    expect(service).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await act(async () => vi.advanceTimersByTimeAsync(20));
    expect(service).toHaveBeenCalledTimes(2);
  });

  it("runs once when ready changes to true even when refresh dependencies are present", async () => {
    const service = vi.fn(async (value: string) => value);
    const { rerender } = renderHook(
      ({ ready }) =>
        useRequest(service, {
          defaultParams: ["value"],
          ready,
          refreshDeps: ["dependency"],
        }),
      { initialProps: { ready: false } }
    );

    rerender({ ready: true });
    await waitFor(() => expect(service).toHaveBeenCalledTimes(1));
  });

  it("keeps successful requests successful when lifecycle callbacks throw", async () => {
    const service = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() =>
      useRequest(service, {
        manual: true,
        retryCount: 2,
        onBefore: () => {
          throw new Error("before");
        },
        onSuccess: () => {
          throw new Error("success");
        },
        onFinally: () => {
          throw new Error("finally");
        },
      })
    );

    await expect(result.current.runAsync()).resolves.toBe("result");
    expect(service).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it("opens the replacement WebSocket during StrictMode effect replay", () => {
    globalThis.WebSocket = RegressionWebSocket as unknown as typeof WebSocket;
    const { result } = renderHook(() => useWebSocket("ws://strict.test"), {
      reactStrictMode: true,
    });

    expect(RegressionWebSocket.instances).toHaveLength(2);
    act(() => RegressionWebSocket.instances[1]!.open());
    expect(result.current.status).toBe("open");
  });

  it("closes a manually connected WebSocket on unmount", () => {
    globalThis.WebSocket = RegressionWebSocket as unknown as typeof WebSocket;
    const { result, unmount } = renderHook(() =>
      useWebSocket("ws://manual.test", { autoConnect: false })
    );
    act(() => result.current.connect());
    const socket = RegressionWebSocket.instances[0]!;

    unmount();
    expect(socket.closeCalls).toBe(1);
  });

  it("reconnects even when the consumer onClose callback throws", async () => {
    vi.useFakeTimers();
    globalThis.WebSocket = RegressionWebSocket as unknown as typeof WebSocket;
    renderHook(() =>
      useWebSocket("ws://callbacks.test", {
        reconnect: { attempts: 1, intervalMs: 10 },
        onClose: () => {
          throw new Error("consumer failure");
        },
      })
    );
    const first = RegressionWebSocket.instances[0]!;
    act(() => {
      first.open();
      first.close();
    });

    await act(async () => vi.advanceTimersByTimeAsync(10));
    expect(RegressionWebSocket.instances).toHaveLength(2);
  });

  it("stabilizes inline script attributes and creates only one script", () => {
    const { rerender, result, unmount } = renderHook(() =>
      useScript("/inline-options.js", {
        attrs: { "data-regression-script": "inline" },
        removeOnUnmount: true,
      })
    );

    rerender();
    rerender();
    expect(
      document.querySelectorAll('script[src$="/inline-options.js"]')
    ).toHaveLength(1);
    expect(result.current.status).toBe("loading");
    unmount();
  });

  it("deduplicates a relative script source against an existing absolute src", () => {
    const existing = document.createElement("script");
    existing.src = "/existing-relative.js";
    existing.dataset.regressionScript = "existing";
    document.body.appendChild(existing);

    const { result } = renderHook(() => useScript("/existing-relative.js"));
    expect(result.current.script).toBe(existing);
    expect(
      document.querySelectorAll('script[src$="/existing-relative.js"]')
    ).toHaveLength(1);
  });

  it("applies rapid cookie functional updates sequentially", () => {
    const { result } = renderHook(() =>
      useBrowserCookieState("rapid-cookie", 0, { path: "/" })
    );

    act(() => {
      result.current[1]((value) => value + 1);
      result.current[1]((value) => value + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(getCookieValue("rapid-cookie")).toBe("2");
  });

  it("lets peer cookie hooks decode invalidation events with their own codec", async () => {
    const numberHook = renderHook(() =>
      useBrowserCookieState("codec-cookie", 0, {
        path: "/",
        encode: String,
        decode: Number,
      })
    );
    const stringHook = renderHook(() =>
      useBrowserCookieState("codec-cookie", "empty", {
        path: "/",
        encode: (value) => value,
        decode: (value) => `peer:${value}`,
      })
    );

    act(() => numberHook.result.current[1](7));
    await waitFor(() => expect(stringHook.result.current[0]).toBe("peer:7"));
    expect(numberHook.result.current[0]).toBe(7);
  });

  it("tolerates malformed percent encoding in externally written cookies", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "cookie"
    );
    const getter = descriptor?.get;
    if (!getter) {
      throw new Error("The test environment must expose document.cookie.");
    }
    vi.spyOn(document, "cookie", "get").mockReturnValue("broken=%E0%A4%A");
    expect(getCookieValue("broken")).toBe("%E0%A4%A");
  });

  it("keeps left and right modifiers independent", () => {
    const target = { current: document.createElement("div") };
    const { result } = renderHook(() => useKeyPress("Shift", { target }));

    act(() => {
      fireEvent.keyDown(target.current, {
        key: "Shift",
        code: "ShiftLeft",
        location: 1,
      });
      fireEvent.keyDown(target.current, {
        key: "Shift",
        code: "ShiftRight",
        location: 2,
      });
      fireEvent.keyUp(target.current, {
        key: "Shift",
        code: "ShiftLeft",
        location: 1,
      });
    });
    expect(result.current).toBe(true);

    act(() => {
      fireEvent.keyUp(target.current, {
        key: "Shift",
        code: "ShiftRight",
        location: 2,
      });
    });
    expect(result.current).toBe(false);
  });

  it("releases a key by physical code when modifier state changes event.key", () => {
    const target = { current: document.createElement("div") };
    const { result } = renderHook(() => useKeyPress("A", { target }));
    act(() => {
      fireEvent.keyDown(target.current, { key: "A", code: "KeyA" });
      fireEvent.keyUp(target.current, { key: "a", code: "KeyA" });
    });
    expect(result.current).toBe(false);
  });

  it("returns a stable unsupported responsive snapshot", () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    let renders = 0;
    const { result, rerender } = renderHook(() => {
      renders += 1;
      return useResponsive(
        { mobile: "(max-width: 600px)" },
        { defaultValue: "mobile" }
      );
    });

    rerender();
    expect(result.current).toEqual({
      current: "mobile",
      matches: { mobile: false },
      isSupported: false,
    });
    expect(renders).toBeLessThan(5);
  });

  it("uses ResizeObserver content-box sizes instead of client dimensions", async () => {
    let resizeCallback: ResizeObserverCallback | null = null;
    globalThis.ResizeObserver = vi.fn().mockImplementation(function (
      callback: ResizeObserverCallback
    ) {
      resizeCallback = callback;
      return { observe: vi.fn(), disconnect: vi.fn() };
    }) as unknown as typeof ResizeObserver;
    const onChange = vi.fn();
    const { result } = renderHook(() => useSize({ onChange }));
    const element = document.createElement("div");
    Object.defineProperty(element, "clientWidth", { value: 120 });
    Object.defineProperty(element, "clientHeight", { value: 80 });
    act(() => result.current[0](element));
    onChange.mockClear();

    const entry = {
      target: element,
      contentBoxSize: [{ inlineSize: 90, blockSize: 60 }],
      contentRect: { width: 90, height: 60 },
    } as unknown as ResizeObserverEntry;
    act(() => resizeCallback?.([entry], {} as ResizeObserver));

    await waitFor(() =>
      expect(result.current[1]).toEqual({ width: 90, height: 60 })
    );
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls useScroll onScroll once for one changed snapshot", () => {
    globalThis.ResizeObserver = vi.fn().mockImplementation(function () {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as unknown as typeof ResizeObserver;
    const onScroll = vi.fn();
    const { result } = renderHook(() => useScroll({ onScroll }), {
      reactStrictMode: true,
    });
    const element = document.createElement("div");
    Object.defineProperty(element, "scrollHeight", { value: 500 });
    Object.defineProperty(element, "clientHeight", { value: 100 });
    act(() => result.current[0](element));
    onScroll.mockClear();

    act(() => {
      element.scrollTop = 20;
      fireEvent.scroll(element);
    });
    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid virtual item sizes", () => {
    expect(() =>
      renderHook(() => useVirtualList({ items: ["item"], itemSize: 0 }))
    ).toThrow("itemSize");
  });

  it("renders initialIndex before the virtual container is measured", () => {
    const { result } = renderHook(() =>
      useVirtualList({
        items: Array.from({ length: 10 }, (_, index) => index),
        itemSize: 20,
        initialIndex: 5,
        overscan: 0,
      })
    );

    expect(result.current.scrollOffset).toBe(100);
    expect(result.current.items.map(({ index }) => index)).toEqual([5]);
  });

  it("does not remove a history wrapper installed after the location store", () => {
    const { unmount } = renderHook(() => useLocationSnapshot());
    const rooksPatchedPushState = history.pushState;
    const externalPushState: History["pushState"] = function (...args) {
      return rooksPatchedPushState.apply(this, args);
    };
    history.pushState = externalPushState;

    unmount();
    expect(history.pushState).toBe(externalPushState);
  });

  it("does not attach beforeunload when a static guard is false", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    renderHook(() => useBeforeUnload({ when: false }));

    expect(
      addEventListener.mock.calls.some(
        ([eventName]) => eventName === "beforeunload"
      )
    ).toBe(false);
  });
});
