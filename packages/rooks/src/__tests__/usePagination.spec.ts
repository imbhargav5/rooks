import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

describe("usePagination", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(usePagination).toBeDefined();
  });

  describe("initialization", () => {
    it("initializes with default values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100 })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalItems).toBe(100);
      expect(result.current.totalPages).toBe(10);
      expect(result.current.offset).toBe(0);
    });

    it("initializes with custom page and page size", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPage: 3, initialPageSize: 5 })
      );

      expect(result.current.currentPage).toBe(3);
      expect(result.current.pageSize).toBe(5);
      expect(result.current.totalPages).toBe(10);
      expect(result.current.offset).toBe(10);
    });

    it("clamps initialPage to 1 when given 0", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPage: 0 })
      );

      expect(result.current.currentPage).toBe(1);
    });

    it("clamps initialPage to 1 when given a negative value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPage: -5 })
      );

      expect(result.current.currentPage).toBe(1);
    });

    it("clamps initialPage to totalPages when given a value exceeding total", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPage: 999, initialPageSize: 10 })
      );

      expect(result.current.currentPage).toBe(3);
    });

    it("computes totalPages correctly for exact division", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 20, initialPageSize: 5 })
      );

      expect(result.current.totalPages).toBe(4);
    });

    it("computes totalPages correctly when items don't divide evenly", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 21, initialPageSize: 5 })
      );

      expect(result.current.totalPages).toBe(5);
    });

    it("returns totalPages of 1 when totalItems is 0", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 0 })
      );

      expect(result.current.totalPages).toBe(1);
    });
  });

  describe("isFirstPage and isLastPage", () => {
    it("isFirstPage is true on page 1", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPageSize: 10 })
      );

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);
    });

    it("isLastPage is true on last page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPage: 5, initialPageSize: 10 })
      );

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
    });

    it("both isFirstPage and isLastPage are true when there is only one page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 5, initialPageSize: 10 })
      );

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe("offset", () => {
    it("offset is 0 on first page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      expect(result.current.offset).toBe(0);
    });

    it("offset is correct on subsequent pages", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPage: 4, initialPageSize: 10 })
      );

      expect(result.current.offset).toBe(30);
    });

    it("offset updates when navigating to the next page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      expect(result.current.offset).toBe(0);
      act(() => {
        result.current.next();
      });
      expect(result.current.offset).toBe(10);
    });
  });

  describe("next", () => {
    it("advances to the next page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPageSize: 10 })
      );

      act(() => {
        result.current.next();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("does not go past the last page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.next();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it("can advance multiple times", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPageSize: 10 })
      );

      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
      });

      expect(result.current.currentPage).toBe(4);
    });
  });

  describe("previous", () => {
    it("goes back to the previous page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("does not go below page 1", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPageSize: 10 })
      );

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("goTo", () => {
    it("navigates to a specific page", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      act(() => {
        result.current.goTo(7);
      });

      expect(result.current.currentPage).toBe(7);
    });

    it("clamps to page 1 when given a value less than 1", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      act(() => {
        result.current.goTo(-3);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it("clamps to last page when given a value exceeding total pages", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      act(() => {
        result.current.goTo(999);
      });

      expect(result.current.currentPage).toBe(10);
    });

    it("navigates to page 1 when given 0", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPage: 3, initialPageSize: 10 })
      );

      act(() => {
        result.current.goTo(0);
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("setPageSize", () => {
    it("updates the page size", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPageSize: 10 })
      );

      act(() => {
        result.current.setPageSize(20);
      });

      expect(result.current.pageSize).toBe(20);
      expect(result.current.totalPages).toBe(5);
    });

    it("recomputes totalPages after page size change", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 50, initialPageSize: 10 })
      );

      expect(result.current.totalPages).toBe(5);

      act(() => {
        result.current.setPageSize(5);
      });

      expect(result.current.totalPages).toBe(10);
    });

    it("clamps page size to 1 when given 0 or negative", () => {
      expect.hasAssertions();
      const { result } = renderHook(() =>
        usePagination({ totalItems: 30, initialPageSize: 10 })
      );

      act(() => {
        result.current.setPageSize(0);
      });

      expect(result.current.pageSize).toBe(1);
    });

    it("keeps the user near the same position after resizing", () => {
      expect.hasAssertions();
      // Start at page 3 with page size 10 → offset 20
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.offset).toBe(20);

      // Change to page size 20 → user was at item 20, now on page 2 (items 20-39)
      act(() => {
        result.current.setPageSize(20);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(20);
    });
  });
});
