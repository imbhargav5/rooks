import type { ChangeEvent } from "react";
import { useState, useCallback, useMemo } from "react";

type CheckboxChangeEvent = ChangeEvent<HTMLInputElement>;

interface CheckboxInputProps {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;
  /**
   * Function to handle onChange of a checkbox input element
   */
  onChange: (event: CheckboxChangeEvent) => void;
}

interface UseCheckboxInputStateReturn {
  /**
   * Whether the checkbox is currently checked
   */
  checked: boolean;
  /**
   * Function to toggle the checkbox state
   */
  toggle: () => void;
  /**
   * Function to explicitly set the checked state
   */
  setChecked: (checked: boolean) => void;
  /**
   * Props to spread on the checkbox input element
   */
  inputProps: CheckboxInputProps;
}

/**
 * useCheckboxInputState Hook
 * 
 * Simple checkbox state management hook that provides a boolean state and
 * props that can be spread directly onto a checkbox input element.
 * 
 * @param initialValue The initial boolean value for the checkbox
 * @returns Object containing checkbox state and handler functions
 * 
 * @example
 * ```tsx
 * const checkboxState = useCheckboxInputState(false);
 * 
 * return <input type="checkbox" {...checkboxState.inputProps} />;
 * ```
 * 
 * @example
 * ```tsx
 * const { checked, toggle, setChecked } = useCheckboxInputState(true);
 * 
 * return (
 *   <div>
 *     <input type="checkbox" {...checkboxState.inputProps} />
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={() => setChecked(false)}>Uncheck</button>
 *   </div>
 * );
 * ```
 * 
 * @see https://rooks.vercel.app/docs/hooks/useCheckboxInputState
 */
function useCheckboxInputState(
  initialValue: boolean
): UseCheckboxInputStateReturn {
  const [checked, setInternalChecked] = useState(initialValue);

  const setChecked = useCallback((newChecked: boolean) => {
    setInternalChecked(newChecked);
  }, []);

  const toggle = useCallback(() => {
    setInternalChecked(prev => !prev);
  }, []);

  const handleChange = useCallback(
    (event: CheckboxChangeEvent) => {
      setInternalChecked(event.target.checked);
    },
    []
  );

  const inputProps: CheckboxInputProps = useMemo(
    () => ({
      checked,
      onChange: handleChange,
    }),
    [checked, handleChange]
  );

  return {
    checked,
    toggle,
    setChecked,
    inputProps,
  };
}

export { useCheckboxInputState };