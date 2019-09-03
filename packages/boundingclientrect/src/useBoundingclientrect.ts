import { useState, useCallback, MutableRefObject } from "react";
import { useMutationObserver } from "shared/useMutationObserver";
import { useDidMount } from "shared/useDidMount";

/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @return ClientRect
 */
function useBoundingclientrect(ref: MutableRefObject<HTMLElement | null>) {
  const getBoundingClientRect = useCallback(() => {
    if (ref.current) {
      return ref.current.getBoundingClientRect();
    }
    return null;
  }, []);

  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);

  const update = useCallback(() => {
    setValue(getBoundingClientRect());
  }, [setValue, getBoundingClientRect]);

  useDidMount(() => {
    update();
  });

  useMutationObserver(ref, update);

  return value;
}

export { useBoundingclientrect };
