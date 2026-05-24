import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { noop } from "@/utils/noop";

type ScrollPosition = {
  left: number;
  top: number;
};

type ScrollTarget =
  | RefObject<HTMLElement>
  | HTMLElement
  | (() => HTMLElement)
  | Window
  | Document
  | null;

const defaultScrollPosition: ScrollPosition = { left: 0, top: 0 };

function getScrollPosition(
  element: HTMLElement | Window | Document
): ScrollPosition {
  if (element instanceof Window) {
    return {
      left: element.scrollX ?? element.pageXOffset ?? 0,
      top: element.scrollY ?? element.pageYOffset ?? 0,
    };
  }
  if (element instanceof Document) {
    return {
      left:
        element.documentElement.scrollLeft ??
        element.body.scrollLeft ??
        0,
      top:
        element.documentElement.scrollTop ??
        element.body.scrollTop ??
        0,
    };
  }
  return {
    left: element.scrollLeft,
    top: element.scrollTop,
  };
}

function resolveTarget(
  target: ScrollTarget
): HTMLElement | Window | Document | null {
  if (target === null) return null;
  if (typeof target === "function") return target();
  if ("current" in target) return (target as RefObject<HTMLElement>).current;
  return target as HTMLElement | Window | Document;
}

/**
 * useScroll hook
 *
 * Tracks the scroll position of any scrollable element. For window-level
 * scroll tracking, use useWindowScrollPosition instead.
 *
 * @param {ScrollTarget} target The scrollable element to observe. Accepts a
 * React ref object, a direct DOM element, a getter function returning an
 * element, a Window, a Document, or null.
 * @returns {[ScrollPosition, boolean]} A tuple of [scrollPosition, isScrolling]
 * where scrollPosition contains left and top scroll offsets (defaulting to
 * { left: 0, top: 0 } during SSR), and isScrolling is true while the user is
 * actively scrolling (resets after 100 ms of inactivity).
 * @example
 * import { useRef } from "react";
 * import { useScroll } from "rooks";
 *
 * function App() {
 *   const ref = useRef(null);
 *   const [{ left, top }, isScrolling] = useScroll(ref);
 *   return (
 *     <div ref={ref} style={{ overflow: "auto", height: 200 }}>
 *       <div style={{ height: 1000 }}>
 *         <p>Scroll left: {left}, top: {top}</p>
 *         <p>{isScrolling ? "Scrolling…" : "Idle"}</p>
 *       </div>
 *     </div>
 *   );
 * }
 * @see https://rooks.vercel.app/docs/hooks/useScroll
 */
function useScroll(target: ScrollTarget): [ScrollPosition, boolean] {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(
    defaultScrollPosition
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return noop;

    const element = resolveTarget(target);
    if (!element) return noop;

    // Sync the initial scroll position without waiting for a scroll event
    setScrollPosition(getScrollPosition(element));

    const handleScroll = () => {
      setScrollPosition(getScrollPosition(element));
      setIsScrolling(true);

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        timeoutRef.current = null;
      }, 100);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [target]);

  return [scrollPosition, isScrolling];
}

export { useScroll };
export type { ScrollPosition, ScrollTarget };
