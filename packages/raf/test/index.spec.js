/**
 * @jest-environment jsdom
 */
import React from "react";
import useRaf from "..";

describe("useRaf", () => {
  it("should be defined", () => {
    expect(useRaf).toBeDefined();
  });
});

// figure out tests
