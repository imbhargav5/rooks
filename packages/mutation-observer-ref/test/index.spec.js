/**
 * @jest-environment jsdom
 */
import React from "react";
import useMutationObserverRef from "..";

describe("useMutationObserverRef", () => {
  it("should be defined", () => {
    expect(useMutationObserverRef).toBeDefined();
  });
});

// figure out tests
