import { useEffect, useRef, MutableRefObject, useCallback } from "react";
import { doesIdentifierMatchKeyboardEvent } from "shared/doesIdentifierMatchKeyboardEvent";

type TPressedKeyMapping = {
  [key: string]: boolean;
};

interface Options {
  /**
   * when boolean to enable and disable events, when passed false
   * remove the eventlistener if any
   */
  when: boolean;
  /**
   * should the event logging be continuous
   */
  continuous: boolean;
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the document
   */
  target?: MutableRefObject<HTMLElement | null> | MutableRefObject<Document>;
}
/**
 * defaultOptions which will be merged with passed in options
 */
const defaultOptions = {
  when: true,
  continuous: false
};

/**
 * useKeys hook
 * @param keysList
 * @param callback
 * @param opts
 */
function useKeys(
  keysList: string[],
  callback: (e: KeyboardEvent) => any,
  opts?: Options
) {
  const options = Object.assign({}, defaultOptions, opts);
  const { target, when, continuous } = options;
  const savedCallback = useRef<(event: KeyboardEvent) => any>(callback);
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
    function handleKeyDown(event: KeyboardEvent) {
      let pressedKeyIdentifier = null;
      let areAllKeysFromListPressed = false;
      // First detect the key that was pressed;
      keysList.forEach(identifier => {
        if (doesIdentifierMatchKeyboardEvent(event, identifier)) {
          PressedKeyMapping[identifier] = true;
          pressedKeyIdentifier = identifier;
          return;
        }
      });
      if (keysList.every(identifier => PressedKeyMapping[identifier])) {
        areAllKeysFromListPressed = true;
      }

      if (areAllKeysFromListPressed) {
        if (savedCallback.current) {
          savedCallback.current(event);
        }
        /**
         * If not continuous
         * disable identifier immediately
         */
        if (!continuous) {
          PressedKeyMapping[pressedKeyIdentifier] = false;
        }
      }
    },
    [keysList, continuous]
  );

  /**
   * [handleKeyUp]
   *
   * @param   {KeyboardEvent}  event
   *
   * KeyUp event handler which will update the keys pressed state in PressedKeyMapping
   */
  const handleKeyUp = useCallback(function handleKeyUp(event: KeyboardEvent) {
    keysList.forEach(identifier => {
      if (doesIdentifierMatchKeyboardEvent(event, identifier)) {
        PressedKeyMapping[identifier] = undefined;
      }
    });
  }, []);

  /**
   * Responsible for setting up the event listener and removing event listeners
   */
  useEffect((): any => {
    if (when && typeof window !== "undefined") {
      let targetNode = target && target.current ? target.current : document;
      if (targetNode) {
        targetNode.addEventListener("keydown", handleKeyDown);
        targetNode.addEventListener("keyup", handleKeyUp);
      }
      return () => {
        if (targetNode)
          targetNode.removeEventListener("keydown", handleKeyDown);
        if (targetNode) targetNode.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [when, target, keysList, handleKeyDown, handleKeyUp]);
}
export { useKeys };
