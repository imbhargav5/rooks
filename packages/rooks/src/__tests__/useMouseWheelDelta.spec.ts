import React from "react";
import { useMouseWheelDelta } from "@/hooks/useMouseWheelDelta";

describe("useMouseWheelDelta", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMouseWheelDelta).toBeDefined();
  });
});
