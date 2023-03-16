import React from "react";
import { useAudio } from "@/hooks/useAudio";

describe("useAudio", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useAudio).toBeDefined();
  });
});
