import { renderHook } from "@testing-library/react-hooks";
import { useGetIsMounted } from "../hooks/useGetIsMounted";

describe("useGetIsMounted", () => {
  it("should be defined", () => {
    expect(useGetIsMounted).toBeDefined();
  });

  it("should return a function", () => {
    const hook = renderHook(() => useGetIsMounted());

    expect(typeof hook.result.current).toBe("function");
  });

  it("should return true if component is mounted", () => {
    const hook = renderHook(() => useGetIsMounted());

    expect(hook.result.current()).toBe(true);
  });

  it("should return false if component is unmounted", () => {
    const hook = renderHook(() => useGetIsMounted());

    hook.unmount();

    expect(hook.result.current()).toBe(false);
  });
});
