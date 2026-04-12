import { useCallback, useMemo, useState } from "react";

type UsePaginationOptions = {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
};

type UsePaginationReturn = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  offset: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  next: () => void;
  previous: () => void;
  goTo: (page: number) => void;
  setPageSize: (size: number) => void;
};

/**
 * usePagination hook
 *
 * Manages pagination state including current page, page size, and total items.
 * Provides helpers for navigation and computed values like totalPages and offset.
 *
 * @param {UsePaginationOptions} options - Pagination options
 * @param {number} options.totalItems - Total number of items to paginate
 * @param {number} [options.initialPage=1] - The initial page (1-indexed), defaults to 1
 * @param {number} [options.initialPageSize=10] - The initial page size, defaults to 10
 * @returns {UsePaginationReturn} Pagination state and controls
 * @see https://rooks.vercel.app/docs/hooks/usePagination
 */
function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState<number>(
    Math.max(1, initialPage)
  );
  const [pageSize, setPageSizeState] = useState<number>(
    Math.max(1, initialPageSize)
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const safePage = useMemo(
    () => Math.min(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const offset = useMemo(() => (safePage - 1) * pageSize, [safePage, pageSize]);

  const isFirstPage = safePage === 1;
  const isLastPage = safePage === totalPages;

  const goTo = useCallback(
    (page: number) => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    },
    [totalPages]
  );

  const next = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previous = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const setPageSize = useCallback(
    (size: number) => {
      const newSize = Math.max(1, size);
      setPageSizeState(newSize);
      // Keep the user roughly at the same position in the list
      setCurrentPage((prev) => {
        const currentOffset = (prev - 1) * pageSize;
        return Math.max(1, Math.floor(currentOffset / newSize) + 1);
      });
    },
    [pageSize]
  );

  return {
    currentPage: safePage,
    pageSize,
    totalItems,
    totalPages,
    offset,
    isFirstPage,
    isLastPage,
    next,
    previous,
    goTo,
    setPageSize,
  };
}

export { usePagination };
export type { UsePaginationOptions, UsePaginationReturn };
