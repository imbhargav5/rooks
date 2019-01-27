/**
 * @jest-environment jsdom
 */
import React from "react";
import useTimeAgo from "..";

describe("useTimeAgo", () => {
  it("should be defined", () => {
    expect(useTimeAgo).toBeDefined();
  });
});

// figure out tests
