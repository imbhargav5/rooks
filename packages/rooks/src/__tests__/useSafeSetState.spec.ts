import { renderHook, act } from "@testing-library/react";
import { useSafeSetState } from "@/hooks/useSafeSetState";

describe("useSafeSetState", () => {
  it("should update state when the component is mounted", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSafeSetState(0));
    const [, safeSetState] = result.current;

    act(() => {
      safeSetState(1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should not update state when the component is unmounted", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useSafeSetState(0));
    const [, safeSetState] = result.current;

    unmount();

    act(() => {
      safeSetState(1);
    });

    expect(result.current[0]).toBe(0);
  });

  it("should handle functional updates correctly", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useSafeSetState(0));
    const [, safeSetState] = result.current;

    act(() => {
      safeSetState((prevState) => prevState + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should not update state with functional updates when the component is unmounted", () => {
    expect.hasAssertions();
    const { result, unmount } = renderHook(() => useSafeSetState(0));
    const [, safeSetState] = result.current;

    unmount();

    act(() => {
      safeSetState((prevState) => prevState + 1);
    });

    expect(result.current[0]).toBe(0);
  });
});
