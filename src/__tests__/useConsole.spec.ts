/**
 * @jest-environment jsdom
 */
import React from "react";
import { useConsole } from "../hooks/useConsole";

describe("useConsole", () => {
  it("should be defined", () => {
    expect(useConsole).toBeDefined();
  });
});

// figure out tests
