/**
 * @jest-environment jsdom
 */
import React from "react";
import useIntersectionObserverRef from "..";

describe("useIntersectionObserverRef", () => {
  it("should be defined", () => {
    expect(useIntersectionObserverRef).toBeDefined();
  });
});

// figure out tests
