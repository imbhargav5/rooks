/**
 * useMouseMoveDelta
 * @description Tracks delta of mouse move
 * @see {@link https://rooks.vercel.app/docs/hooks/useMouseMoveDelta}
 */
import { useCallback, useRef, useSyncExternalStore } from "react";

type InternalState = {
  deltaX: number;
  deltaY: number;
  clientX: number | null;
  clientY: number | null;
  velocityX: number;
  velocityY: number;
  timeStamp: number;
};

type ReturnValue = {
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
};

const initialReturnValue: ReturnValue = {
  deltaX: 0,
  deltaY: 0,
  velocityX: 0,
  velocityY: 0,
};

function useMouseMoveDelta(): ReturnValue {
  const stateRef = useRef<InternalState>({
    deltaX: 0,
    deltaY: 0,
    clientX: null,
    clientY: null,
    velocityX: 0,
    velocityY: 0,
    timeStamp: Date.now(),
  });
  const returnValueRef = useRef<ReturnValue>(initialReturnValue);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handleMouseMove = (event: MouseEvent) => {
      const currentTimestamp = event.timeStamp;
      const lastState = stateRef.current;

      if (lastState.clientX !== null && lastState.clientY !== null) {
        const deltaX = event.clientX - lastState.clientX;
        const deltaY = event.clientY - lastState.clientY;
        const timeDelta = currentTimestamp - lastState.timeStamp;
        const velocityX = timeDelta === 0 ? 0 : deltaX / timeDelta;
        const velocityY = timeDelta === 0 ? 0 : deltaY / timeDelta;

        stateRef.current = {
          deltaX,
          deltaY,
          clientX: event.clientX,
          clientY: event.clientY,
          velocityX,
          velocityY,
          timeStamp: currentTimestamp,
        };

        returnValueRef.current = { deltaX, deltaY, velocityX, velocityY };
      } else {
        stateRef.current = {
          deltaX: 0,
          deltaY: 0,
          clientX: event.clientX,
          clientY: event.clientY,
          velocityX: 0,
          velocityY: 0,
          timeStamp: event.timeStamp,
        };

        returnValueRef.current = {
          deltaX: 0,
          deltaY: 0,
          velocityX: 0,
          velocityY: 0,
        };
      }

      onStoreChange();
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return returnValueRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return initialReturnValue;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export { useMouseMoveDelta };
