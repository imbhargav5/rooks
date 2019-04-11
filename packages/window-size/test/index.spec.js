/**
 * @jest-environment jsdom
 */
import React from "react";
import useWindowSize from "..";

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect(useWindowSize).toBeDefined();
  });
});

// figure out tests
