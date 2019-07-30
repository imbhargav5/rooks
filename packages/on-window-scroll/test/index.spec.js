/**
 * @jest-environment jsdom
 */
import React from "react";
import useOnWindowScroll from "..";

describe("useOnWindowScroll", () => {
  it("should be defined", () => {
    expect(useOnWindowScroll).toBeDefined();
  });
});

// figure out tests
