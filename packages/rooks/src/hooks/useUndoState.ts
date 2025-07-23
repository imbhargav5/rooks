import { useCallback, useMemo, useState } from "react";
import type {
  UseUndoStateOptions,
  UseUndoStatePushFunction,
  UseUndoStateReturnValue,
} from "@/types/types";
import type { ExcludeFunction } from "@/types/utils";

const defaultOptions: UseUndoStateOptions = { maxSize: 100 };

/**
 * useUndoState hook
 * Drop in replacement for useState hook but with undo functionality.
 *
 * @typedef UndoStateOptions
 * @type {object}
 * @property {number} maxSize - Maximum number of states to keep in the undo stack.
 * @param {any} defaultValue - Default value to use for the state. This will be the first value in the undo stack.
 * @param {UseUndoStateOptions} options - Options for the undo state. Currently takes the maxSize option.
 * @returns {UseUndoStateReturnValue}
 * @see https://rooks.vercel.app/docs/hooks/useUndoState
 */
const useUndoState = <T>(
  defaultValue: ExcludeFunction<T>,
  options?: UseUndoStateOptions
): UseUndoStateReturnValue<T> => {
  const { maxSize } = useMemo(() => {
    return { ...defaultOptions, ...options };
  }, [options]);

  const [value, setValue] = useState<Array<ExcludeFunction<T>>>([defaultValue]);

  const push: UseUndoStatePushFunction<ExcludeFunction<T>> = useCallback(
    (argument) => {
      return setValue((current) => {
        const restValues =
          current.length >= maxSize ? current.slice(0, maxSize) : current;

        if (typeof argument === "function") {
          // I dislike this type assertion, but it's the only way to get the type to match
          // as the type guard doesn't seem to be working here.
          // eslint-disable-next-line @typescript-eslint/ban-types
          return [(argument as Function)(current[0]), ...restValues];
        } else {
          return [argument, ...restValues];
        }
      });
    },
    [maxSize]
  );

  const undo = useCallback(() => {
    setValue((current) => {
      if (current.length === 1) {
        return current;
      }

      const [, ...values] = current;

      return values;
    });
  }, []);

  const returnValue = useMemo<UseUndoStateReturnValue<T>>(() => {
    return [value[0] as ExcludeFunction<T>, push, undo];
  }, [push, undo, value]);

  return returnValue;
};

export { useUndoState };
