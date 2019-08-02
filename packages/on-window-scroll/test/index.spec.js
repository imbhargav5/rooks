/**
 * @jest-environment jsdom
 */
import React from "react";
import useOnWindowScroll from "..";
import { render, cleanup, fireEvent } from "@testing-library/react";

describe("useOnWindowScroll", () => {
  it("should be defined", () => {
    expect(useOnWindowScroll).toBeDefined();
  });

  describe("basic", () => {
    let App;
    const mockCallback = jest.fn(() => {});
    beforeEach(() => {
      App = function() {
        useOnWindowScroll(mockCallback);
        return null;
      };
    });
    afterEach(cleanup); // <-- add this
    it("should call callback after scroll", () => {
      render(<App />);
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(1);
      fireEvent(window, new Event("scroll"));
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});

// figure out tests
