import { useState, useLayoutEffect } from "react";

const defaultOptions = {
  when: true,
  eventTypes: ["keypress"]
};

function useKey(keyList = [], handler, opts) {
  const options = Object.assign({}, defaultOptions, opts);
  const { when, eventTypes } = options;
  let { target } = options;
  function handle(e) {
    if (keyList.includes(e.key) || keyList.includes(e.keyCode)) {
      handler(e);
    }
  }
  let targetNode = window;
  if (target && target.current) {
    targetNode = target.current;
  }
  useLayoutEffect(
    () => {
      if (when) {
        eventTypes.forEach(eventType => {
          targetNode.addEventListener(eventType, handle);
        });
        return () => {
          eventTypes.forEach(eventType => {
            targetNode.removeEventListener(eventType, handle);
          });
        };
      }
    },
    [when, eventTypes, keyList, targetNode, handler]
  );
}

module.exports = useKey;
