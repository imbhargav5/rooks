import { DOMAttributes } from "@react-types/shared";
import React, { useCallback, useRef } from "react";

interface FocusWithinProps {
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: React.FocusEvent) => void;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: React.FocusEvent) => void;
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

interface FocusWithinResult<T> {
  /** Props to spread onto the target element. */
  focusWithinProps: DOMAttributes<T>;
}

/**
 * useFocusWithin
 * @description Handles focus events for the target component.
 * @see {@link https://rooks.vercel.app/docs/hooks/useFocusWithin}
 */
const useFocusWithin = <T extends HTMLElement>(
  props: FocusWithinProps
): FocusWithinResult<T> => {
  const { onBlurWithin, onFocusWithin, onFocusWithinChange } = props;
  const state = useRef({
    isFocusWithin: false,
  });

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (
        state.current.isFocusWithin &&
        !(e.currentTarget as Element).contains(e.relatedTarget as Element)
      ) {
        state.current.isFocusWithin = false;
        if (onBlurWithin) onBlurWithin(e);
        if (onFocusWithinChange) onFocusWithinChange(false);
      }
    },
    [onBlurWithin, onFocusWithinChange]
  );

  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (!state.current.isFocusWithin) {
        if (onFocusWithin) onFocusWithin(e);
        if (onFocusWithinChange) onFocusWithinChange(true);
        state.current.isFocusWithin = true;
      }
    },
    [onFocusWithin, onFocusWithinChange]
  );

  return {
    focusWithinProps: {
      onFocus,
      onBlur,
    },
  };
};

export { useFocusWithin };
