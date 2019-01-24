/**
 * @jest-environment jsdom
 */
import React from "react";
import usePrevious from "../src";

describe("usePrevious", () => {
  it("should be defined", () => {
    expect(usePrevious).toBeDefined();
  });
});

// figure out tests
