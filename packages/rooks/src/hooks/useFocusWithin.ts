import { DOMAttributes } from "@react-types/shared";
import React, { useCallback, useLayoutEffect, useRef } from "react";

class SyntheticFocusEvent implements React.FocusEvent {
  nativeEvent: FocusEvent;
  target: Element;
  currentTarget: Element;
  relatedTarget: Element;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;

  constructor(type: string, nativeEvent: FocusEvent) {
    this.nativeEvent = nativeEvent;
    this.target = nativeEvent.target as Element;
    this.currentTarget = nativeEvent.currentTarget as Element;
    this.relatedTarget = nativeEvent.relatedTarget as Element;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.timeStamp = nativeEvent.timeStamp;
    this.type = type;
  }

  isDefaultPrevented(): boolean {
    return this.nativeEvent.defaultPrevented;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
    this.nativeEvent.preventDefault();
  }

  stopPropagation(): void {
    this.nativeEvent.stopPropagation();
    this.isPropagationStopped = () => true;
  }

  isPropagationStopped(): boolean {
    return false;
  }

  persist() {}
}

function useSyntheticBlurEvent(onBlur: (e: React.FocusEvent) => void) {
  const stateRef = useRef<{
    isFocused: boolean;
    onBlur: (e: React.FocusEvent) => void;
    observer: null | MutationObserver;
  }>({
    isFocused: false,
    onBlur,
    observer: null,
  });
  stateRef.current.onBlur = onBlur;

  // Clean up MutationObserver on unmount. See below.
  useLayoutEffect(() => {
    const state = stateRef.current;
    return () => {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    };
  }, []);

  // This function is called during a React onFocus event.
  return useCallback((e: React.FocusEvent) => {
    // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
    // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
    // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
    // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      stateRef.current.isFocused = true;

      const target = e.target;
      const onBlurHandler = (e: FocusEvent) => {
        stateRef.current.isFocused = false;

        if (target.disabled) {
          // For backward compatibility, dispatch a (fake) React synthetic event.
          stateRef.current.onBlur(new SyntheticFocusEvent("blur", e));
        }

        // We no longer need the MutationObserver once the target is blurred.
        if (stateRef.current.observer) {
          stateRef.current.observer.disconnect();
          stateRef.current.observer = null;
        }
      };

      target.addEventListener("focusout", onBlurHandler, { once: true });

      stateRef.current.observer = new MutationObserver(() => {
        if (stateRef.current.isFocused && target.disabled) {
          stateRef.current.observer?.disconnect();
          target.dispatchEvent(new FocusEvent("blur"));
          target.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
        }
      });

      stateRef.current.observer.observe(target, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    }
  }, []);
}

export interface FocusWithinProps {
  /** Whether the focus within events should be disabled. */
  isDisabled?: boolean;
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: React.FocusEvent) => void;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: React.FocusEvent) => void;
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

export interface FocusWithinResult {
  /** Props to spread onto the target element. */
  focusWithinProps: DOMAttributes;
}

/**
 * useFocusWithin
 * @description Handles focus events for the target component.
 * @see {@link https://react-hooks.org/docs/useFocusWithin}
 */
const useFocusWithin = (props: FocusWithinProps): FocusWithinResult => {
  const { isDisabled, onBlurWithin, onFocusWithin, onFocusWithinChange } =
    props;
  const state = useRef({
    isFocusWithin: false,
  });

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
      // when moving focus inside the element. Only trigger if the currentTarget doesn't
      // include the relatedTarget (where focus is moving).
      if (
        state.current.isFocusWithin &&
        !(e.currentTarget as Element).contains(e.relatedTarget as Element)
      ) {
        state.current.isFocusWithin = false;

        if (onBlurWithin) {
          onBlurWithin(e);
        }

        if (onFocusWithinChange) {
          onFocusWithinChange(false);
        }
      }
    },
    [onBlurWithin, onFocusWithinChange, state]
  );

  const onSyntheticFocus = useSyntheticBlurEvent(onBlur);
  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (!state.current.isFocusWithin) {
        if (onFocusWithin) {
          onFocusWithin(e);
        }

        if (onFocusWithinChange) {
          onFocusWithinChange(true);
        }

        state.current.isFocusWithin = true;
        onSyntheticFocus(e);
      }
    },
    [onFocusWithin, onFocusWithinChange, onSyntheticFocus]
  );

  if (isDisabled) {
    return {
      focusWithinProps: {
        onFocus: undefined,
        onBlur: undefined,
      },
    };
  }

  return {
    focusWithinProps: {
      onFocus,
      onBlur,
    },
  };
};

export { useFocusWithin };
