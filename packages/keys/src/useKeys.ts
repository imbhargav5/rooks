import { useEffect, useRef, Ref, MutableRefObject } from "react";

/**
 *  An IIFE which assign code {event.code} to actual key values
 *  This will avoid the need to do rigorous check on the hook side
 *  avoiding checks e.g ctrl left vs ctrl right, alt left vs alt right
 *  {"0":"Digit0","1":"Digit1","2":"Digit2","3":"Digit3","4":"Digit4","5":"Digit5","6":"Digit6","7":"Digit7","8":"Digit8","9":"Digit9","A":"KeyA","B":"KeyB","C":"KeyC","D":"KeyD","E":"KeyE","F":"KeyF","G":"KeyG","H":"KeyH","I":"KeyI","J":"KeyJ","K":"KeyK","L":"KeyL","M":"KeyM","N":"KeyN","O":"KeyO","P":"KeyP","Q":"KeyQ","R":"KeyR","S":"KeyS","T":"KeyT","U":"KeyU","V":"KeyV","W":"KeyW","X":"KeyX","Y":"KeyY","Z":"KeyZ"}"
 */
const alphabetAndNumberMap = (() => {
  /**
   *  startLetter: ASCII code for A
   *  endLetter: ASCII code for Z
   *  startNumber : ASCII code for 0
   *  endNumber: ASCII code for 9
   */

  let startLetter = 65;
  let endLetter = 90;
  let startNumber = 48;
  let endNumber = 57;

  const mapletterToCodes = {};
  /**
   * mapping character to event.code.
   * refer https://keycode.info/ for event.code semantic for character and number
   */
  while (startLetter <= endLetter) {
    const letter = String.fromCharCode(startLetter);
    mapletterToCodes[
      String.fromCharCode(startLetter)
    ] = `Key${letter.toUpperCase()}`;
    startLetter++;
  }

  /**
   * mapping number to event.code.
   */
  while (startNumber <= endNumber) {
    const number = String.fromCharCode(startNumber);
    mapletterToCodes[String.fromCharCode(startNumber)] = `Digit${number}`;
    startNumber++;
  }
  return mapletterToCodes;
})();

type TPressedKeyMapping = {
  [key: string]: boolean;
};
/**
 * PressedKeyMapping will do the bookkeeping the pressed keys
 */
const PressedKeyMapping: TPressedKeyMapping = {};

/**
 *  checkWhetherRequiredKeyPressed
 *  Helper function
 *
 *  Checks whether the keys in the keyList are all presses
 */
function checkWhetherRequiredKeyPressed(
  keysList: string[],
  PressedKeyMapping: TPressedKeyMapping
) {
  return keysList.every((elem: string) => {
    return (
      PressedKeyMapping[elem] ||
      PressedKeyMapping[alphabetAndNumberMap[elem.toUpperCase()]]
    );
  });
}

interface Options {
  /**
   * when boolean to enable and disable events, when passed false
   * remove the eventlistener if any
   */
  when: boolean;
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the document
   */
  target?: MutableRefObject<HTMLElement>;
}
/**
 * defaultOptions which will be merged with passed in options
 */
const defaultOptions = {
  when: true
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
  const { target, when } = options;
  const savedCallback = useRef<(event: KeyboardEvent) => any>();
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
  function handleKeyDown(event: KeyboardEvent) {
    const { code } = event;
    PressedKeyMapping[code] = true;
    if (checkWhetherRequiredKeyPressed(keysList, PressedKeyMapping)) {
      if (savedCallback.current) {
        savedCallback.current(event);
      }

      keysList.forEach((keys: string) => {
        PressedKeyMapping[keys] = false;
        PressedKeyMapping[alphabetAndNumberMap[keys]] = false;
      });
    }
  }

  /**
   * [handleKeyUp]
   *
   * @param   {KeyboardEvent}  event
   *
   * KeyUp event handler which will update the keys pressed state in PressedKeyMapping
   */
  function handleKeyUp(event: KeyboardEvent) {
    const { code } = event;
    PressedKeyMapping[code] = false;
  }
  /**
   * Responsible for setting up the event listener and removing event listeners
   */
  useEffect((): any => {
    if (when && typeof window !== "undefined") {
      if (!target) return;

      let targetNode = target ? target.current : document;
      targetNode.addEventListener("keydown", handleKeyDown);
      targetNode.addEventListener("keyup", handleKeyUp);

      return () => {
        if (targetNode)
          targetNode.removeEventListener("keydown", handleKeyDown);
        if (targetNode) targetNode.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [when, target, keysList, callback]);
}
export { useKeys };
