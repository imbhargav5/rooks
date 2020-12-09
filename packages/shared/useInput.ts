import { useState, useEffect, ChangeEvent } from "react";

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

interface InputHandler {
  /**
   * The current value of the input
   */
  value: any;

  /**
   * Function to handle onChange of an input element
   * @param event The input change event
   */
  onChange: (e: InputChangeEvent) => void;
}

interface Options {
  /**
   * validate
   *
   * Validator function which can be used to prevent updates
   *
   * @param {any} New value
   * @param {any} Current value
   * @return {boolean} Whether an update should happen or not
   *
   * */
  validate?: (newValue: any, currentValue: any) => boolean;
}

const defaultOptions: Options = {};

/**
 *
 * useInput Hook
 *
 * Handles an input's value and onChange props internally to
 * make text input creation process easier
 *
 * @param {any} [initialValue=""] Initial value of the input
 * @param {Options} [opts={}] Options object
 * @returns {InputHandler} Input handler with value and onChange
 */
function useInput(
  initialValue: any = "",
  opts: Options = defaultOptions
): InputHandler {
  const [value, setValue] = useState(initialValue);

  function onChange(e: InputChangeEvent) {
    const newValue = e.target.value;
    let shouldUpdate = true;
    if (typeof opts.validate === "function") {
      shouldUpdate = opts.validate(newValue, value);
    }
    if (shouldUpdate) {
      setValue(newValue);
    }
  }

  //sync with default value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handler: InputHandler = {
    value,
    onChange
  };

  return handler;
}

export { useInput };
