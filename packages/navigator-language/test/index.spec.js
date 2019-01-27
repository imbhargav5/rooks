/**
 * @jest-environment jsdom
 */
import React from "react";
import useNavigatorLanguage from "..";

describe("useNavigatorLanguage", () => {
  it("should be defined", () => {
    expect(useNavigatorLanguage).toBeDefined();
  });
});

// figure out tests
