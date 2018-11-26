/**
 * @jest-environment jsdom
 */
import React from "react";
import useDidMount from "../src";

describe("useDidMount", () => {
  it("should be defined", () => {
    expect(useDidMount).toBeDefined();
  });
});

// figure out tests
