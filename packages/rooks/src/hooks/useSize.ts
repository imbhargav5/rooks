import { useCallback, useEffect, useRef, useState } from "react";
import { noop } from "@/utils/noop";
import type { CallbackRef, HTMLElementOrNull } from "@/utils/utils";
import { useFreshRef } from "./useFreshRef";
import { useRefElement } from "./useRefElement";

export type Size = {
  width: number;
  height: number;
};

export type UseSizeOptions = {
  box?: ResizeObserverBoxOptions;
  debounce?: number;
  disabled?: boolean;
  onChange?: (size: Size) => void;
};

const defaultSize: Size = {
  width: 0,
  height: 0,
};

function readFallbackContentSize(node: HTMLElement): Size {
  const styles =
    typeof getComputedStyle === "function" ? getComputedStyle(node) : null;
  const toPixels = (value: string | undefined) =>
    Number.parseFloat(value ?? "0") || 0;
  const horizontalPadding =
    toPixels(styles?.paddingLeft) + toPixels(styles?.paddingRight);
  const verticalPadding =
    toPixels(styles?.paddingTop) + toPixels(styles?.paddingBottom);

  return {
    width: Math.max(0, node.clientWidth - horizontalPadding),
    height: Math.max(0, node.clientHeight - verticalPadding),
  };
}

function readBoxSize(
  sizes: ReadonlyArray<ResizeObserverSize> | undefined,
  node: HTMLElement
): Size | null {
  const size = Array.isArray(sizes)
    ? sizes[0]
    : (sizes as unknown as ResizeObserverSize | undefined);
  if (!size) {
    return null;
  }

  const writingMode =
    typeof getComputedStyle === "function"
      ? getComputedStyle(node).writingMode
      : "";
  const isVerticalWritingMode = writingMode.startsWith("vertical");

  return {
    width: isVerticalWritingMode ? size.blockSize : size.inlineSize,
    height: isVerticalWritingMode ? size.inlineSize : size.blockSize,
  };
}

function readSize(
  node: HTMLElement,
  box: ResizeObserverBoxOptions,
  entry?: ResizeObserverEntry
): Size {
  if (box === "border-box") {
    const observedSize = readBoxSize(entry?.borderBoxSize, node);
    if (observedSize) {
      return observedSize;
    }

    return {
      width: node.offsetWidth,
      height: node.offsetHeight,
    };
  }

  if (box === "device-pixel-content-box") {
    const observedSize = readBoxSize(entry?.devicePixelContentBoxSize, node);
    if (observedSize) {
      return observedSize;
    }

    const contentSize = entry
      ? { width: entry.contentRect.width, height: entry.contentRect.height }
      : readFallbackContentSize(node);
    const pixelRatio =
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return {
      width: contentSize.width * pixelRatio,
      height: contentSize.height * pixelRatio,
    };
  }

  const observedSize = readBoxSize(entry?.contentBoxSize, node);
  if (observedSize) {
    return observedSize;
  }
  if (entry) {
    return {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    };
  }

  return readFallbackContentSize(node);
}

/**
 * useSize
 * @description Tracks the width and height of an element using ResizeObserver.
 * @see {@link https://rooks.vercel.app/docs/hooks/useSize}
 */
function useSize(options: UseSizeOptions = {}): [CallbackRef, Size] {
  const {
    box = "content-box",
    debounce = 0,
    disabled = false,
    onChange,
  } = options;
  const [ref, node] = useRefElement<HTMLElement>();
  const [size, setSize] = useState<Size>(defaultSize);
  const sizeRef = useRef(size);
  const timeoutRef = useRef<number | null>(null);
  const pendingEntryRef = useRef<ResizeObserverEntry | undefined>(undefined);
  const onChangeRef = useFreshRef(onChange, true);

  const updateSize = useCallback(
    (entry?: ResizeObserverEntry) => {
      if (!node || disabled) {
        return;
      }

      const nextSize = readSize(node, box, entry);
      const currentSize = sizeRef.current;
      if (
        currentSize.width === nextSize.width &&
        currentSize.height === nextSize.height
      ) {
        return;
      }

      sizeRef.current = nextSize;
      setSize(nextSize);
      onChangeRef.current?.(nextSize);
    },
    [box, disabled, node, onChangeRef]
  );

  const scheduleMeasurement = useCallback(
    (entry?: ResizeObserverEntry) => {
      pendingEntryRef.current = entry;
      if (debounce <= 0) {
        updateSize(entry);
        return;
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        updateSize(pendingEntryRef.current);
      }, debounce);
    },
    [debounce, updateSize]
  );

  useEffect(() => {
    if (disabled || !node) {
      sizeRef.current = defaultSize;
      // Reset the snapshot when its external observation source is detached.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSize(defaultSize);
      return noop;
    }

    if (typeof ResizeObserver === "undefined") {
      scheduleMeasurement();
      return () => {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }

    const observer = new ResizeObserver((entries) => {
      scheduleMeasurement(entries.find((entry) => entry.target === node));
    });

    try {
      observer.observe(node, { box });
    } catch {
      observer.observe(node);
    }
    scheduleMeasurement();

    return () => {
      observer.disconnect();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [box, disabled, node, scheduleMeasurement]);

  return [ref as (node: HTMLElementOrNull) => void, size];
}

export { useSize };
export type { Size as UseSizeReturnValue };
