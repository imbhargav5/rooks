import { useState, useEffect, MutableRefObject, useCallback } from "react";
import { useMutationObserver } from "shared/useMutationObserver";
import { useDidMount } from "shared/useDidMount";

/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @return ClientRect
 */

function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect();
}

function useBoundingclientrect(ref: MutableRefObject<HTMLElement | null>) {
  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);

  const update = useCallback(() => {
    setValue(ref.current ? getBoundingClientRect(ref.current) : null);
  }, []);

  useDidMount(() => {
    update();
  });

  useMutationObserver(ref, update);

  return value;
}

export { useBoundingclientrect };
