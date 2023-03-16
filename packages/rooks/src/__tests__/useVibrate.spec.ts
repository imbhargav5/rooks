import React from "react";
import { useVibrate } from "@/hooks/useVibrate";

describe("useVibrate", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useVibrate).toBeDefined();
  });
});
