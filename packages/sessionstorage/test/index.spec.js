/**
 * @jest-environment jsdom
 */
import React from "react";
import useSessionstorage from "..";

describe("useSessionstorage", () => {
  it("should be defined", () => {
    expect(useSessionstorage).toBeDefined();
  });
});

// figure out tests
