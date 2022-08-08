import { DOMAttributes, FocusEvents } from "@react-types/shared";
import { FocusEvent, useCallback } from "react";

type FocusProps = FocusEvents;

interface FocusResult {
  /** Props to spread onto the target element. */
  focusProps: DOMAttributes;
}

/**
 * useFocus
 * @description Handles focus events for the immediate target element.
 * @see {@link https://react-hooks.org/docs/useFocus}
 */
const useFocus = (props: FocusProps): FocusResult => {
  const {
    onBlur: propsOnBlur,
    onFocus: propsOnFocus,
    onFocusChange: propsOnFocusChange,
  } = props;
  const onBlur: FocusProps["onBlur"] = useCallback(
    (e: FocusEvent) => {
      if (e.target === e.currentTarget) {
        if (propsOnBlur) propsOnBlur(e);
        if (propsOnFocusChange) propsOnFocusChange(false);
      }
    },
    [propsOnBlur, propsOnFocusChange]
  );

  const onFocus: FocusProps["onFocus"] = useCallback(
    (e: FocusEvent) => {
      if (e.target === e.currentTarget) {
        if (propsOnFocus) propsOnFocus(e);
        if (propsOnFocusChange) propsOnFocusChange(true);
      }
    },
    [propsOnFocusChange, propsOnFocus]
  );

  return {
    focusProps: {
      onFocus,
      onBlur,
    },
  };
};

export { useFocus };
