import { renderHook, act } from "@testing-library/react";
import { useScript } from "@/hooks/useScript";

const STATUS_ATTR = "data-rooks-script-status";

describe("useScript coverage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("applies all script options and attributes to the created element", () => {
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/opts.js", {
        id: "opts-script",
        type: "module",
        async: false,
        defer: true,
        noModule: true,
        nonce: "abc",
        crossOrigin: "anonymous",
        integrity: "sha256-xyz",
        referrerPolicy: "no-referrer",
        attrs: { "data-foo": "bar", "data-a": "b" },
      })
    );
    const script = document.getElementById("opts-script") as HTMLScriptElement;
    expect(script.src).toBe("https://cdn.example.com/opts.js");
    expect(script.type).toBe("module");
    expect(script.async).toBe(false);
    expect(script.defer).toBe(true);
    expect(script.noModule).toBe(true);
    expect(script.crossOrigin).toBe("anonymous");
    expect(script.integrity).toBe("sha256-xyz");
    expect(script.referrerPolicy).toBe("no-referrer");
    expect(script.getAttribute("data-foo")).toBe("bar");
    expect(script.getAttribute("data-a")).toBe("b");
    expect(script.getAttribute(STATUS_ATTR)).toBe("loading");
    expect(result.current.script).toBe(script);
    unmount();
  });

  it("reports an error when the script fails to load", () => {
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/fail.js", { id: "fail-script" })
    );
    const script = document.getElementById("fail-script")!;
    act(() => {
      script.dispatchEvent(new Event("error"));
    });
    expect(result.current.status).toBe("error");
    expect(result.current.error?.message).toContain("Failed to load script");
    expect(script.getAttribute(STATUS_ATTR)).toBe("error");
    unmount();
  });

  it("stays idle without a src or id, or with a null src and no script", () => {
    const a = renderHook(() => useScript(null));
    expect(a.result.current.status).toBe("idle");
    const b = renderHook(() => useScript(undefined, { id: "no-src-script" }));
    expect(b.result.current.status).toBe("idle");
    expect(b.result.current.script).toBeNull();
    expect(document.querySelectorAll("script")).toHaveLength(0);
    a.unmount();
    b.unmount();
  });

  it("adopts an existing script by its status attribute", () => {
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/attr.js";
    script.setAttribute(STATUS_ATTR, "error");
    document.body.appendChild(script);
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/attr.js")
    );
    expect(result.current.status).toBe("error");
    expect(result.current.script).toBe(script);
    unmount();
  });

  it("treats an existing src script as loading while the document loads, then ready on load", () => {
    const spy = vi
      .spyOn(document, "readyState", "get")
      .mockReturnValue("loading");
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/pending.js";
    document.body.appendChild(script);
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/pending.js")
    );
    expect(result.current.status).toBe("loading");
    act(() => {
      script.dispatchEvent(new Event("load"));
    });
    expect(result.current.status).toBe("ready");
    spy.mockRestore();
    unmount();
  });

  it("treats an existing src script as ready once the document has loaded", () => {
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/done.js";
    document.body.appendChild(script);
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/done.js")
    );
    expect(result.current.status).toBe("ready");
    unmount();
  });

  it("treats an existing inline script without src as idle", () => {
    const script = document.createElement("script");
    script.id = "inline-script";
    document.body.appendChild(script);
    const { result, unmount } = renderHook(() =>
      useScript(null, { id: "inline-script" })
    );
    expect(result.current.status).toBe("idle");
    expect(result.current.script).toBe(script);
    unmount();
  });

  it("uses readyState on the script element when present", () => {
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/rs.js";
    Object.defineProperty(script, "readyState", { value: "loaded" });
    document.body.appendChild(script);
    const { result, unmount } = renderHook(() =>
      useScript("https://cdn.example.com/rs.js")
    );
    expect(result.current.status).toBe("ready");
    unmount();
  });

  it("shares one record between consumers using the id and the src separately", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/share.js", { id: "share-id" })
    );
    const b = renderHook(() => useScript("https://cdn.example.com/share.js"));
    expect(document.querySelectorAll("script")).toHaveLength(1);
    const script = document.getElementById("share-id")!;
    act(() => {
      script.dispatchEvent(new Event("load"));
    });
    expect(a.result.current.status).toBe("ready");
    expect(b.result.current.status).toBe("ready");
    expect(b.result.current.script).toBe(script);
    a.unmount();
    b.unmount();
  });

  it("re-attaches events when a later consumer joins a still-loading script", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/join.js", { id: "join-id" })
    );
    const b = renderHook(() =>
      useScript("https://cdn.example.com/join.js", { id: "join-id" })
    );
    expect(b.result.current.status).toBe("loading");
    act(() => {
      document.getElementById("join-id")!.dispatchEvent(new Event("load"));
    });
    expect(b.result.current.status).toBe("ready");
    a.unmount();
    b.unmount();
  });

  it("creates the script for a later consumer when the first prevented loading", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/late.js", { shouldPreventLoad: true })
    );
    expect(document.querySelectorAll("script")).toHaveLength(0);
    const b = renderHook(() => useScript("https://cdn.example.com/late.js"));
    expect(document.querySelectorAll("script")).toHaveLength(1);
    expect(b.result.current.status).toBe("loading");
    a.unmount();
    b.unmount();
  });

  it("adopts a script added to the DOM after the first consumer prevented loading", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/adopt.js", { shouldPreventLoad: true })
    );
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/adopt.js";
    document.body.appendChild(script);
    const b = renderHook(() => useScript("https://cdn.example.com/adopt.js"));
    expect(b.result.current.script).toBe(script);
    expect(b.result.current.status).toBe("ready");
    a.unmount();
    b.unmount();
  });

  it("switches to a different script element with the same id", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/swap.js", { id: "swap-id" })
    );
    const original = document.getElementById("swap-id")!;
    original.removeAttribute("id");
    const replacement = document.createElement("script");
    replacement.id = "swap-id";
    replacement.src = "https://cdn.example.com/swap.js";
    document.body.appendChild(replacement);
    const b = renderHook(() =>
      useScript("https://cdn.example.com/swap.js", { id: "swap-id" })
    );
    expect(b.result.current.script).toBe(replacement);
    a.unmount();
    b.unmount();
  });

  it("removes the script only after the last consumer unmounts when any requested removal", () => {
    const a = renderHook(() =>
      useScript("https://cdn.example.com/rc.js", { id: "rc-id" })
    );
    const b = renderHook(() =>
      useScript("https://cdn.example.com/rc.js", {
        id: "rc-id",
        removeOnUnmount: true,
      })
    );
    b.unmount();
    expect(document.getElementById("rc-id")).not.toBeNull();
    a.unmount();
    expect(document.getElementById("rc-id")).toBeNull();
  });

  it("does not remove pre-existing scripts on unmount", () => {
    const script = document.createElement("script");
    script.id = "keep-id";
    script.src = "https://cdn.example.com/keep.js";
    document.body.appendChild(script);
    const { unmount } = renderHook(() =>
      useScript("https://cdn.example.com/keep.js", {
        id: "keep-id",
        removeOnUnmount: true,
      })
    );
    unmount();
    expect(document.getElementById("keep-id")).toBe(script);
  });

  it("falls back to the raw src when it cannot be resolved as a URL", () => {
    const spy = vi
      .spyOn(document, "baseURI", "get")
      .mockReturnValue("not a url");
    const { result, unmount } = renderHook(() => useScript("relative/path.js"));
    expect(result.current.status).toBe("loading");
    spy.mockRestore();
    unmount();
  });

  it("resets to idle when src becomes null", () => {
    const { result, rerender, unmount } = renderHook(
      ({ src }: { src: string | null }) => useScript(src, { id: "reset-id" }),
      {
        initialProps: {
          src: "https://cdn.example.com/reset.js" as string | null,
        },
      }
    );
    expect(result.current.status).toBe("loading");
    rerender({ src: null });
    expect(result.current.status).toBe("loading");
    unmount();
    const { result: r2, unmount: u2 } = renderHook(() => useScript(null));
    expect(r2.current).toEqual({ status: "idle", error: null, script: null });
    u2();
  });
});
