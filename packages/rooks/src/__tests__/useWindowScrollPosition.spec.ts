import { fireEvent } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react";
import { useWindowScrollPosition } from "@/hooks/useWindowScrollPosition";

describe("useWindowScrollPosition", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useWindowScrollPosition).toBeDefined();
  });

  describe("basic", () => {
    it("should call callback after resize", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWindowScrollPosition());
      expect(result.current.scrollX).toBe(0);
      expect(result.current.scrollY).toBe(0);
      act(() => {
        fireEvent.scroll(window, {
          target: { pageYOffset: 100, scrollY: 100 },
        });
      });
      expect(result.current.scrollX).toBe(0);
      expect(result.current.scrollY).toBe(100);
      act(() => {
        fireEvent.scroll(window, {
          target: { pageXOffset: 300, scrollX: 300 },
        });
      });
      expect(result.current.scrollX).toBe(300);
      expect(result.current.scrollY).toBe(100);
    });

    it("preserves zero scroll coordinates instead of using legacy offsets", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useWindowScrollPosition());

      act(() => {
        fireEvent.scroll(window, {
          target: {
            pageXOffset: 300,
            pageYOffset: 100,
            scrollX: 0,
            scrollY: 0,
          },
        });
      });

      expect(result.current).toEqual({ scrollX: 0, scrollY: 0 });
    });
  });
});
