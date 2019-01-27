/**
 * @jest-environment jsdom
 */
import React from "react";
import useOnline from "..";

describe("useOnline", () => {
  it("should be defined", () => {
    expect(useOnline).toBeDefined();
  });
});

// figure out tests
