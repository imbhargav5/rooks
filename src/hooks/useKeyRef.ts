import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { doesIdentifierMatchKeyboardEvent } from '../utils/doesIdentifierMatchKeyboardEvent';
import type { CallbackRef, HTMLElementOrNull } from '../utils/utils';

type Options = {
  /**
   * Condition which if true, will enable the event listeners
   */
  when?: boolean;
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes?: Array<number | string>;
};

const defaultOptions = {
  eventTypes: ['keydown'],
  when: true,
};

/**
 * useKeyRef hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {[string|number]} keyList
 * @param {Function} callback
 * @param {Options} options
 * @returns callbackRef
 */
function useKeyRef(
  input: Array<number | string> | number | string,
  callback: (e: KeyboardEvent) => any,
  options_?: Options
): CallbackRef {
  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((targetNode: HTMLElement | null) => {
    setTargetNode(targetNode);
  }, []);

  const keyList: Array<number | string> = useMemo(() => {
    if (Array.isArray(input)) {
      return input;
    } else {
      return [input];
    }
  }, [input]);
  const options = (<any>Object).assign({}, defaultOptions, options_);
  const { when, eventTypes } = options;
  const callbackRef = useRef<(e: KeyboardEvent) => any>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const handle = useCallback(
    (e: KeyboardEvent) => {
      if (
        keyList.some((identifier) =>
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
      eventTypes.forEach((eventType) => {
        targetNode && targetNode.addEventListener(eventType, handle);
      });

      return () => {
        eventTypes.forEach((eventType) => {
          targetNode && targetNode.removeEventListener(eventType, handle);
        });
      };
    }
  }, [targetNode, when, eventTypes, keyList, handle]);

  return ref;
}

export { useKeyRef };
