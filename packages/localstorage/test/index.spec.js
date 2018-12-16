/**
 * @jest-environment jsdom
 */
import React from "react";
import useLocalStorage from "../src";

describe("useLocalStorage", () => {
  it("should be defined", () => {
    expect(useLocalStorage).toBeDefined();
  });
});

// figure out tests
