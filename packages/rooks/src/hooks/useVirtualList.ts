import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useForkRef } from "./useForkRef";
import { useRefElement } from "./useRefElement";
import { useScroll } from "./useScroll";
import { useSize } from "./useSize";

export type VirtualListOrientation = "vertical" | "horizontal";

export type VirtualListItem<TItem> = {
  item: TItem;
  index: number;
  key: string | number;
  start: number;
  size: number;
  end: number;
  style: CSSProperties;
};

export type UseVirtualListOptions<TItem> = {
  items: TItem[];
  itemSize: number;
  overscan?: number;
  orientation?: VirtualListOrientation;
  initialIndex?: number;
  getItemKey?: (item: TItem, index: number) => string | number;
};

function defaultGetItemKey<TItem>(_item: TItem, index: number) {
  return index;
}

export type UseVirtualListReturnValue<TItem> = {
  containerRef: (node: HTMLElement | null) => void;
  innerStyle: CSSProperties;
  items: VirtualListItem<TItem>[];
  totalSize: number;
  startIndex: number;
  endIndex: number;
  scrollOffset: number;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
};

/**
 * useVirtualList
 * @description Fixed-size list virtualization hook for scroll containers.
 * @see {@link https://rooks.vercel.app/docs/hooks/useVirtualList}
 */
function useVirtualList<TItem>(
  options: UseVirtualListOptions<TItem>
): UseVirtualListReturnValue<TItem> {
  const {
    items,
    itemSize,
    overscan = 4,
    orientation = "vertical",
    initialIndex = 0,
    getItemKey = defaultGetItemKey,
  } = options;

  if (!Number.isFinite(itemSize) || itemSize <= 0) {
    throw new RangeError(
      "useVirtualList requires itemSize to be a positive finite number."
    );
  }

  const normalizedOverscan = Number.isFinite(overscan)
    ? Math.max(0, Math.floor(overscan))
    : 0;
  const normalizedInitialIndex = Number.isFinite(initialIndex)
    ? Math.max(0, Math.floor(initialIndex))
    : 0;
  const clampedInitialIndex =
    items.length === 0 ? 0 : Math.min(items.length - 1, normalizedInitialIndex);
  const [elementRef, element] = useRefElement<HTMLElement>();
  const [scrollRef, scrollState] = useScroll();
  const [sizeRef, size] = useSize();

  const containerRef =
    useForkRef(elementRef, useForkRef(scrollRef, sizeRef)) ?? (() => {});
  const isVertical = orientation === "vertical";
  const totalSize = items.length * itemSize;
  const measuredViewportSize = isVertical
    ? size.height || scrollState.clientHeight
    : size.width || scrollState.clientWidth;
  const viewportSize = measuredViewportSize || itemSize;
  const measuredScrollOffset = isVertical
    ? scrollState.scrollTop
    : scrollState.scrollLeft;
  const scrollOffset = measuredViewportSize
    ? measuredScrollOffset
    : clampedInitialIndex * itemSize;
  const visibleCount = Math.max(1, Math.ceil(viewportSize / itemSize));
  const startIndex =
    items.length === 0
      ? 0
      : Math.min(
          items.length - 1,
          Math.max(0, Math.floor(scrollOffset / itemSize))
        );
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount - 1);
  const renderStartIndex = Math.max(0, startIndex - normalizedOverscan);
  const renderEndIndex = Math.min(
    items.length - 1,
    endIndex + normalizedOverscan
  );

  const virtualItems = useMemo(() => {
    const nextItems: VirtualListItem<TItem>[] = [];

    for (let index = renderStartIndex; index <= renderEndIndex; index += 1) {
      const item = items[index]!;
      const start = index * itemSize;
      const end = start + itemSize;
      nextItems.push({
        item,
        index,
        key: getItemKey(item, index),
        start,
        size: itemSize,
        end,
        style: isVertical
          ? {
              position: "absolute",
              top: start,
              left: 0,
              width: "100%",
              height: itemSize,
            }
          : {
              position: "absolute",
              top: 0,
              left: start,
              width: itemSize,
              height: "100%",
            },
      });
    }

    return nextItems;
  }, [
    getItemKey,
    isVertical,
    itemSize,
    items,
    renderEndIndex,
    renderStartIndex,
  ]);

  const scrollToOffset = useCallback(
    (offset: number) => {
      if (!element) {
        return;
      }

      const normalizedOffset = Number.isFinite(offset)
        ? Math.max(0, offset)
        : 0;

      if (isVertical) {
        // Imperative scrolling is the explicit contract of scrollToOffset.
        // eslint-disable-next-line react-hooks/immutability
        element.scrollTop = normalizedOffset;
      } else {
        element.scrollLeft = normalizedOffset;
      }
    },
    [element, isVertical]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const normalizedIndex = Number.isFinite(index) ? Math.floor(index) : 0;
      const clampedIndex =
        items.length === 0
          ? 0
          : Math.max(0, Math.min(items.length - 1, normalizedIndex));
      scrollToOffset(clampedIndex * itemSize);
    },
    [itemSize, items.length, scrollToOffset]
  );

  const innerStyle = isVertical
    ? {
        position: "relative" as const,
        height: totalSize,
        width: "100%",
      }
    : {
        position: "relative" as const,
        width: totalSize,
        height: "100%",
      };

  useEffect(() => {
    if (element) {
      scrollToIndex(normalizedInitialIndex);
    }
  }, [element, normalizedInitialIndex, scrollToIndex]);

  return {
    containerRef,
    innerStyle,
    items: virtualItems,
    totalSize,
    startIndex,
    endIndex,
    scrollOffset,
    scrollToIndex,
    scrollToOffset,
  };
}

export { useVirtualList };
