/**
 * usePromise
 * @description Promise management hook for react
 * @see {@link https://rooks.vercel.app/docs/hooks/usePromise}
 */
import { useState, useEffect, DependencyList } from "react";
import { useFreshCallback } from "./useFreshCallback";

type AsyncFunction<T> = () => Promise<T>;

type PromiseState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function usePromise<T>(
  asyncFunction: AsyncFunction<T>,
  deps: DependencyList = []
): PromiseState<T> {
  const [state, setState] = useState<PromiseState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const freshAsyncCallback = useFreshCallback(asyncFunction);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await freshAsyncCallback();
        if (isMounted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshAsyncCallback, ...deps]);

  return state;
}

export { usePromise };
