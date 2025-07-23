/**
 * useOnLongPress
 * @description Fire a callback on long press
 * @see {@link https://rooks.vercel.app/docs/hooks/useOnLongPress}
 */
import { HTMLElementOrNull } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { useFreshCallback } from "./useFreshCallback";
import { useTimeoutWhen } from "./useTimeoutWhen";

interface LongPressOptions {
  onClick?: (e: MouseEvent | TouchEvent) => void;
  duration?: number;
}

const defaultOnClick = () => {};

const useOnLongPress = (
  callback: () => void,
  { onClick, duration = 300 }: LongPressOptions = {}
) => {
  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);
  const [isPressing, setIsPressing] = useState(false);
  const freshCallback = useFreshCallback(callback);
  const freshClick = useFreshCallback(onClick ?? defaultOnClick);
  useTimeoutWhen(freshCallback, duration, isPressing);

  const start = useCallback((_: MouseEvent | TouchEvent) => {
    setIsPressing(true);
  }, []);

  const handleOnClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      setIsPressing(false);
      freshClick(event);
    },
    [freshClick]
  );

  useEffect(() => {
    if (targetNode) {
      targetNode.addEventListener("mousedown", start);
      targetNode.addEventListener("mouseup", handleOnClick);
      targetNode.addEventListener("mouseleave", handleOnClick);
      targetNode.addEventListener("touchstart", start);
      targetNode.addEventListener("touchend", handleOnClick);
      targetNode.addEventListener("touchcancel", handleOnClick);
    }

    return () => {
      if (targetNode) {
        targetNode.removeEventListener("mousedown", start);
        targetNode.removeEventListener("mouseup", handleOnClick);
        targetNode.removeEventListener("mouseleave", handleOnClick);
        targetNode.removeEventListener("touchstart", start);
        targetNode.removeEventListener("touchend", handleOnClick);
        targetNode.removeEventListener("touchcancel", handleOnClick);
      }
    };
  }, [start, handleOnClick, targetNode]);

  // clone ref
  return ref;
};

export { useOnLongPress };
