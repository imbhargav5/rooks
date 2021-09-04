import { useEffect, useRef } from "react";
import { warning } from "./warning";

/**
 *  useDidUpdate hook
 *
 *  Fires a callback on component update
 *  Can take in a list of conditions to fire callback when one of the
 *  conditions changes
 *
 * @param {Function} callback The callback to be called on update
 * @param {Array} conditions The list of variables which trigger update when they are changed
 * @returns {undefined}
 */
function useDidUpdate(
  callback: () => void,
  conditions?: unknown[] | unknown
): void {
  const hasMountedRef = useRef(false);
  const conditionsArray: unknown[] = Array.isArray(conditions)
    ? [callback, ...conditions]
    : [callback, conditions];

  warning(
    Boolean(conditionsArray.length),
    "Using [] as the second argument makes useDidUpdate a noop. The second argument should either be `undefined` or an array of length greater than 0."
  );

  useEffect(() => {
    if (hasMountedRef.current) {
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback();
    } else {
      hasMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, conditionsArray);
}

export { useDidUpdate };
