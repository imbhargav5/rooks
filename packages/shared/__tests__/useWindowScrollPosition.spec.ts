/**
 * @jest-environment jsdom
 */
import {useWindowScrollPosition} from "../useWindowScrollPosition";
import {  
  fireEvent,
} from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";

describe("useWindowScrollPosition", () => {
  it("should be defined", () => {
    expect(useWindowScrollPosition).toBeDefined();
  });

  describe("basic", () => {
    it("should call callback after resize", () => {
      const {result} = renderHook(()=>useWindowScrollPosition())
      expect(result.current.scrollX).toBe(0)
      expect(result.current.scrollY).toBe(0)
      act(() => {
        fireEvent.scroll(window, { target : {pageYOffset: 100}});
      })
      expect(result.current.scrollX).toBe(0)
      expect(result.current.scrollY).toBe(100)
      act(() => {
        fireEvent.scroll(window, { target : {pageXOffset: 300}});
      })
      expect(result.current.scrollX).toBe(300)
      expect(result.current.scrollY).toBe(100)
    });
  });
});

// figure out tests
