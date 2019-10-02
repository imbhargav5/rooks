/**
 * @jest-environment jsdom
 */
import React from "react";
import useForkRef from "..";

describe("useForkRef", () => {
  it("should be defined", () => {
    expect(useForkRef).toBeDefined();
  });
});

// figure out tests
