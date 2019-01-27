/**
 * @jest-environment jsdom
 */
import React from "react";
import useLocalstorage from "..";

describe("useLocalstorage", () => {
  it("should be defined", () => {
    expect(useLocalstorage).toBeDefined();
  });
});

// figure out tests
