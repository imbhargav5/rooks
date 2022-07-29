import type { MutableRefObject } from "react";
import { useEffect, useRef, useCallback } from "react";
import { doesIdentifierMatchKeyboardEvent } from "../utils/doesIdentifierMatchKeyboardEvent";
import { noop } from "@/utils/noop";

type TPressedKeyMapping = {
  [key: string]: boolean | undefined;
};

type Options = {
  /**
   * should the event logging be continuous
   */
  continuous?: boolean;
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the document
   */
  target?: MutableRefObject<Document> | MutableRefObject<HTMLElement | null>;
  /**
   * when boolean to enable and disable events, when passed false
   * remove the eventlistener if any
   */
  when?: boolean;
};
/**
 * defaultOptions which will be merged with passed in options
 */
const defaultOptions = {
  continuous: false,
  when: true,
};

/**
 * useKeys hook
 *
 * @param keysList - list of keys to listen to
 * @param callback  - callback to be called when a key is pressed
 * @param options - options to be passed to the event listener
 * @see {@link https://react-hooks.org/docs/useKeys}
 */
function useKeys(
  keysList: string[],
  callback: (event: KeyboardEvent) => void,
  options?: Options
): void {
  const internalOptions = { ...defaultOptions, ...options };
  const { target, when, continuous } = internalOptions;
  const savedCallback = useRef<(event: KeyboardEvent) => void>(callback);
  /**
   * PressedKeyMapping will do the bookkeeping the pressed keys
   */
  const pressedKeyMappingRef = useRef<TPressedKeyMapping>({});
  const PressedKeyMapping: TPressedKeyMapping = pressedKeyMappingRef.current;

  /**
   *  First useEffect is to remember the latest callback
   */
  useEffect(() => {
    savedCallback.current = callback;
  });
  /**
   * handleKeyDown
   *
   * @param   {KeyboardEvent}  event
   * KeyDown event handler which will wrap the passed in callback
   */

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let pressedKeyIdentifier: string | null = null;
      let areAllKeysFromListPressed = false;
      // First detect the key that was pressed;
      for (const identifier of keysList) {
        if (doesIdentifierMatchKeyboardEvent(event, identifier)) {
          PressedKeyMapping[identifier] = true;
          pressedKeyIdentifier = identifier;
        }
      }

      if (
        keysList.every((identifier) => Boolean(PressedKeyMapping[identifier]))
      ) {
        areAllKeysFromListPressed = true;
      }

      if (areAllKeysFromListPressed) {
        savedCallback.current(event);

        /**
         * If not continuous
         * disable identifier immediately
         */
        if (!continuous && pressedKeyIdentifier !== null) {
          PressedKeyMapping[pressedKeyIdentifier] = false;
        }
      }
    },
    [keysList, PressedKeyMapping, continuous]
  );

  /**
   * [handleKeyUp]
   *
   * @param   {KeyboardEvent}  event
   *
   * KeyUp event handler which will update the keys pressed state in PressedKeyMapping
   */
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      for (const identifier of keysList) {
        if (doesIdentifierMatchKeyboardEvent(event, identifier)) {
          PressedKeyMapping[identifier] = undefined;
        }
      }
    },
    [PressedKeyMapping, keysList]
  );

  /**
   * Responsible for setting up the event listener and removing event listeners
   */
  useEffect(() => {
    if (when && typeof window !== "undefined") {
      const targetNode = target?.current ? target.current : document;
      targetNode.addEventListener("keydown", handleKeyDown);
      targetNode.addEventListener("keyup", handleKeyUp);

      return () => {
        targetNode.removeEventListener("keydown", handleKeyDown);
        targetNode.removeEventListener("keyup", handleKeyUp);
      };
    }

    return noop;
  }, [when, target, keysList, handleKeyDown, handleKeyUp]);
}

export { useKeys };
