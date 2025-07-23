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
  target?:
  | MutableRefObject<Document>
  | MutableRefObject<HTMLElement | null | undefined>;
  /**
   * when boolean to enable and disable events, when passed false
   * remove the eventlistener if any
   */
  when?: boolean;
  /**
   * opt-in to prevent alert, confirm and prompt from causing the eventlistener to lose track of keyup events.
   */
  preventLostKeyup?: boolean;
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
 * @see https://rooks.vercel.app/docs/hooks/useKeys
 */
function useKeys(
  keysList: string[],
  callback: (event: KeyboardEvent) => void,
  options?: Options
): void {
  const internalOptions = { ...defaultOptions, ...options };
  const { target, when, continuous, preventLostKeyup } = internalOptions;
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
      targetNode.addEventListener("keydown", handleKeyDown as EventListener);
      targetNode.addEventListener("keyup", handleKeyUp as EventListener);

      return () => {
        targetNode.removeEventListener("keydown", handleKeyDown as EventListener);
        targetNode.removeEventListener("keyup", handleKeyUp as EventListener);
      };
    }

    return noop;
  }, [when, target, keysList, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (preventLostKeyup !== true) return noop;
    if (typeof window !== "undefined") {
      const originalAlert = window.alert;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.alert = (message?: any) => {
        for (const identifier of keysList) {
          PressedKeyMapping[identifier] = undefined;
        }
        return originalAlert(message);
      };

      const originalConfirm = window.confirm;
      window.confirm = (message?: string | undefined) => {
        for (const identifier of keysList) {
          PressedKeyMapping[identifier] = undefined;
        }
        return originalConfirm(message);
      };

      const originalPrompt = window.prompt;
      window.prompt = (
        message?: string | undefined,
        _default?: string | undefined
      ) => {
        for (const identifier of keysList) {
          PressedKeyMapping[identifier] = undefined;
        }
        return originalPrompt(message, _default);
      };

      return () => {
        window.alert = originalAlert;
        window.confirm = originalConfirm;
        window.prompt = originalPrompt;
      };
    }
    return noop;
  }, [PressedKeyMapping, keysList, preventLostKeyup]);
}

export { useKeys };
