import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useVirtualList } from "@/hooks/useVirtualList";

describe("useVirtualList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("computes visible items and supports scrolling helpers", async () => {
    expect.hasAssertions();

    global.ResizeObserver = vi.fn().mockImplementation(function () {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    }) as unknown as typeof ResizeObserver;

    const { result } = renderHook(() =>
      useVirtualList({
        items: Array.from({ length: 20 }, (_, index) => `Item ${index}`),
        itemSize: 20,
      })
    );

    const element = document.createElement("div");
    Object.defineProperty(element, "clientHeight", {
      configurable: true,
      value: 40,
    });
    Object.defineProperty(element, "scrollHeight", {
      configurable: true,
      value: 400,
    });

    act(() => {
      result.current.containerRef(element);
    });

    await waitFor(() => {
      expect(result.current.totalSize).toBe(400);
      expect(result.current.items.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.scrollToIndex(3);
    });

    expect(element.scrollTop).toBe(60);
  });
});
