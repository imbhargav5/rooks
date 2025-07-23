import type { RefObject } from "react";
import { useEffect, useCallback, useRef, useMemo } from "react";
import { doesIdentifierMatchKeyboardEvent } from "../utils/doesIdentifierMatchKeyboardEvent";
import { noop } from "@/utils/noop";

type TrackedKeyEvents = "keydown" | "keypress" | "keyup";

type Options = {
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: TrackedKeyEvents[];
  /**
   * target mutable ref on which the events should be listened. Doesn't work with callback refs.
   * Please use useKeyRef instead if you want to use with callback refs.
   * If no target is specified, events are listened to on the window. Defaults to window.
   */
  target?: RefObject<HTMLElement>;
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
};

type Callback = (event: KeyboardEvent) => void;

const defaultOptions = {
  eventTypes: ["keydown"],
  when: true,
};

/**
 * useKey hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {TrackedKeyEvents} keys List of keys to listen for. Eg: ["a", "b"]
 * @param {Callback} callback  Callback to fire on keyboard events
 * @param {Options} options Options
 * @see https://rooks.vercel.app/docs/hooks/useKey
 */
function useKey(
  keys: Array<number | string> | number | string,
  callback: (event: KeyboardEvent) => void,
  options?: Options
): void {
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
  const { target } = internalOptions;

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
    if (when && typeof window !== "undefined") {
      // If target is defined by the user
      if (target) {
        const targetNode = target.current;
        if (targetNode) {
          for (const eventType of eventTypes) {
            targetNode.addEventListener(eventType, handle as EventListener);
          }

          return () => {
            for (const eventType of eventTypes) {
              targetNode.removeEventListener(eventType, handle as EventListener);
            }
          };
        }
      } else {
        for (const eventType of eventTypes) {
          window.addEventListener(eventType, handle as EventListener);
        }

        return () => {
          for (const eventType of eventTypes) {
            window.removeEventListener(eventType, handle as EventListener);
          }
        };
      }
    }

    return noop;
  }, [when, eventTypes, keyList, target, callback, handle]);
}

export { useKey };
