import { useState, useEffect } from "react";
/**
 *
 * @typedef handler
 * @type {Object}
 * @property {string} value The value of the input
 * @property {function}  onChange Change handler
 */

/**
 *
 * @typedef options
 * @type {Object}
 * @property {function} validate Validator function which can be used to prevent updates
 */

const defaultOptions = {};

/**
 *
 * Input Hook
 * @param {string} [initialValue=""] Initial value of the input
 * @param {options} [opts={}] Options object
 * @returns {handler}
 */
function useInput(initialValue = "", opts = defaultOptions) {
  const [value, setValue] = useState(initialValue);
  function onChange(e) {
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
  useEffect(
    () => {
      setValue(initialValue);
    },
    [initialValue]
  );

  return { value, onChange };
}

module.exports = useInput;
