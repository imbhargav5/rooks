import type { MutableRefObject } from "react";
import { useState, useCallback } from "react";
import { useDidMount } from "./useDidMount";
import { useMutationObserver } from "./useMutationObserver";

/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns DOMRect
 */
function getBoundingClientRect(element: HTMLElement): DOMRect | null {
  return element.getBoundingClientRect();
}

/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @returns DOMRect | null
 * @see https://rooks.vercel.app/docs/hooks/useBoundingclientRect
 */
function useBoundingclientrect(
  ref: MutableRefObject<HTMLElement | null>
): DOMRect | null {
  const [domRect, setDomRect] = useState<DOMRect | null>(null);

  const update = useCallback(() => {
    setDomRect(ref.current ? getBoundingClientRect(ref.current) : null);
  }, [ref]);

  useDidMount(() => {
    update();
  });

  useMutationObserver(ref, update);

  return domRect;
}

export { useBoundingclientrect };
