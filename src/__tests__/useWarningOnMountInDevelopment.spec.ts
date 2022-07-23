import { renderHook } from "@testing-library/react-hooks";
import { useWarningOnMountInDevelopment } from "../hooks/useWarningOnMountInDevelopment";

describe("useWarningOnMountInDevelopment", () => {
  it("is defined", () => {
    expect(useWarningOnMountInDevelopment).toBeDefined();
  });
  it("logs error in dev env", () => {
    const spy = jest.spyOn(global.console, "error");
    renderHook(() => useWarningOnMountInDevelopment("message"));
    // eslint-disable-next-line jest/prefer-called-with
    expect(spy).toHaveBeenCalled();
  });
});
