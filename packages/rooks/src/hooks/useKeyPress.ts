import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { doesIdentifierMatchKeyboardEvent } from "../utils/doesIdentifierMatchKeyboardEvent";
import { useEventListener } from "./useEventListener";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { resolveEventTarget, type EventTargetLike } from "@/utils/eventTarget";
import { stableSerialize } from "@/utils/stableSerialize";

export type KeyIdentifier = string | number;

function getPhysicalKeyId(event: KeyboardEvent) {
  if (event.code) {
    return `code:${event.code}`;
  }

  const legacyCode = event.keyCode || event.which || event.charCode;
  if (legacyCode) {
    return `legacy:${legacyCode}:${event.location}`;
  }

  return `key:${event.key}:${event.location}`;
}

export type UseKeyPressOptions = {
  target?:
    | Window
    | Document
    | RefObject<HTMLElement | SVGElement | null>
    | null;
  when?: boolean;
};

type PressedState = {
  isPressed: boolean;
  keySignature: string | null;
};

/**
 * useKeyPress
 * @description Tracks whether any of the provided keys are currently pressed.
 * @see {@link https://rooks.vercel.app/docs/hooks/useKeyPress}
 */
function useKeyPress(
  keys: KeyIdentifier | KeyIdentifier[],
  options: UseKeyPressOptions = {}
): boolean {
  const { target, when = true } = options;
  const [pressedState, setPressedState] = useState<PressedState>({
    isPressed: false,
    keySignature: null,
  });
  const keyList = useMemo(() => (Array.isArray(keys) ? keys : [keys]), [keys]);
  const keySignature = stableSerialize(keyList);
  const pressedKeysRef = useRef<Map<string, KeyIdentifier[]>>(new Map());
  const resolvedTarget =
    target ?? (typeof window !== "undefined" ? window : null);
  const keyboardTarget = resolvedTarget as EventTargetLike<EventTarget>;
  const previousTargetRef = useRef<EventTarget | null>(null);

  const updatePressedState = () => {
    const isPressed = pressedKeysRef.current.size > 0;
    setPressedState((currentState) => {
      const nextSignature = isPressed ? keySignature : null;
      if (
        currentState.isPressed === isPressed &&
        currentState.keySignature === nextSignature
      ) {
        return currentState;
      }

      return { isPressed, keySignature: nextSignature };
    });
  };

  const clearPressedState = () => {
    pressedKeysRef.current.clear();
    setPressedState((currentState) =>
      currentState.isPressed || currentState.keySignature !== null
        ? { isPressed: false, keySignature: null }
        : currentState
    );
  };

  useEffect(() => {
    if (!when) {
      // Disabling the external keyboard subscription invalidates held state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      clearPressedState();
    }
  }, [when]);

  useEffect(() => {
    // A new key set cannot inherit presses recorded for the previous set.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    clearPressedState();
  }, [keySignature]);

  useIsomorphicEffect(() => {
    const nextTarget = resolveEventTarget(keyboardTarget);
    if (previousTargetRef.current !== nextTarget) {
      previousTargetRef.current = nextTarget;
      clearPressedState();
    }
  });

  useEventListener(
    "keydown",
    (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        keyList.some((identifier) =>
          doesIdentifierMatchKeyboardEvent(keyboardEvent, identifier)
        )
      ) {
        const matchingIdentifiers = keyList.filter((identifier) =>
          doesIdentifierMatchKeyboardEvent(keyboardEvent, identifier)
        );
        pressedKeysRef.current.set(
          getPhysicalKeyId(keyboardEvent),
          matchingIdentifiers
        );
        updatePressedState();
      }
    },
    {
      target: keyboardTarget,
      when,
    }
  );

  useEventListener(
    "keyup",
    (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (pressedKeysRef.current.delete(getPhysicalKeyId(keyboardEvent))) {
        updatePressedState();
      }
    },
    {
      target: keyboardTarget,
      when,
    }
  );

  useEventListener(
    "blur",
    () => {
      clearPressedState();
    },
    {
      target:
        resolvedTarget && "current" in resolvedTarget
          ? (resolvedTarget as EventTargetLike<EventTarget>)
          : typeof window !== "undefined"
            ? (window as EventTargetLike<EventTarget>)
            : null,
      when,
    }
  );

  useEventListener(
    "visibilitychange",
    () => {
      if (typeof document !== "undefined" && document.hidden) {
        clearPressedState();
      }
    },
    {
      target: typeof document !== "undefined" ? document : null,
      when,
    }
  );

  return (
    pressedState.isPressed && when && pressedState.keySignature === keySignature
  );
}

export { useKeyPress };
