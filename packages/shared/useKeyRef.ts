import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { doesIdentifierMatchKeyboardEvent } from "./utils/doesIdentifierMatchKeyboardEvent";
import { CallbackRef, HTMLElementOrNull } from "./utils/utils";

interface Options {
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: Array<string | number>;
}

const defaultOptions = {
  when: true,
  eventTypes: ["keydown"]
};

/**
 * useKeyRef hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {[string|number]} keyList
 * @param {function} callback
 * @param {Options} options
 * @return callbackRef
 */
function useKeyRef(
  input: string | number | Array<string | number>,
  callback: (e: KeyboardEvent) => any,
  opts?: Options
): CallbackRef {

  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((targetNode: HTMLElement | null) => {
    setTargetNode(targetNode);
  }, []);


  const keyList: Array<string | number> = useMemo(() => {
    if (Array.isArray(input)) {
      return input;
    } else {
      return [input];
    }
  }, [input]);
  const options = (<any>Object).assign({}, defaultOptions, opts);
  const { when, eventTypes } = options;
  const callbackRef = useRef<(e: KeyboardEvent) => any>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const handle = useCallback(
    (e: KeyboardEvent) => {
      if (
        keyList.some(identifier =>
          doesIdentifierMatchKeyboardEvent(e, identifier)
        )
      ) {
        callbackRef.current(e);
      }
    },
    [keyList]
  );

  useEffect(() => {
    if (when && targetNode) {
      eventTypes.forEach(eventType => {
        targetNode && targetNode.addEventListener(eventType, handle);
      });
      return () => {
        eventTypes.forEach(eventType => {
          targetNode && targetNode.removeEventListener(eventType, handle);
        });
      };
    }
  }, [targetNode, when, eventTypes, keyList, handle]);

  return ref
}


export {useKeyRef};
