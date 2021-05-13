/**
 * @jest-environment jsdom
 */
import React from "react";
import { usePreventBodyScroll } from '../hooks/usePreventBodyScroll';


describe("usePreventBodyScroll", () => {
  it("should be defined", () => {
    expect(usePreventBodyScroll).toBeDefined();
  });
});

// figure out tests
