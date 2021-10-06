import { useCallback, useEffect, useRef } from "react";

type Options = {
  delay: number;
  disabled?: boolean;
};

function useClickAndHold(
  onAction: (isHolding: boolean) => void,
  options?: Options
) {
  const { delay = 500, disabled = false } = options ?? {};

  const actionIntervalIsActived = useRef(false);
  const actionInterval = useRef(0);

  const setupActionInterval = useCallback(() => {
    window.clearInterval(actionInterval.current);
    actionInterval.current = window.setInterval(() => {
      actionIntervalIsActived.current = true;
      onAction(true);
    }, delay);
  }, [delay, onAction]);

  const stopActionInterval = useCallback(() => {
    actionIntervalIsActived.current = false;
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
    if (actionIntervalIsActived.current) {
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
