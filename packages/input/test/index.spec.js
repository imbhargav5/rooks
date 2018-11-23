/**
 * @jest-environment jsdom
 */
import React from "react";
import useInput from "../src";

describe("useInput", () => {
  it("should be defined", () => {
    expect(useInput).toBeDefined();
  });
});

// figure out tests
