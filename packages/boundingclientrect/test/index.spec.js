/**
 * @jest-environment jsdom
 */
import React from "react";
import useBoundingClientRect from "..";

describe("useBoundingClientRect", () => {
  it("should be defined", () => {
    expect(useBoundingClientRect).toBeDefined();
  });
});

// figure out tests
