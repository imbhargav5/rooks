/**
 * useMouseWheelDelta
 * @description Tracks delta of mouse wheel
 * @see {@link https://rooks.vercel.app/docs/hooks/useMouseWheelDelta}
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFreshCallback } from "./useFreshCallback";

type MouseWheelDelta = {
  delta: number;
  velocity: number;
  timeStamp: number;
};

type ReturnValue = Omit<MouseWheelDelta, "timeStamp">;

const initialDelta: MouseWheelDelta = {
  delta: 0,
  velocity: 0,
  timeStamp: Date.now(),
};

function useMouseWheelDelta(): ReturnValue {
  const [deltaState, setDeltaState] = useState<MouseWheelDelta>(() => {
    return {
      ...initialDelta,
      timeStamp: Date.now(),
    };
  });

  const lastDeltaRef = useRef<MouseWheelDelta | null>(null);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const currentTimestamp = event.timeStamp;
      const lastDelta = lastDeltaRef.current;
      if (lastDelta) {
        const delta = event.deltaY;

        const timeDelta = currentTimestamp - lastDelta.timeStamp;
        console.log(timeDelta);
        const velocity = timeDelta === 0 ? 0 : delta / timeDelta;
        console.log("delta", delta);
        console.log("timedelta", timeDelta);
        console.log("velocity", velocity);
        lastDeltaRef.current = deltaState;
        setDeltaState({
          delta,
          velocity,
          timeStamp: currentTimestamp,
        });
      } else {
        lastDeltaRef.current = {
          velocity: 0,
          delta: 0,
          timeStamp: event.timeStamp,
        };
        setDeltaState({
          delta: event.deltaY,
          velocity: 0,
          timeStamp: event.timeStamp,
        });
      }
    },
    [deltaState]
  );

  const freshWheel = useFreshCallback(handleWheel);
  useEffect(() => {
    document.addEventListener("wheel", freshWheel);
    return () => {
      document.removeEventListener("wheel", freshWheel);
    };
  }, [freshWheel]);
  console.log(deltaState);
  return useMemo(() => {
    const { delta, velocity } = deltaState;
    return { delta, velocity };
  }, [deltaState]);
}

export { useMouseWheelDelta };
