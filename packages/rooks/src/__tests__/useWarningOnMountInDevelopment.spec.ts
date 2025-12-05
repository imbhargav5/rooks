import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWarningOnMountInDevelopment } from "@/hooks/useWarningOnMountInDevelopment";

describe("useWarningOnMountInDevelopment", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useWarningOnMountInDevelopment).toBeDefined();
  });
  it("logs error in dev env", () => {
    expect.hasAssertions();
    const spy = vi.spyOn(global.console, "error");
    renderHook(() => useWarningOnMountInDevelopment("message"));
    // eslint-disable-next-line jest/prefer-called-with
    expect(spy).toHaveBeenCalled();
  });
});
