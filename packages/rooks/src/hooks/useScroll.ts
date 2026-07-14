import { useEffect, useMemo, useRef, useState } from "react";
import { noop } from "@/utils/noop";
import type { CallbackRef, HTMLElementOrNull } from "@/utils/utils";
import { useFreshRef } from "./useFreshRef";
import { useRefElement } from "./useRefElement";

export type ScrollState = {
  scrollLeft: number;
  scrollTop: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
};

export type UseScrollOptions = {
  throttleMs?: number;
  disabled?: boolean;
  onScroll?: (state: ScrollState) => void;
};

const defaultScrollState: ScrollState = {
  scrollLeft: 0,
  scrollTop: 0,
  clientWidth: 0,
  clientHeight: 0,
  scrollWidth: 0,
  scrollHeight: 0,
};

function readScrollState(node: HTMLElement): ScrollState {
  return {
    scrollLeft: node.scrollLeft,
    scrollTop: node.scrollTop,
    clientWidth: node.clientWidth,
    clientHeight: node.clientHeight,
    scrollWidth: node.scrollWidth,
    scrollHeight: node.scrollHeight,
  };
}

/**
 * useScroll
 * @description Tracks an element's scroll position and scrollable bounds.
 * @see {@link https://rooks.vercel.app/docs/hooks/useScroll}
 */
function useScroll(options: UseScrollOptions = {}): [CallbackRef, ScrollState] {
  const { throttleMs = 0, disabled = false, onScroll } = options;
  const [ref, node] = useRefElement<HTMLElement>();
  const [scrollState, setScrollState] =
    useState<ScrollState>(defaultScrollState);
  const scrollStateRef = useRef(scrollState);
  const timeoutRef = useRef<number | null>(null);
  const lastRunRef = useRef<number | null>(null);
  const onScrollRef = useFreshRef(onScroll, true);

  const updateScrollState = useMemo(
    () => () => {
      if (!node || disabled) {
        return;
      }

      const nextState = readScrollState(node);
      const unchanged = (
        Object.keys(nextState) as Array<keyof ScrollState>
      ).every((key) => scrollStateRef.current[key] === nextState[key]);

      if (unchanged) {
        return;
      }

      scrollStateRef.current = nextState;
      setScrollState(nextState);
      onScrollRef.current?.(nextState);
    },
    [disabled, node, onScrollRef]
  );

  const scheduleUpdate = useMemo(() => {
    if (throttleMs <= 0) {
      return updateScrollState;
    }

    return () => {
      const now = Date.now();
      const elapsed =
        lastRunRef.current === null
          ? Number.POSITIVE_INFINITY
          : now - lastRunRef.current;
      const remaining = throttleMs - elapsed;

      if (remaining <= 0) {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        lastRunRef.current = now;
        updateScrollState();
        return;
      }

      if (timeoutRef.current === null) {
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;
          lastRunRef.current = Date.now();
          updateScrollState();
        }, remaining);
      }
    };
  }, [throttleMs, updateScrollState]);

  useEffect(() => {
    if (disabled || !node) {
      scrollStateRef.current = defaultScrollState;
      // Reset the snapshot when its external observation source is detached.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrollState(defaultScrollState);
      return noop;
    }

    const handleScroll = () => {
      scheduleUpdate();
    };

    node.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            scheduleUpdate();
          })
        : null;
    resizeObserver?.observe(node);
    for (const descendant of node.querySelectorAll("*")) {
      resizeObserver?.observe(descendant);
    }

    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver((records) => {
            for (const record of records) {
              for (const addedNode of record.addedNodes) {
                if (addedNode instanceof Element) {
                  resizeObserver?.observe(addedNode);
                  for (const descendant of addedNode.querySelectorAll("*")) {
                    resizeObserver?.observe(descendant);
                  }
                }
              }
            }
            scheduleUpdate();
          })
        : null;
    mutationObserver?.observe(node, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    node.addEventListener("load", handleScroll, true);
    document.fonts?.addEventListener("loadingdone", handleScroll);

    scheduleUpdate();

    return () => {
      node.removeEventListener("scroll", handleScroll);
      node.removeEventListener("load", handleScroll, true);
      document.fonts?.removeEventListener("loadingdone", handleScroll);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastRunRef.current = null;
    };
  }, [disabled, node, scheduleUpdate]);

  return [ref as (node: HTMLElementOrNull) => void, scrollState];
}

export { useScroll };
export type { ScrollState as UseScrollReturnValue };
