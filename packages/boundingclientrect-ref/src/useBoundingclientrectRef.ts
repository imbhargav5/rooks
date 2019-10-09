import { useState, useEffect, MutableRefObject, useCallback } from "react";
import { useMutationObserver } from "shared/useMutationObserver";
import { useDidMount } from "shared/useDidMount";
import { useMutationObserverRef } from "shared/useMutationObserverRef";
import { HTMLElementOrNull } from "shared/utils";
import { useForkRef } from "shared/useForkRef";

/**
 * useBoundingclientrectRef hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @return ClientRect
 */

function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect();
}

function useBoundingclientrectRef() {
  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);
  const [node, setNode] = useState<HTMLElementOrNull>(null);

  const update = useCallback(() => {
    setValue(node ? getBoundingClientRect(node) : null);
  }, [node]);

  useDidMount(() => {
    update();
  });

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  const [mutationObserverRef] = useMutationObserverRef(update);

  const forkedRef = useForkRef(ref, mutationObserverRef);

  return [forkedRef, value, update];
}

export { useBoundingclientrectRef };
