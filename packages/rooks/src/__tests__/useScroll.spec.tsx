import { renderHook, act } from "@testing-library/react";
import { useScroll } from "@/hooks/useScroll";

let roInstances: FakeResizeObserver[] = [];

class FakeResizeObserver {
  cb: () => void;
  observed: Element[] = [];
  disconnect = vi.fn();
  constructor(cb: () => void) {
    this.cb = cb;
    roInstances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  unobserve() {}
}

function makeEl() {
  const el = document.createElement("div");
  const child = document.createElement("span");
  el.appendChild(child);
  document.body.appendChild(el);
  let top = 0;
  Object.defineProperty(el, "scrollTop", {
    get: () => top,
    set: (v) => {
      top = v;
    },
    configurable: true,
  });
  Object.defineProperty(el, "clientHeight", { value: 100, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: 500, configurable: true });
  return { el, child };
}

const scroll = (el: HTMLElement, top: number) =>
  act(() => {
    el.scrollTop = top;
    el.dispatchEvent(new Event("scroll"));
  });

describe("useScroll", () => {
  beforeEach(() => {
    roInstances = [];
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("returns zero state initially", () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current[1]).toEqual({
      scrollLeft: 0,
      scrollTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      scrollWidth: 0,
      scrollHeight: 0,
    });
  });

  it("reads state on attach and scroll, calling onScroll only on change", () => {
    const onScroll = vi.fn();
    const { el, child } = makeEl();
    const { result } = renderHook(() => useScroll({ onScroll }));
    act(() => result.current[0](el));
    expect(result.current[1].clientHeight).toBe(100);
    expect(result.current[1].scrollHeight).toBe(500);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(roInstances[0].observed).toEqual([el, child]);

    scroll(el, 40);
    expect(result.current[1].scrollTop).toBe(40);
    expect(onScroll).toHaveBeenCalledTimes(2);

    act(() => {
      el.dispatchEvent(new Event("scroll"));
    });
    expect(onScroll).toHaveBeenCalledTimes(2);

    act(() => {
      el.scrollTop = 60;
      roInstances[0].cb();
    });
    expect(result.current[1].scrollTop).toBe(60);

    act(() => {
      el.scrollTop = 70;
      el.dispatchEvent(new Event("load"));
    });
    expect(result.current[1].scrollTop).toBe(70);
  });

  it("reacts to font loading events and stops after unmount", () => {
    const fonts = new EventTarget();
    Object.defineProperty(document, "fonts", {
      value: fonts,
      configurable: true,
    });
    try {
      const { el } = makeEl();
      const { result, unmount } = renderHook(() => useScroll());
      act(() => result.current[0](el));
      act(() => {
        el.scrollTop = 9;
        fonts.dispatchEvent(new Event("loadingdone"));
      });
      expect(result.current[1].scrollTop).toBe(9);
      unmount();
    } finally {
      delete (document as unknown as { fonts?: unknown }).fonts;
    }
  });

  it("observes nodes added via mutation", async () => {
    const { el } = makeEl();
    const { result } = renderHook(() => useScroll());
    act(() => result.current[0](el));
    const wrapper = document.createElement("section");
    const inner = document.createElement("b");
    wrapper.appendChild(inner);
    await act(async () => {
      el.appendChild(wrapper);
      el.appendChild(document.createTextNode("x"));
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(roInstances[0].observed).toContain(wrapper);
    expect(roInstances[0].observed).toContain(inner);
  });

  it("throttles updates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    const { el } = makeEl();
    const { result } = renderHook(() => useScroll({ throttleMs: 100 }));
    act(() => result.current[0](el));
    expect(result.current[1].scrollHeight).toBe(500);

    scroll(el, 10);
    expect(result.current[1].scrollTop).toBe(0);
    scroll(el, 20);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current[1].scrollTop).toBe(20);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    scroll(el, 30);
    expect(result.current[1].scrollTop).toBe(30);
  });

  it("runs immediately and clears a pending timer once the window has passed; clears on unmount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    const { el } = makeEl();
    const { result, unmount } = renderHook(() =>
      useScroll({ throttleMs: 100 })
    );
    act(() => result.current[0](el));
    scroll(el, 10);
    expect(vi.getTimerCount()).toBe(1);
    vi.setSystemTime(2000);
    scroll(el, 25);
    expect(result.current[1].scrollTop).toBe(25);
    expect(vi.getTimerCount()).toBe(0);

    scroll(el, 26);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("resets and ignores events when disabled or detached", () => {
    const { el } = makeEl();
    const { result, rerender } = renderHook(
      ({ disabled }) => useScroll({ disabled }),
      { initialProps: { disabled: false } }
    );
    act(() => result.current[0](el));
    expect(result.current[1].scrollHeight).toBe(500);
    rerender({ disabled: true });
    expect(result.current[1].scrollHeight).toBe(0);
    act(() => {
      el.dispatchEvent(new Event("scroll"));
    });
    expect(result.current[1].scrollHeight).toBe(0);
    rerender({ disabled: false });
    expect(result.current[1].scrollHeight).toBe(500);
    act(() => result.current[0](null));
    expect(result.current[1].scrollHeight).toBe(0);
  });

  it("works without ResizeObserver/MutationObserver and disconnects on unmount", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("MutationObserver", undefined);
    const { el } = makeEl();
    const { result } = renderHook(() => useScroll());
    act(() => result.current[0](el));
    expect(result.current[1].scrollHeight).toBe(500);

    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const hook2 = renderHook(() => useScroll());
    act(() => hook2.result.current[0](el));
    hook2.unmount();
    expect(roInstances[0].disconnect).toHaveBeenCalled();
  });
});
