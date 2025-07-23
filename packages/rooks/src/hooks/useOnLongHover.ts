/**
 * useOnLongHover
 * @description Fires a callback when an element is hovered for a while
 * @see {@link https://rooks.vercel.app/docs/hooks/useOnLongHover}
 */
import { HTMLElementOrNull } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { useFreshCallback } from "./useFreshCallback";
import { useTimeoutWhen } from "./useTimeoutWhen";

interface LongHoverOptions {
  duration?: number;
}

const useOnLongHover = (
  callback: () => void,
  { duration = 300 }: LongHoverOptions = {}
) => {
  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);
  const [isHovering, setIsHovering] = useState(false);
  const freshCallback = useFreshCallback(callback);
  useTimeoutWhen(
    () => {
      freshCallback();
    },
    duration,
    isHovering
  );

  const start = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleOnMouseLeave = useCallback((_: MouseEvent) => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    if (targetNode) {
      targetNode.addEventListener("mouseenter", start);
      targetNode.addEventListener("mouseleave", handleOnMouseLeave);
    }

    return () => {
      if (targetNode) {
        targetNode.removeEventListener("mouseenter", start);
        targetNode.removeEventListener("mouseleave", handleOnMouseLeave);
      }
    };
  }, [start, handleOnMouseLeave, targetNode]);

  return ref;
};

export { useOnLongHover };
