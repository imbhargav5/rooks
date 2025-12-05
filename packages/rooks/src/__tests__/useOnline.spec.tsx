import { vi } from "vitest";
/**
 */
import { renderHook } from "@testing-library/react";
import { useOnline } from "@/hooks/useOnline";

describe("useOnline", () => {
  let onlineGetter = vi.spyOn(window.navigator, "onLine", "get");

  beforeEach(() => {
    onlineGetter = vi.spyOn(window.navigator, "onLine", "get");
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnline).toBeDefined();
  });

  it("should get the online status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
  });

  it("should get the offline status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(false);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(false);
  });
});
