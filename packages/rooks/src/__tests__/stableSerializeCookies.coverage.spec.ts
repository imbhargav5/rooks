import { vi } from "vitest";
import { stableSerialize } from "@/utils/stableSerialize";
import { getCookieValue, stringifyCookie, removeCookie } from "@/utils/cookies";

describe("stableSerialize", () => {
  it("is independent of key order", () => {
    expect(stableSerialize({ b: 1, a: { d: 2, c: 3 } })).toBe(
      stableSerialize({ a: { c: 3, d: 2 }, b: 1 })
    );
  });

  it("handles primitives, bigint, functions, symbols, undefined", () => {
    expect(stableSerialize(10n)).toBe("bigint:10");
    expect(stableSerialize(Symbol("s"))).toBe("symbol:Symbol(s)");
    expect(stableSerialize(function foo() {})).toMatch(/^function:/);
    expect(stableSerialize(undefined)).toBe("undefined");
    expect(stableSerialize(null)).toBe("null");
    expect(stableSerialize("x")).toBe('"x"');
  });

  it("handles dates, arrays and circular refs", () => {
    expect(stableSerialize(new Date(0))).toBe("date:1970-01-01T00:00:00.000Z");
    expect(stableSerialize([1, "a"])).toBe('[1,"a"]');
    const o: Record<string, unknown> = { a: 1 };
    o.self = o;
    expect(stableSerialize(o)).toContain("[Circular]");
  });
});

describe("cookies utils", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.cookie = "a=; Max-Age=0";
    document.cookie = "bad=; Max-Age=0";
  });

  it("stringifies all options", () => {
    const s = stringifyCookie("n a", "v&", {
      path: "/",
      domain: "x.com",
      maxAge: 5,
      expires: new Date(0),
      sameSite: "lax",
      secure: true,
      partitioned: true,
    });
    expect(s).toBe(
      "n%20a=v%26; Path=/; Domain=x.com; Max-Age=5; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax; Secure; Partitioned"
    );
    expect(stringifyCookie("a", "b", { expires: "tomorrow" })).toBe(
      "a=b; Expires=tomorrow"
    );
  });

  it("reads, decodes, and falls back on malformed encoding", () => {
    document.cookie = "a=hello%20world";
    expect(getCookieValue("a")).toBe("hello world");
    document.cookie = "bad=%E0%A4%A";
    expect(getCookieValue("bad")).toBe("%E0%A4%A");
    expect(getCookieValue("missing")).toBeNull();
  });

  it("removeCookie expires the cookie", () => {
    document.cookie = "a=1; path=/";
    removeCookie("a", { path: "/" });
    expect(getCookieValue("a")).toBeNull();
  });

  it("is safe without document", () => {
    vi.stubGlobal("document", undefined);
    expect(getCookieValue("a")).toBeNull();
    expect(() => removeCookie("a")).not.toThrow();
  });
});
