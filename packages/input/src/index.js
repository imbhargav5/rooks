import { useState } from "react";

export default function useInput(initialValue, opts) {
  const [value, setValue] = useState(initialValue);
  function onChange(e) {
    const newValue = e.target.value;
    let shouldUpdate = true;
    if (typeof opts.validate === "function") {
      shouldUpdate = opts.validate(newValue);
    }
    if (shouldUpdate) {
      setValue(newValue);
    }
  }
  return {
    value,
    onChange
  };
}
