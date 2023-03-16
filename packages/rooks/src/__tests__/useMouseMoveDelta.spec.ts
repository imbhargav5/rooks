import React from "react";
import { useMouseMoveDelta } from "@/hooks/useMouseMoveDelta";

describe("useMouseMoveDelta", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useMouseMoveDelta).toBeDefined();
  });
});
