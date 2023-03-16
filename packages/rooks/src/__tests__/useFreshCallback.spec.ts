import React from "react";
import { useFreshCallback } from "@/hooks/useFreshCallback";

describe("useFreshCallback", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFreshCallback).toBeDefined();
  });
});
