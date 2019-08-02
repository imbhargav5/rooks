/**
 * @jest-environment jsdom
 */
import React from "react";
import useOnWindowResize from "..";
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId
} from "@testing-library/react";

describe("useOnWindowResize", () => {
  it("should be defined", () => {
    expect(useOnWindowResize).toBeDefined();
  });

  describe("basic", () => {
    let App;
    const mockCallback = jest.fn(() => {});
    beforeEach(() => {
      App = function() {
        useOnWindowResize(mockCallback);
        return null;
      };
    });
    afterEach(cleanup); // <-- add this
    it("should call callback after resize", () => {
      render(<App />);
      fireEvent(window, new Event("resize"));
      expect(mockCallback.mock.calls.length).toBe(1);
      fireEvent(window, new Event("resize"));
      fireEvent(window, new Event("resize"));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});

// figure out tests
