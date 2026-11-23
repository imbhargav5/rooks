import { renderHook, act } from "@testing-library/react";
import { useFullscreen } from "@/hooks/useFullscreen";

const DOC_KEYS = [
  "fullscreenEnabled",
  "webkitFullscreenEnabled",
  "mozFullScreenEnabled",
  "msFullscreenEnabled",
  "fullscreenElement",
  "webkitFullscreenElement",
  "webkitCurrentFullScreenElement",
  "mozFullScreenElement",
  "msFullscreenElement",
  "exitFullscreen",
  "webkitExitFullscreen",
  "webkitCancelFullScreen",
  "mozCancelFullScreen",
  "msExitFullscreen",
];

function setDoc(props: Record<string, unknown>) {
  for (const [k, value] of Object.entries(props)) {
    Object.defineProperty(document, k, {
      value,
      writable: true,
      configurable: true,
    });
  }
}

describe("useFullscreen vendor prefixes and edge cases", () => {
  afterEach(() => {
    for (const k of DOC_KEYS) delete (document as any)[k];
    vi.restoreAllMocks();
  });

  const variants = [
    ["standard", "exitFullscreen", "fullscreenchange", "fullscreenerror"],
    [
      "webkit",
      "webkitExitFullscreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    [
      "webkit cancel",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    ["moz", "mozCancelFullScreen", "mozfullscreenchange", "mozfullscreenerror"],
    ["ms", "msExitFullscreen", "MSFullscreenChange", "MSFullscreenError"],
  ] as const;

  it.each(variants)(
    "%s: exits fullscreen and listens to its events",
    async (_n, exitKey, changeEvt, errorEvt) => {
      const exit = vi.fn().mockResolvedValue(undefined);
      setDoc({ [exitKey]: exit });
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const onChange = vi.fn();
      const onError = vi.fn();
      const { result, unmount } = renderHook(() =>
        useFullscreen({ onChange, onError })
      );

      expect(addSpy).toHaveBeenCalledWith(changeEvt, expect.any(Function));
      expect(addSpy).toHaveBeenCalledWith(errorEvt, expect.any(Function));

      await act(async () => {
        await result.current.disableFullscreen();
      });
      expect(exit).toHaveBeenCalledTimes(1);

      const el = document.createElement("div");
      setDoc({ fullscreenElement: el });
      act(() => {
        document.dispatchEvent(new Event(changeEvt));
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(result.current.fullscreenElement).toBe(el);
      expect(result.current.isFullscreenEnabled).toBe(true);

      setDoc({ fullscreenElement: null });
      act(() => {
        document.dispatchEvent(new Event(errorEvt));
      });
      expect(onError).toHaveBeenCalledTimes(1);
      expect(result.current.isFullscreenEnabled).toBe(false);

      unmount();
      expect(removeSpy).toHaveBeenCalledWith(changeEvt, expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith(errorEvt, expect.any(Function));
    }
  );

  it.each([
    ["webkitFullscreenEnabled"],
    ["mozFullScreenEnabled"],
    ["msFullscreenEnabled"],
  ])("detects availability via %s", (key) => {
    setDoc({ [key]: true });
    const { result } = renderHook(() => useFullscreen());
    expect(result.current.isFullscreenAvailable).toBe(true);
  });

  it("detects availability via webkitCancelFullScreen", () => {
    setDoc({ webkitCancelFullScreen: vi.fn() });
    const { result } = renderHook(() => useFullscreen());
    expect(result.current.isFullscreenAvailable).toBe(true);
  });

  it("is unavailable and registers no listeners without any API", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const { result, unmount } = renderHook(() => useFullscreen());
    expect(result.current.isFullscreenAvailable).toBe(false);
    expect(addSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/fullscreen/i),
      expect.anything()
    );
    expect(() => unmount()).not.toThrow();
  });

  it.each([
    ["webkitFullscreenElement"],
    ["webkitCurrentFullScreenElement"],
    ["mozFullScreenElement"],
    ["msFullscreenElement"],
  ])("toggle exits when %s is set", async (key) => {
    const exit = vi.fn().mockResolvedValue(undefined);
    setDoc({ exitFullscreen: exit, [key]: document.createElement("div") });
    const { result } = renderHook(() => useFullscreen());
    await act(async () => {
      await result.current.toggleFullscreen();
    });
    expect(exit).toHaveBeenCalledTimes(1);
  });

  it.each([
    "requestFullscreen",
    "webkitRequestFullscreen",
    "webkitRequestFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen",
  ])(
    "enables fullscreen using %s on the target with options",
    async (method) => {
      const fn = vi.fn().mockResolvedValue(undefined);
      const el: any = document.createElement("div");
      el.requestFullscreen = undefined;
      el[method] = fn;
      const options = { navigationUI: "hide" as const };
      const { result } = renderHook(() =>
        useFullscreen({
          target: { current: el },
          requestFullScreenOptions: options,
        })
      );
      await act(async () => {
        await result.current.toggleFullscreen();
      });
      expect(fn).toHaveBeenCalledWith(options);
    }
  );

  it("falls back to documentElement when no target is given", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    (document.documentElement as any).requestFullscreen = fn;
    const { result } = renderHook(() => useFullscreen());
    await act(async () => {
      await result.current.enableFullscreen();
    });
    expect(fn).toHaveBeenCalled();
    delete (document.documentElement as any).requestFullscreen;
  });

  it("throws when the element has no request method", () => {
    const el: any = document.createElement("div");
    el.requestFullscreen = undefined;
    const { result } = renderHook(() =>
      useFullscreen({ target: { current: el } })
    );
    expect(() => result.current.enableFullscreen()).toThrow(
      "Your browser does not support Fullscreen API."
    );
  });

  it("throws when exit is unsupported", () => {
    const { result } = renderHook(() => useFullscreen());
    expect(() => result.current.disableFullscreen()).toThrow(
      "Your browser does not support Fullscreen API."
    );
  });
});
