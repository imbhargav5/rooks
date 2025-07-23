/**
 * useMouseMoveDelta
 * @description Tracks delta of mouse move
 * @see {@link https://rooks.vercel.app/docs/hooks/useMouseMoveDelta}
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useFreshCallback } from "./useFreshCallback";

type Delta = {
  deltaX: number;
  deltaY: number;
  clientX: number | null;
  clientY: number | null;
  velocityX: number;
  velocityY: number;
  timeStamp: number;
};

type ReturnValue = Omit<Delta, "timeStamp" | "clientX" | "clientY">;

const initialDelta: Delta = {
  deltaX: 0,
  deltaY: 0,
  clientX: null,
  clientY: null,
  velocityX: 0,
  velocityY: 0,
  timeStamp: Date.now(),
};

function useMouseMoveDelta(): ReturnValue {
  const [delta, setDelta] = useState<Delta>(() => {
    return {
      ...initialDelta,
      timeStamp: Date.now(),
    };
  });

  const lastDeltaRef = useRef<Delta | null>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const currentTimestamp = event.timeStamp;
      const lastDelta = lastDeltaRef.current;
      if (
        lastDelta &&
        lastDelta.clientX !== null &&
        lastDelta.clientY !== null
      ) {
        const deltaX = event.clientX - lastDelta.clientX;
        const deltaY = event.clientY - lastDelta.clientY;

        const timeDelta = currentTimestamp - lastDelta.timeStamp;
        // velocity doesnt make sense if timeDelta is 0 or if lastMousePosition is null
        // because it means that the mouse has not moved since the last time this callback was called
        const velocityX = timeDelta === 0 ? 0 : deltaX / timeDelta;
        const velocityY = timeDelta === 0 ? 0 : deltaY / timeDelta;
        lastDeltaRef.current = delta;
        setDelta({
          deltaX,
          clientX: event.clientX,
          clientY: event.clientY,
          deltaY,
          velocityX,
          velocityY,
          timeStamp: currentTimestamp,
        });
      } else {
        // backfill lastMousePosition reasonably
        lastDeltaRef.current = {
          ...delta,
          clientX: event.clientX,
          clientY: event.clientY,
          timeStamp: event.timeStamp,
        };
        setDelta({
          clientX: event.clientX,
          clientY: event.clientY,
          deltaX: 0,
          deltaY: 0,
          velocityX: 0,
          velocityY: 0,
          timeStamp: event.timeStamp,
        });
      }
    },
    [delta]
  );

  const freshMouseMove = useFreshCallback(handleMouseMove);
  useEffect(() => {
    document.addEventListener("mousemove", freshMouseMove, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousemove", freshMouseMove);
    };
  }, [freshMouseMove]);

  return useMemo(() => {
    const { deltaX, deltaY, velocityX, velocityY } = delta;
    return { deltaX, deltaY, velocityX, velocityY };
  }, [delta]);
}

export { useMouseMoveDelta };
