import { useCallback, useEffect, useRef, useState } from "react";

export type InfiniteScrollHandler = {
    sentinelRef: React.RefObject<HTMLElement | null>;
    isLoading: boolean;
    stopObserving: () => void;
    resumeObserving: () => void;
    rootRef: React.RefObject<HTMLElement | null>;
};

/**
 * useInfiniteScroll
 * @description A hook for infinite scrolling with intersection observer
 * @param {() => void} callback Function to call when sentinel element is visible
 * @param {IntersectionObserverInit} options Options for the intersection observer
 * @returns {InfiniteScrollHandler} Handler for the infinite scroll
 * @see {@link https://rooks.vercel.app/docs/useInfiniteScroll}
 *
 * @example
 *
 * const { 
 *   sentinelRef, 
 *   isLoading, 
 *   stopObserving, 
 *   resumeObserving 
 * } = useInfiniteScroll(loadMoreItems);
 *
 * // In your JSX, add the sentinel element at the end of your list
 * <div ref={sentinelRef}>
 *   {isLoading ? "Loading more..." : ""}
 * </div>
 */
function useInfiniteScroll(
    callback: () => void,
    options: IntersectionObserverInit = {}
): InfiniteScrollHandler {
    const [isLoading, setIsLoading] = useState(false);
    const [isObserving, setIsObserving] = useState(true);
    const sentinelRef = useRef<HTMLElement | null>(null);
    const rootRef = useRef<HTMLElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0];
            if (entry && entry.isIntersecting && !isLoading && isObserving) {
                setIsLoading(true);

                // Execute the callback
                Promise.resolve(callback())
                    .catch(error => {
                        console.error("Error in infinite scroll callback:", error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        },
        [callback, isLoading, isObserving]
    );

    // Start observing
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !isObserving) return;

        // Create the intersection observer
        const observerOptions = {
            root: rootRef.current,
            rootMargin: options.rootMargin || "0px",
            threshold: options.threshold || 0
        };

        observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);
        observerRef.current.observe(sentinel);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleIntersection, options.rootMargin, options.threshold, isObserving]);

    // Stop observing
    const stopObserving = useCallback(() => {
        setIsObserving(false);
        if (observerRef.current && sentinelRef.current) {
            observerRef.current.unobserve(sentinelRef.current);
        }
    }, []);

    // Resume observing
    const resumeObserving = useCallback(() => {
        setIsObserving(true);
    }, []);

    return {
        sentinelRef,
        isLoading,
        stopObserving,
        resumeObserving,
        rootRef
    };
}

export { useInfiniteScroll }; 