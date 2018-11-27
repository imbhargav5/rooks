/**
 * @jest-environment jsdom
 */
import React from "react";
import useInterval from "../src";

describe("useInterval", () => {
  it("should be defined", () => {
    expect(useInterval).toBeDefined();
  });
});

// figure out tests
