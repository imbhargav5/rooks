import type { MutableRefObject } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useDidMount } from './useDidMount';
import { useMutationObserver } from './useMutationObserver';

/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns ClientRect
 */
function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect();
}

/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @returns ClientRect
 */
function useBoundingclientrect(
  ref: MutableRefObject<HTMLElement | null>
): ClientRect | DOMRect | null {
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
