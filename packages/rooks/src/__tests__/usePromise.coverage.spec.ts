import { renderHook, waitFor } from "@testing-library/react";
import { usePromise } from "@/hooks/usePromise";

describe("usePromise coverage", () => {
  it("starts loading then resolves data", async () => {
    const { result } = renderHook(() =>
      usePromise(() => Promise.resolve("ok"))
    );
    expect(result.current).toEqual({ data: null, loading: true, error: null });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({ data: "ok", loading: false, error: null });
  });

  it("captures Error rejections", async () => {
    const err = new Error("boom");
    const { result } = renderHook(() => usePromise(() => Promise.reject(err)));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(err);
    expect(result.current.data).toBeNull();
  });

  it("normalizes non-Error rejections", async () => {
    const { result } = renderHook(() =>
      usePromise(() => Promise.reject("plain"))
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("plain");
  });

  it("ignores resolution after unmount", async () => {
    let resolve!: (v: string) => void;
    const p = new Promise<string>((r) => (resolve = r));
    const { result, unmount } = renderHook(() => usePromise(() => p));
    unmount();
    resolve("late");
    await p;
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("ignores rejection after unmount", async () => {
    let reject!: (e: Error) => void;
    const p = new Promise<string>((_, r) => (reject = r));
    const { result, unmount } = renderHook(() => usePromise(() => p));
    unmount();
    reject(new Error("late"));
    await p.catch(() => {});
    expect(result.current.error).toBeNull();
  });

  it("refetches when deps change", async () => {
    const { result, rerender } = renderHook(
      ({ v }) => usePromise(() => Promise.resolve(v * 2), [v]),
      { initialProps: { v: 1 } }
    );
    await waitFor(() => expect(result.current.data).toBe(2));
    rerender({ v: 3 });
    await waitFor(() => expect(result.current.data).toBe(6));
  });
});
