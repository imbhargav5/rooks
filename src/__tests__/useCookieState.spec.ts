/**
 * @jest-environment jsdom
 */
import React from "react";
import { useCookieState } from '../hooks/useCookieState';


describe("useCookieState", () => {
  it("should be defined", () => {
    expect(useCookieState).toBeDefined();
  });
});

// figure out tests
