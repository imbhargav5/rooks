import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { useWarningOnMountInDevelopment } from "../hooks/useWarningOnMountInDevelopment";

describe("useWarningOnMountInDevelopment", () => {
  it("is defined", () => {
    expect(useWarningOnMountInDevelopment).toBeDefined();
  });
  it("logs error in dev env", () => {
    const spy = jest.spyOn(global.console, "error");
    renderHook(() => useWarningOnMountInDevelopment("message"));
    expect(spy).toHaveBeenCalled();
  });
});
