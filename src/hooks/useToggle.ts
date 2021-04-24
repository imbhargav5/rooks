import { useReducer } from 'react';

const defaultToggleFunction = (v: boolean): boolean => !v;

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 */
export function useToggle(
  initialValue: any = false,
  toggleFunction: (state: any, action: any) => any = defaultToggleFunction
): [any, (action: any) => any] {
  return useReducer(toggleFunction, initialValue);
}
