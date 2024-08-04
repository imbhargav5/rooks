import { CallbackRef } from "@/utils/utils";
import { useIntersectionObserverRef } from "./useIntersectionObserverRef";
import { useMapState } from "./useMapState";

interface UseLoadMoreResult<T> {
  apiResponse: T[];
  isLoading: boolean;
  isLastPage: boolean;
  error: Error | null;
  loadMoreRef: CallbackRef;
}

/**
 * useInfiniteScroll
 * @description A custom React hook that handles infinite scrolling by fetching additional apiResponse when the user scrolls to the bottom of the page. It manages the current page, accumulates fetched apiResponse, and handles isLoading and error states.
 * @see {@link https://rooks.vercel.app/docs/useInfiniteScroll}
 */
const useInfiniteScroll = <T>(
  fetchData: (page: number) => Promise<T[]>,
  initialData: T[] = [],
  observerOptions?: IntersectionObserverInit
): UseLoadMoreResult<T> => {
  
  // State management using useMapState hook
  const [{ apiResponse, isLoading, error, page, isLastPage }, { set, setMultiple }] =
    useMapState({
      apiResponse: initialData,
      isLoading: false,
      error: null,
      page: 1,
      isLastPage: false,
    } as { apiResponse: T[]; isLoading: boolean; error: Error | null; page: number; isLastPage: boolean });

  // Function to fetch and append more apiResponse
  const loadMoreData = async () => {
    if (isLoading || isLastPage) return;
    set("isLoading", true);
    try {
      const newData = await fetchData(page);
      setMultiple({
        apiResponse: [...apiResponse, ...newData],
        page: page + 1,
        isLastPage: newData.length === 0,
      });
    } catch (err) {
      set("error", err instanceof Error ? err : new Error(String(err)));
    } finally {
      set("isLoading", false);
    }
  };

  const intersectionObserverCallback = async (
    entries?: IntersectionObserverEntry[]
  ) => {
    if (entries && entries[0]?.isIntersecting) {
      loadMoreData();
    }
  };

  const [loadMoreRef] = useIntersectionObserverRef(
    intersectionObserverCallback,
    observerOptions
  );

  return { apiResponse, isLoading, error, isLastPage, loadMoreRef };
};

export { useInfiniteScroll };
