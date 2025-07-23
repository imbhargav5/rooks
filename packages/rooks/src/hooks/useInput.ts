import type { ChangeEvent } from "react";
import { useState, useEffect, useCallback } from "react";

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

type InputHandler<T> = {
  /**
   * Function to handle onChange of an input element
   *
   * @param event The input change event
   */
  onChange: (event: InputChangeEvent) => void;

  /**
   * The current value of the input
   */
  value: T;
};

type Options<T> = {
  /**
   * validate
   *
   * Validator function which can be used to prevent updates
   *
   * @param {any} New value
   * @param {any} Current value
   * @returns {boolean} Whether an update should happen or not
   */
  validate?: (newValue: T, currentValue: T) => boolean;
};

const defaultOptions = {};

/**
 *
 * useInput Hook
 *
 * Handles an input's value and onChange props internally to
 * make text input creation process easier
 *
 * @param {unknown} [initialValue] Initial value of the input
 * @param {Options} [options] Options object
 * @returns {InputHandler} Input handler with value and onChange
 * @see https://rooks.vercel.app/docs/hooks/useInput
 */
function useInput<
  T extends number | string | readonly string[] | undefined = string
>(
  initialValue: T = "" as T,
  options: Options<T> = defaultOptions
): InputHandler<T> {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = useCallback(
    (event: InputChangeEvent) => {
      const newValue = event.target.value as T;
      let shouldUpdate = true;
      if (typeof options.validate === "function") {
        shouldUpdate = options.validate(newValue, value);
      }

      if (shouldUpdate) {
        setValue(newValue);
      }
    },
    [options, value]
  );

  // sync with default value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handler: InputHandler<T> = {
    onChange,
    value,
  };

  return handler;
}

export { useInput };
