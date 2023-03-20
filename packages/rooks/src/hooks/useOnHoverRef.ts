import { noop } from "@/utils/noop";
import { useState, useEffect, RefCallback, useCallback } from "react";
import { useFreshCallback } from "./useFreshCallback";

type MouseEventHandler = (event: MouseEvent) => void;

function useOnHoverRef(
  onMouseEnter?: MouseEventHandler,
  onMouseLeave?: MouseEventHandler
): RefCallback<HTMLElement> {
  const [node, setNode] = useState<HTMLElement | null>(null);

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      onMouseEnter?.(e);
    },
    [onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  const mouseEnterCallback = useFreshCallback(handleMouseEnter);
  const mouseLeaveCallback = useFreshCallback(handleMouseLeave);
  useEffect(() => {
    if (node) {
      node.addEventListener("mouseenter", mouseEnterCallback);
      node.addEventListener("mouseleave", mouseLeaveCallback);

      return () => {
        node.removeEventListener("mouseenter", mouseEnterCallback);
        node.removeEventListener("mouseleave", mouseLeaveCallback);
      };
    } else {
      return noop;
    }
  }, [mouseEnterCallback, mouseLeaveCallback, node]);

  const ref: RefCallback<HTMLElement> = (el) => {
    setNode(el);
  };

  return ref;
}

export { useOnHoverRef };
