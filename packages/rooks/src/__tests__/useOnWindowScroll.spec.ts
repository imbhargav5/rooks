import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useOnWindowScroll } from "../hooks/useOnWindowScroll";

describe("useOnWindowScroll", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnWindowScroll).toBeDefined();
  });

  describe("basic", () => {
    const mockCallback = jest.fn(() => {});
    it("should call callback after resize", () => {
      expect.hasAssertions();
      renderHook(() => useOnWindowScroll(mockCallback));
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls).toHaveLength(1);
      fireEvent(window, new Event("scroll"));
      fireEvent(window, new Event("scroll"));
      expect(mockCallback.mock.calls).toHaveLength(3);
    });
  });
});
