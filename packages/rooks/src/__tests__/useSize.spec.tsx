import { renderHook, act } from "@testing-library/react";
import { useSize } from "@/hooks/useSize";

type Entry = Partial<ResizeObserverEntry> & { target: Element };
let instances: FakeRO[] = [];
let throwOnOptions = false;

class FakeRO {
  cb: (entries: Entry[]) => void;
  disconnect = vi.fn();
  observe = vi.fn((_el: Element, opts?: unknown) => {
    if (throwOnOptions && opts) throw new Error("unsupported");
  });
  constructor(cb: (entries: Entry[]) => void) {
    this.cb = cb;
    instances.push(this);
  }
}

const sz = (inlineSize: number, blockSize: number) => ({
  inlineSize,
  blockSize,
});
const rect = (width: number, height: number) =>
  ({ width, height }) as DOMRectReadOnly;

function makeEl() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  Object.defineProperty(el, "clientWidth", { value: 100, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: 50, configurable: true });
  Object.defineProperty(el, "offsetWidth", { value: 120, configurable: true });
  Object.defineProperty(el, "offsetHeight", { value: 70, configurable: true });
  return el;
}

describe("useSize", () => {
  beforeEach(() => {
    instances = [];
    throwOnOptions = false;
    vi.stubGlobal("ResizeObserver", FakeRO);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("starts at 0x0 and measures fallback content size minus padding on attach", () => {
    const { result } = renderHook(() => useSize());
    expect(result.current[1]).toEqual({ width: 0, height: 0 });
    const el = makeEl();
    el.style.paddingLeft = "10px";
    el.style.paddingRight = "10px";
    el.style.paddingTop = "5px";
    act(() => result.current[0](el));
    expect(result.current[1]).toEqual({ width: 80, height: 45 });
  });

  it("uses contentBoxSize (array or single) and vertical writing mode", () => {
    const onChange = vi.fn();
    const el = makeEl();
    const { result } = renderHook(() => useSize({ onChange }));
    act(() => result.current[0](el));
    act(() =>
      instances[0].cb([{ target: el, contentBoxSize: [sz(10, 20)] as never }])
    );
    expect(result.current[1]).toEqual({ width: 10, height: 20 });
    act(() =>
      instances[0].cb([{ target: el, contentBoxSize: sz(11, 21) as never }])
    );
    expect(result.current[1]).toEqual({ width: 11, height: 21 });
    act(() =>
      instances[0].cb([{ target: el, contentBoxSize: [sz(11, 21)] as never }])
    );
    expect(onChange).toHaveBeenCalledTimes(3);

    el.style.writingMode = "vertical-rl";
    act(() =>
      instances[0].cb([{ target: el, contentBoxSize: [sz(30, 40)] as never }])
    );
    expect(result.current[1]).toEqual({ width: 40, height: 30 });
  });

  it("falls back to contentRect and ignores entries for other targets", () => {
    const el = makeEl();
    const { result } = renderHook(() => useSize());
    act(() => result.current[0](el));
    act(() => instances[0].cb([{ target: el, contentRect: rect(7, 8) }]));
    expect(result.current[1]).toEqual({ width: 7, height: 8 });
    act(() =>
      instances[0].cb([{ target: document.body, contentRect: rect(1, 1) }])
    );
    expect(result.current[1]).toEqual({ width: 100, height: 50 });
  });

  it("supports border-box", () => {
    const el = makeEl();
    const { result } = renderHook(() => useSize({ box: "border-box" }));
    act(() => result.current[0](el));
    expect(instances[0].observe).toHaveBeenCalledWith(el, {
      box: "border-box",
    });
    expect(result.current[1]).toEqual({ width: 120, height: 70 });
    act(() =>
      instances[0].cb([{ target: el, borderBoxSize: [sz(5, 6)] as never }])
    );
    expect(result.current[1]).toEqual({ width: 5, height: 6 });
  });

  it("supports device-pixel-content-box", () => {
    const el = makeEl();
    vi.stubGlobal("devicePixelRatio", 2);
    const { result } = renderHook(() =>
      useSize({ box: "device-pixel-content-box" })
    );
    act(() => result.current[0](el));
    expect(result.current[1]).toEqual({ width: 200, height: 100 });
    act(() => instances[0].cb([{ target: el, contentRect: rect(3, 4) }]));
    expect(result.current[1]).toEqual({ width: 6, height: 8 });
    act(() =>
      instances[0].cb([
        { target: el, devicePixelContentBoxSize: [sz(9, 9)] as never },
      ])
    );
    expect(result.current[1]).toEqual({ width: 9, height: 9 });
  });

  it("retries observe without options when the box option throws", () => {
    throwOnOptions = true;
    const el = makeEl();
    const { result } = renderHook(() => useSize({ box: "border-box" }));
    act(() => result.current[0](el));
    expect(instances[0].observe).toHaveBeenCalledTimes(2);
    expect(result.current[1]).toEqual({ width: 120, height: 70 });
  });

  it("debounces measurements and clears timers on unmount", () => {
    vi.useFakeTimers();
    const el = makeEl();
    const { result, unmount } = renderHook(() => useSize({ debounce: 50 }));
    act(() => result.current[0](el));
    expect(result.current[1]).toEqual({ width: 0, height: 0 });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current[1]).toEqual({ width: 100, height: 50 });

    act(() => instances[0].cb([{ target: el, contentRect: rect(1, 1) }]));
    act(() => instances[0].cb([{ target: el, contentRect: rect(2, 2) }]));
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current[1]).toEqual({ width: 2, height: 2 });

    act(() => instances[0].cb([{ target: el, contentRect: rect(3, 3) }]));
    unmount();
    expect(instances[0].disconnect).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("resets when disabled or detached", () => {
    const el = makeEl();
    const { result, rerender } = renderHook(
      ({ disabled }) => useSize({ disabled }),
      { initialProps: { disabled: false } }
    );
    act(() => result.current[0](el));
    expect(result.current[1].width).toBe(100);
    rerender({ disabled: true });
    expect(result.current[1]).toEqual({ width: 0, height: 0 });
    rerender({ disabled: false });
    expect(result.current[1].width).toBe(100);
    act(() => result.current[0](null));
    expect(result.current[1]).toEqual({ width: 0, height: 0 });
  });

  it("measures without ResizeObserver, with debounce cleanup", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    vi.useFakeTimers();
    const el = makeEl();
    const { result, unmount } = renderHook(() => useSize());
    act(() => result.current[0](el));
    expect(result.current[1]).toEqual({ width: 100, height: 50 });
    unmount();

    const hook = renderHook(() => useSize({ debounce: 20 }));
    act(() => hook.result.current[0](el));
    hook.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
