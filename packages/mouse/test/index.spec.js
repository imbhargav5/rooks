/**
 * @jest-environment jsdom
 */
import React from "react";
import useMouse from "../src";

describe("useMouse", () => {
  it("should be defined", () => {
    expect(useMouse).toBeDefined();
  });
});

// figure out tests
