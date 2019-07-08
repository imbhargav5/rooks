/**
 * @jest-environment jsdom
 */
import React from "react";
import useLazyImage from "..";

describe("useLazyImage", () => {
  it("should be defined", () => {
    expect(useLazyImage).toBeDefined();
  });
});

// figure out tests
