import { useReducer } from "react";

const defaultToggleFunction = (v: boolean): boolean => !v;

// takes an initial value
// and a toggler function. This allows for non boolean toggles
export function useToggle(
  initialValue = false,
  toggleFunction: (state: any, action: any) => any = defaultToggleFunction
): [any, (action: any) => any] {
  return useReducer(toggleFunction, initialValue);
}
