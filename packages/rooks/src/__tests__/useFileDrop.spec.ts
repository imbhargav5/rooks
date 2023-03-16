import React from "react";
import { useFileDrop } from "@/hooks/useFileDrop";

describe("useFileDrop", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFileDrop).toBeDefined();
  });
});
