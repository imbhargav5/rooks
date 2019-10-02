/**
 * @jest-environment jsdom
 */
import React from "react";
import useIsomorphicEffect from "..";

describe("useIsomorphicEffect", () => {
  it("should be defined", () => {
    expect(useIsomorphicEffect).toBeDefined();
  });
});

// figure out tests
