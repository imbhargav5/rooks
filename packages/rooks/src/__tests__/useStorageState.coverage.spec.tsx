import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalstorageState } from "@/hooks/useLocalstorageState";
import { useSessionstorageState } from "@/hooks/useSessionstorageState";

const variants = [
  {
    name: "useLocalstorageState",
    hook: useLocalstorageState,
    area: () => window.localStorage,
    prefix: "localstorage",
  },
  {
    name: "useSessionstorageState",
    hook: useSessionstorageState,
    area: () => window.sessionStorage,
    prefix: "sessionstorage",
  },
] as const;

describe.each(variants)("$name coverage", ({ hook, area, prefix }) => {
  const useHook = hook as <S>(
    key: string,
    initial?: S | (() => S)
  ) => [S, (v: S | ((p: S) => S)) => void, () => void];

  const fireStorage = (key: string, newValue: string | null) => {
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key, newValue, storageArea: area() })
      );
    });
  };

  beforeEach(() => {
    area().clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("falls back to raw string when stored value is invalid JSON", () => {
    area().setItem("k", "not-json{");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useHook<string>("k", "init"));
    expect(result.current[0]).toBe("not-json{");
    expect(spy).toHaveBeenCalled();
  });

  it("returns the initial value when getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useHook<string>("k", "init"));
    expect(result.current[0]).toBe("init");
    expect(spy).toHaveBeenCalled();
  });

  it("logs and keeps state when setItem throws (quota)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useHook<number>("k", 1));
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it("resolves function initializers", () => {
    const { result } = renderHook(() => useHook<number>("k", () => 7));
    expect(result.current[0]).toBe(7);
  });

  it("supports functional updates and removes key when set to undefined", () => {
    const { result } = renderHook(() => useHook<number | undefined>("k", 1));
    act(() => result.current[1]((p) => (p ?? 0) + 1));
    expect(area().getItem("k")).toBe("2");
    act(() => result.current[1](undefined));
    expect(area().getItem("k")).toBeNull();
  });

  it("remove deletes the key and logs when removeItem throws", () => {
    const { result } = renderHook(() => useHook<number>("k", 1));
    act(() => result.current[1](5));
    act(() => result.current[2]());
    expect(area().getItem("k")).toBeNull();

    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("nope");
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    act(() => result.current[2]());
    expect(spy).toHaveBeenCalled();
  });

  it("re-initializes when key changes", () => {
    area().setItem("b", JSON.stringify("from-b"));
    const { result, rerender } = renderHook(
      ({ k }) => useHook<string>(k, "d"),
      { initialProps: { k: "a" } }
    );
    expect(result.current[0]).toBe("d");
    rerender({ k: "b" });
    expect(result.current[0]).toBe("from-b");
  });

  it("syncs from cross-tab storage events", () => {
    const { result } = renderHook(() => useHook<string | null>("k", "a"));
    fireStorage("k", JSON.stringify("remote"));
    expect(result.current[0]).toBe("remote");
    fireStorage("k", JSON.stringify("remote"));
    expect(result.current[0]).toBe("remote");
    fireStorage("k", null);
    expect(result.current[0]).toBeNull();
  });

  it("ignores storage events for other keys and survives invalid JSON", () => {
    const { result } = renderHook(() => useHook<string>("k", "a"));
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    fireStorage("other", JSON.stringify("x"));
    expect(result.current[0]).toBe("a");
    fireStorage("k", "{bad");
    expect(result.current[0]).toBe("a");
    expect(log).toHaveBeenCalled();
  });

  it("syncs hooks sharing a key within the same document", () => {
    const first = renderHook(() => useHook<number>("shared", 0));
    const second = renderHook(() => useHook<number>("shared", 0));
    act(() => first.result.current[1](9));
    expect(second.result.current[0]).toBe(9);
  });

  it("handles a malformed within-document event without throwing", () => {
    const { result } = renderHook(() => useHook<number>("k", 1));
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    act(() => {
      document.dispatchEvent(
        new CustomEvent(`rooks-k-${prefix}-update`, { detail: null })
      );
    });
    expect(result.current[0]).toBe(1);
    expect(log).toHaveBeenCalled();
  });

  it("warns instead of throwing when document is unavailable on set", () => {
    const { result } = renderHook(() => useHook<number>("k", 1));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("document", undefined);
    try {
      act(() => result.current[1](3));
    } finally {
      vi.unstubAllGlobals();
    }
    expect(warn).toHaveBeenCalled();
  });

  it("returns initial value when storage global is undefined", () => {
    vi.stubGlobal("localStorage", undefined);
    vi.stubGlobal("sessionStorage", undefined);
    const { result } = renderHook(() => useHook<string>("k", "fallback"));
    expect(result.current[0]).toBe("fallback");
    act(() => result.current[1]("x"));
    expect(result.current[0]).toBe("x");
  });
});
