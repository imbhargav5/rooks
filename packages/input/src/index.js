import { useState, useEffect } from "react";

const defaultOptions = {
  syncWithInitialValue: false
};

export default function useInput(initialValue = "", opts = defaultOptions) {
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
  //sync with default value
  useEffect(
    () => {
      if (opts.syncWithInitialValue) {
        setValue(initialValue);
      }
    },
    [initialValue]
  );

  // // run it when updates
  // useEffect(
  //   () => {
  //     if (typeof opts.onChange === "function") {
  //       opts.onChange(value);
  //     }
  //   },
  //   [value]
  // );

  return { value, onChange };
}
