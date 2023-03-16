import React from "react";
import { useOrientation } from "@/hooks/useOrientation";

describe("useOrientation", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOrientation).toBeDefined();
  });
});
