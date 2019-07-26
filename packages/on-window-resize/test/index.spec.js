/**
 * @jest-environment jsdom
 */
import React from "react";
import useOnWindowResize from "..";

describe("useOnWindowResize", () => {
  it("should be defined", () => {
    expect(useOnWindowResize).toBeDefined();
  });
});

// figure out tests
