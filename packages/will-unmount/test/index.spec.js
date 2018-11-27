/**
 * @jest-environment jsdom
 */
import React from "react";
import useWillUnmount from "../src";

describe("useWillUnmount", () => {
  it("should be defined", () => {
    expect(useWillUnmount).toBeDefined();
  });
});

// figure out tests
