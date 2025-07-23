
import type { RefObject } from "react";
import { useKey } from "./useKey";

type TrackedKeyEvents = "keydown" | "keypress" | "keyup";

type Options = {
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: TrackedKeyEvents[];
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the window. Only works with object refs. If you want to use with callback refs,
   * please use useKeyRef instead.
   */
  target?: RefObject<HTMLElement>;
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
};

type KeyBindings = { [key: string]: (event: KeyboardEvent) => void };

/**
 * useKeyBindings
 *
 * useKeyBindings binds pairs of keyboard events and handlers
 *
 * @param { KeyBindings } keyBindings
 * @param {Options} options
 * @see https://rooks.vercel.app/docs/hooks/useKeyBindings
 */
const useKeyBindings = (keyBindings: KeyBindings, options?: Options) => {
  for (const key in keyBindings) {

    const handler = keyBindings[key];
    if (handler) {
      useKey(key, handler, options);
    }
  }
};

export { useKeyBindings };
