import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { renderHook } from "@testing-library/react";

describe("useInfiniteScroll", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useInfiniteScroll).toBeDefined();
  });
});

describe("useInfiniteScroll", () => {
  const fetchData = jest.fn();

  test("initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useInfiniteScroll(fetchData));
    expect(result.current.apiResponse).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLastPage).toBe(false);
    expect(result.current.loadMoreRef).toBeInstanceOf(Function);
  });
});
