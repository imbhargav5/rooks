/**
 * @jest-environment jsdom
 */
import React from "react";
import useNavigatorLanguage from "../src";

describe("useNavigatorLanguage", () => {
  it("should be defined", () => {
    expect(useNavigatorLanguage).toBeDefined();
  });
});

// figure out tests
