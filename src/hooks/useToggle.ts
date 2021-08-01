import { useReducer } from "react";

const defaultToggleFunction = (value: boolean): boolean => !value;

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 */
export function useToggle(
  initialValue: unknown = false,
  toggleFunction: (
    state: unknown,
    action: unknown
  ) => unknown = defaultToggleFunction
): [unknown, (action: unknown) => unknown] {
  return useReducer(toggleFunction, initialValue);
}
