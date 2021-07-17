/**
 * @jest-environment jsdom
 */
import React from "react";
import { useDimensionsRef } from "../hooks/useDimensionsRef";

describe("useDimensionsRef", () => {
  it("should be defined", () => {
    expect(useDimensionsRef).toBeDefined();
  });
});

// figure out tests
