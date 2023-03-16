import React from "react";
import { useIsDropping } from "@/hooks/useIsDropping";

describe("useIsDropping", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useIsDropping).toBeDefined();
  });
});
