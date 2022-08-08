import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useOnWindowResize } from "@/hooks/useOnWindowResize";

describe("useOnWindowResize", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnWindowResize).toBeDefined();
  });

  describe("basic", () => {
    const mockCallback = jest.fn(() => {});
    it("should call callback after resize", () => {
      expect.hasAssertions();
      renderHook(() => useOnWindowResize(mockCallback));
      fireEvent(window, new Event("resize"));
      expect(mockCallback.mock.calls).toHaveLength(1);
      fireEvent(window, new Event("resize"));
      fireEvent(window, new Event("resize"));
      expect(mockCallback.mock.calls).toHaveLength(3);
    });
  });
});
