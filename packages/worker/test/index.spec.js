/**
 * @jest-environment jsdom
 */
import React from "react";
import useWorker from "../src";

describe("useWorker", () => {
  it("should be defined", () => {
    expect(useWorker).toBeDefined();
  });
});

// figure out tests
