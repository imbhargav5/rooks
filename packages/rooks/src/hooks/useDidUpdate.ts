import { useEffect, useMemo, useRef } from "react";
import { useDidMount } from "./useDidMount";
import { useWillUnmount } from "./useWillUnmount";

/**
 *  useDidUpdate hook
 *
 *  Fires a callback on component update
 *  Can take in a list of conditions to fire callback when one of the
 *  conditions changes
 *
 * @param {Function} callback The callback to be called on update
 * @param {Array} conditions The list of variables which trigger update when they are changed
 * @see https://rooks.vercel.app/docs/hooks/useDidUpdate
 */
function useDidUpdate(callback: () => void, conditions?: unknown[]): void {
  const hasMountedRef = useRef<boolean>(false);
  const internalConditions = useMemo(() => {
    if (typeof conditions !== "undefined" && !Array.isArray(conditions)) {
      return [conditions];
    } else if (Array.isArray(conditions) && conditions.length === 0) {
      console.warn(
        "Using [] as the second argument makes useDidUpdate a noop. The second argument should either be `undefined` or an array of length greater than 0."
      );
    }

    return conditions;
  }, [conditions]);

  useEffect(() => {
    if (hasMountedRef.current) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, internalConditions);

  useDidMount(() => {
    hasMountedRef.current = true;
  });

  useWillUnmount(() => {
    hasMountedRef.current = false;
  });
}

export { useDidUpdate };
