/**
 * @jest-environment jsdom
 */
import React from "react";
import useOutsideClick from "../src";

describe("useOutsideClick", () => {
  it("should be defined", () => {
    expect(useOutsideClick).toBeDefined();
  });
});

// figure out tests
