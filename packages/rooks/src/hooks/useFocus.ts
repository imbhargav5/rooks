import { FocusEvent, useCallback } from "react";

// Define our own types instead of using @react-types/shared
interface FocusEvents {
  /** Handler that is called when the element receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the element loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

interface DOMAttributes<T> {
  onFocus?: (e: FocusEvent<T>) => void;
  onBlur?: (e: FocusEvent<T>) => void;
}

type FocusProps = FocusEvents;

interface FocusResult<T> {
  /** Props to spread onto the target element. */
  focusProps: DOMAttributes<T>;
}

/**
 * useFocus
 * @description Handles focus events for the immediate target element.
 * @see {@link https://rooks.vercel.app/docs/hooks/useFocus}
 */
const useFocus = <T extends HTMLElement>(props: FocusProps): FocusResult<T> => {
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
