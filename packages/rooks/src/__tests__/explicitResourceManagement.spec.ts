import {
  EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL,
  assertAsyncDisposeSupport,
  assertSyncDisposeSupport,
  disposeAsync,
  disposeSync,
  explicitResourceManagement,
} from "@/utils/explicitResourceManagement";

describe("explicitResourceManagement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws a descriptive error when Symbol.dispose is unavailable", () => {
    vi.spyOn(explicitResourceManagement, "getDisposeSymbol").mockReturnValue(
      null
    );

    expect(() => assertSyncDisposeSupport("useDisposable")).toThrow(
      `useDisposable requires Symbol.dispose support`
    );
    expect(() => assertSyncDisposeSupport("useDisposable")).toThrow(
      EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL
    );
  });

  it("throws a descriptive error when Symbol.asyncDispose is unavailable", () => {
    vi.spyOn(explicitResourceManagement, "getAsyncDisposeSymbol").mockReturnValue(
      null
    );

    expect(() => assertAsyncDisposeSupport("useAsyncDisposable")).toThrow(
      `useAsyncDisposable requires Symbol.asyncDispose support`
    );
    expect(() => assertAsyncDisposeSupport("useAsyncDisposable")).toThrow(
      EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL
    );
  });

  it("throws when a sync resource does not implement the dispose protocol", () => {
    const disposeSymbol = Symbol.dispose;

    vi.spyOn(explicitResourceManagement, "getDisposeSymbol").mockReturnValue(
      disposeSymbol
    );

    expect(() => disposeSync({}, "useDisposable")).toThrow(
      "useDisposable expected the resource returned by the factory to implement [Symbol.dispose]()."
    );
  });

  it("throws when an async resource does not implement the async dispose protocol", async () => {
    const asyncDisposeSymbol = Symbol.asyncDispose;

    vi.spyOn(explicitResourceManagement, "getAsyncDisposeSymbol").mockReturnValue(
      asyncDisposeSymbol
    );

    await expect(disposeAsync({}, "useAsyncDisposable")).rejects.toThrow(
      "useAsyncDisposable expected the resource returned by the factory to implement [Symbol.asyncDispose]()."
    );
  });
});
