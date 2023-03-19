import { renderHook } from "@testing-library/react-hooks";
import { useDeepCompareEffect } from "@/hooks/useDeepCompareEffect";

describe("useDeepCompareEffect", () => {
  it("should call the effect when the component is mounted", () => {
    expect.hasAssertions();
    const effect = jest.fn();
    const deps = [{ value: 1 }];

    renderHook(() => useDeepCompareEffect(effect, deps));

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("should not call the effect when the shallow dependencies remain unchanged", () => {
    expect.hasAssertions();
    const effect = jest.fn();
    const deps = [{ value: 1 }];
    const { rerender } = renderHook(() => useDeepCompareEffect(effect, deps));

    rerender();

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("should call the effect when the deep dependencies change", () => {
    expect.hasAssertions();
    const effect = jest.fn();
    let deps = [{ value: 1 }];
    const { rerender } = renderHook(() => useDeepCompareEffect(effect, deps));

    deps = [{ value: 2 }];
    rerender();

    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("should call the cleanup function when the deep dependencies change", () => {
    expect.hasAssertions();
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);
    let deps = [{ value: 1 }];
    const { rerender } = renderHook(() => useDeepCompareEffect(effect, deps));

    deps = [{ value: 2 }];
    rerender();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("should call the cleanup function when the component is unmounted", () => {
    expect.hasAssertions();
    const cleanup = jest.fn();
    const effect = jest.fn(() => cleanup);
    const deps = [{ value: 1 }];
    const { unmount } = renderHook(() => useDeepCompareEffect(effect, deps));

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
