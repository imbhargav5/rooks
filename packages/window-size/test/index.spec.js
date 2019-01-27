/**
 * @jest-environment jsdom
 */
import React from "react";
import useWindowSize from "..";
import puppeteer from "puppeteer";

describe("useWindowSize", () => {
  it("should be defined", () => {
    expect(useWindowSize).toBeDefined();
  });
});

// figure out tests
