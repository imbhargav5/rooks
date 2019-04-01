import { useReducer } from "react";

const defaultToggleFunction = v => !v;

// takes an initial value
// and a toggler function. This allows for non boolean toggles
export default function useToggle(
  initialValue = false,
  toggleFunction = defaultToggleFunction
) {
  return useReducer(toggleFunction, initialValue);
}
