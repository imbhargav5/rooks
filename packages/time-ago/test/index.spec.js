/**
 * @jest-environment jsdom
 */
import React from "react";
import useTimeAgo from "../src";

describe("useTimeAgo", () => {
  it("should be defined", () => {
    expect(useTimeAgo).toBeDefined();
  });
});

// figure out tests
