import { useState } from "react";

const defaultToggleFunction = v => !v;

// takes an initial value
// and a toggler function. This allows for non boolean toggles
export default function useToggle(
  initialValue = false,
  toggleFunction = defaultToggleFunction
) {
  const [value, setValue] = useState(initialValue);
  function toggleValue() {
    setValue(toggleFunction(value));
  }
  return [value, toggleValue];
}
