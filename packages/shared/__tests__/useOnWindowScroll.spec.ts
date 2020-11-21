/**
 * @jest-environment jsdom
 */
import {useOnWindowScroll} from "../useOnWindowScroll";
import {  
  fireEvent,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

describe("useOnWindowScroll", () => {
  it("should be defined", () => {
    expect(useOnWindowScroll).toBeDefined();
  });

  describe("basic", () => {
    const mockCallback = jest.fn(() => {});
    it("should call callback after resize", () => {
      renderHook(()=>useOnWindowScroll(mockCallback))
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(1);
      fireEvent(window, new Event("scroll"));
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls.length).toBe(3);
    });
  });
});

// figure out tests
