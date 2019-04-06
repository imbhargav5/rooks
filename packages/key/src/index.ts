import { useLayoutEffect, Ref } from "react";

interface Options {
  /**
   * Condition which if true, will enable the event listeners
   */
  when: boolean;
  /**
   * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
   */
  eventTypes: Array<string | number>;
  /**
   * target ref on which the events should be listened. If no target is specified,
   * events are listened to on the window
   */
  target?: Ref<HTMLElement>;
}

const defaultOptions = {
  when: true,
  eventTypes: ["keydown"]
};

/**
 * useKey hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {[string|number]} keyList
 * @param {function} callback
 * @param {Options} options
 */
function useKey(
  keyList: Array<string | number>,
  callback: (e: KeyboardEvent) => any,
  opts?: Options
): void {
  const options = (<any>Object).assign({}, defaultOptions, opts);
  const { when, eventTypes } = options;
  let { target } = options;

  function handle(e: KeyboardEvent) {
    if (keyList.includes(e.key) || keyList.includes(e.keyCode)) {
      callback(e);
    }
  }

  let targetNode: HTMLElement | Window | undefined;
  if (typeof window !== "undefined") {
    targetNode = window;
  }
  if (target && target.current) {
    targetNode = target.current;
  }
  useLayoutEffect(() => {
    if (when) {
      eventTypes.forEach(eventType => {
        targetNode && targetNode.addEventListener(eventType, handle);
      });
      return () => {
        eventTypes.forEach(eventType => {
          targetNode && targetNode.removeEventListener(eventType, handle);
        });
      };
    }
  }, [when, eventTypes, keyList, targetNode, callback]);
}

export default useKey;
