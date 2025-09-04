import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { doesIdentifierMatchKeyboardEvent } from "../utils/doesIdentifierMatchKeyboardEvent";
import type { CallbackRef, HTMLElementOrNull } from "../utils/utils";
import { noop } from "@/utils/noop";

type TrackedKeyEvents = "keydown" | "keypress" | "keyup";
type Callback = (event: KeyboardEvent) => void;

type Options = {
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: TrackedKeyEvents[];
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
};

const defaultOptions: Required<Options> = {
  eventTypes: ["keydown"],
  when: true,
};

/**
 * useKeyRef hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {[string|number]} keys List of keys to listen for. Eg: ["a", "b"]
 * @param {Function} callback Callback to fire on keyboard events
 * @param {Options} options Options
 * @returns {CallbackRef} CallbackRef
 * @see https://rooks.vercel.app/docs/hooks/useKeyRef
 */
function useKeyRef(
  keys: Array<number | string> | number | string,
  callback: Callback,
  options?: Options
): CallbackRef {
  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);

  const keyList: Array<number | string> = useMemo(() => {
    if (Array.isArray(keys)) {
      return keys;
    } else {
      return [keys];
    }
  }, [keys]);
  const internalOptions = useMemo(() => {
    return { ...defaultOptions, ...options };
  }, [options]);
  const { when, eventTypes } = internalOptions;
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const handle = useCallback(
    (event: KeyboardEvent) => {
      if (
        keyList.some((identifier) =>
          doesIdentifierMatchKeyboardEvent(event, identifier)
        )
      ) {
        callbackRef.current(event);
      }
    },
    [keyList]
  );

  useEffect(() => {
    if (when && targetNode) {
      for (const eventType of eventTypes) {
         
        targetNode.addEventListener(eventType, handle);
      }

      return () => {
        for (const eventType of eventTypes) {
          targetNode.removeEventListener(eventType, handle);
        }
      };
    }

    return noop;
  }, [targetNode, when, eventTypes, keyList, handle]);

  return ref;
}

export { useKeyRef };
