import { useState, useEffect, useCallback } from 'react';
import type { CallbackRef, HTMLElementOrNull } from '../utils/utils';
import { useForkRef } from './useForkRef';
import { useMutationObserverRef } from './useMutationObserverRef';

/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns ClientRect
 */
function getBoundingClientRect(element: HTMLElement): ClientRect | DOMRect {
  return element.getBoundingClientRect();
}

/**
 * useBoundingclientrectRef hook
 *
 * @returns [CallbackRef | null, ClientRect | DOMRect | null, () => void]
 */
function useBoundingclientrectRef(): [
  CallbackRef | null,
  ClientRect | DOMRect | null,
  () => void
] {
  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);
  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const update = useCallback(() => {
    setValue(node ? getBoundingClientRect(node) : null);
  }, [node]);

  useEffect(() => {
    update();
  }, [node]);

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  const [mutationObserverRef] = useMutationObserverRef(update);

  const forkedRef = useForkRef(ref, mutationObserverRef);

  return [forkedRef, value, update];
}

export { useBoundingclientrectRef };
