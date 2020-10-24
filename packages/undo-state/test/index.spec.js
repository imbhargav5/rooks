/**
 * @jest-environment jsdom
 */
import React from "react";
import useUndoState from "..";

describe("useUndoState", () => {
  it("should be defined", () => {
    expect(useUndoState).toBeDefined();
  });
});

// figure out tests
