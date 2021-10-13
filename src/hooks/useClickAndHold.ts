import { useCallback, useEffect, useRef } from "react";

type Options = {
  delay: number;
  initialDelay?: number;
  disabled?: boolean;
};

function useClickAndHold(
  onAction: (isHolding: boolean) => void,
  options?: Options
) {
  const { delay = 500, disabled = false, initialDelay = 500 } = options ?? {};

  const actionIntervalIsActive = useRef(false);
  const initialDelayTimeout = useRef(0);
  const actionInterval = useRef(0);

  const setupActionInterval = useCallback(() => {
    window.clearTimeout(initialDelayTimeout.current);
    initialDelayTimeout.current = window.setTimeout(
      () => setupInterval(),
      initialDelay
    );

    function setupInterval() {
      actionIntervalIsActive.current = true;
      onAction(true);

      window.clearInterval(actionInterval.current);
      actionInterval.current = window.setInterval(() => {
        actionIntervalIsActive.current = true;
        onAction(true);
      }, delay);
    }
  }, [delay, initialDelay, onAction]);

  const stopActionInterval = useCallback(() => {
    actionIntervalIsActive.current = false;
    window.clearTimeout(initialDelayTimeout.current);
    window.clearInterval(actionInterval.current);
  }, []);

  useEffect(() => {
    if (disabled) {
      stopActionInterval();
    }
  }, [disabled, stopActionInterval]);

  const onMouseDown = useCallback(() => {
    setupActionInterval();
  }, [setupActionInterval]);

  const onTouchStart = useCallback(() => {
    setupActionInterval();
  }, [setupActionInterval]);

  const onTouchEnd = useCallback(() => {
    stopActionInterval();
  }, [stopActionInterval]);

  const onMouseLeave = useCallback(() => {
    stopActionInterval();
  }, [stopActionInterval]);

  const shouldIgnoreOnClick = useRef(false);
  const onMouseUp = useCallback(() => {
    if (actionIntervalIsActive.current) {
      shouldIgnoreOnClick.current = true;
    }
    stopActionInterval();
  }, [stopActionInterval]);

  const onClick = useCallback(() => {
    if (shouldIgnoreOnClick.current) {
      shouldIgnoreOnClick.current = false;

      return;
    }
    onAction(false);
  }, [onAction]);

  return {
    onClick: disabled ? undefined : onClick,
    onMouseDown: disabled ? undefined : onMouseDown,
    onMouseLeave: disabled ? undefined : onMouseLeave,
    onMouseUp: disabled ? undefined : onMouseUp,
    onTouchEnd: disabled ? undefined : onTouchEnd,
    onTouchStart: disabled ? undefined : onTouchStart,
  };
}

export { useClickAndHold };
