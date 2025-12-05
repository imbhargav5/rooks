import { usePromise } from "@/hooks/usePromise";
import { renderHook } from "@testing-library/react";

describe.skip("usePromise", () => {
  it("sets the loading state correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((resolve) => setTimeout(() => resolve("data"), 100));

    const { result, waitForNextUpdate } = renderHook(() =>
      usePromise(asyncFunction)
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });

  it("resolves and sets data", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((resolve) => setTimeout(() => resolve("data"), 100));

    const { result, waitForNextUpdate } = renderHook(() =>
      usePromise(asyncFunction)
    );

    await waitForNextUpdate();

    expect(result.current.data).toBe("data");
  });

  it("handles errors correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = () =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Error")), 100)
      );

    const { result, waitForNextUpdate } = renderHook(() =>
      usePromise(asyncFunction)
    );

    await waitForNextUpdate();

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Error");
  });

  it("handles stale closures correctly", async () => {
    expect.hasAssertions();

    const asyncFunction = (value: number) =>
      new Promise((resolve) => setTimeout(() => resolve(value * 2), 100));

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ value }) => usePromise(() => asyncFunction(value), [value]),
      { initialProps: { value: 1 } }
    );

    await waitForNextUpdate();

    expect(result.current.data).toBe(2);

    rerender({ value: 2 });

    await waitForNextUpdate();

    expect(result.current.data).toBe(4);

    // Check that the state isn't updated with stale data.
    expect(result.current.data).not.toBe(2);
  });

  it("refetches data when dependencies change", async () => {
    expect.hasAssertions();

    const asyncFunction = (value: number) =>
      new Promise((resolve) => setTimeout(() => resolve(value * 2), 100));

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ value }) => usePromise(() => asyncFunction(value), [value]),
      { initialProps: { value: 1 } }
    );

    await waitForNextUpdate();

    expect(result.current.data).toBe(2);

    rerender({ value: 3 });

    await waitForNextUpdate();

    expect(result.current.data).toBe(6);
  });
});
