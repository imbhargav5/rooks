/**
 * useMouseWheelDelta
 * @description Tracks delta of mouse wheel
 * @see {@link https://rooks.vercel.app/docs/hooks/useMouseWheelDelta}
 */
import { useCallback, useRef, useSyncExternalStore } from "react";

type InternalState = {
  delta: number;
  velocity: number;
  timeStamp: number;
};

type ReturnValue = {
  delta: number;
  velocity: number;
};

const initialReturnValue: ReturnValue = {
  delta: 0,
  velocity: 0,
};

function useMouseWheelDelta(): ReturnValue {
  const stateRef = useRef<InternalState | null>(null);
  const returnValueRef = useRef<ReturnValue>(initialReturnValue);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handleWheel = (event: WheelEvent) => {
      const currentTimestamp = event.timeStamp;
      const lastState = stateRef.current;

      if (lastState !== null) {
        const delta = event.deltaY;
        const timeDelta = currentTimestamp - lastState.timeStamp;
        const velocity = timeDelta === 0 ? 0 : delta / timeDelta;

        stateRef.current = {
          delta,
          velocity,
          timeStamp: currentTimestamp,
        };

        returnValueRef.current = { delta, velocity };
      } else {
        stateRef.current = {
          delta: event.deltaY,
          velocity: 0,
          timeStamp: event.timeStamp,
        };

        returnValueRef.current = {
          delta: event.deltaY,
          velocity: 0,
        };
      }

      onStoreChange();
    };

    document.addEventListener("wheel", handleWheel);
    return () => {
      document.removeEventListener("wheel", handleWheel);
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

export { useMouseWheelDelta };
