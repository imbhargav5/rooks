import { usePromise } from "@/hooks/usePromise";
import { renderHook, waitFor } from "@testing-library/react";

describe("usePromise", () => {
  it("sets the loading state correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((resolve) => setTimeout(() => resolve("data"), 100));

    const { result } = renderHook(() => usePromise(asyncFunction));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("resolves and sets data", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((resolve) => setTimeout(() => resolve("data"), 100));

    const { result } = renderHook(() => usePromise(asyncFunction));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe("data");
    expect(result.current.error).toBeNull();
  });

  it("handles errors correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Error")), 100)
      );

    const { result } = renderHook(() => usePromise(asyncFunction));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Error");
  });

  it("handles stale closures correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = (value: number) =>
      new Promise<number>((resolve) =>
        setTimeout(() => resolve(value * 2), 100)
      );

    const { result, rerender } = renderHook(
      ({ value }) => usePromise(() => asyncFunction(value), [value]),
      { initialProps: { value: 1 } }
    );

    await waitFor(() => expect(result.current.data).toBe(2));

    rerender({ value: 2 });

    await waitFor(() => expect(result.current.data).toBe(4));

    // Check that the state isn't updated with stale data.
    expect(result.current.data).not.toBe(2);
  });

  it("refetches data when dependencies change", async () => {
    expect.hasAssertions();

    const asyncFunction = (value: number) =>
      new Promise<number>((resolve) =>
        setTimeout(() => resolve(value * 2), 100)
      );

    const { result, rerender } = renderHook(
      ({ value }) => usePromise(() => asyncFunction(value), [value]),
      { initialProps: { value: 1 } }
    );

    await waitFor(() => expect(result.current.data).toBe(2));

    rerender({ value: 3 });

    await waitFor(() => expect(result.current.data).toBe(6));
  });
});
