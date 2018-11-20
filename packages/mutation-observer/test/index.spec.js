/**
 * @jest-environment jsdom
 */
import React from "react";
import useMutationObserver from "../src";

describe("useMutationObserver", () => {
  it("should be defined", () => {
    expect(useMutationObserver).toBeDefined();
  });
});

// figure out tests
