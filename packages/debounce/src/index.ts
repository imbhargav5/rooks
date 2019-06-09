import { useRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

function useDebounce(callback: () => any, wait: number) {
  function createDebouncedCallback(fn) {
    return debounce(fn, wait);
  }

  const callbackRef = useRef(callback);
  const debouncedCallbackRef = useRef(createDebouncedCallback(callback));

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    debouncedCallbackRef.current = createDebouncedCallback(() => {
      callbackRef.current();
    });
  }, [wait]);

  return debouncedCallbackRef.current;
}

export { useDebounce as default };
