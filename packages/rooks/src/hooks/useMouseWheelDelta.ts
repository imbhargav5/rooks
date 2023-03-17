/**
 * useMouseWheelDelta
 * @description Tracks delta of mouse move
 * @see {@link https://rooks.vercel.app/docs/useMouseWheelDelta}
 */
import { useState, useEffect, MouseEvent, useCallback } from "react";
import { usePreviousImmediate } from "@/hooks/usePreviousImmediate";
import { useFreshCallback } from "./useFreshCallback";
import { usePreviousDifferent } from "./usePreviousDifferent";

const useMouseWheelDelta = () => {
  const [delta, setDelta] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastDelta = usePreviousDifferent(delta);
  const lastTimestamp = usePreviousImmediate(Date.now());

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const currentDelta = event.deltaY;
      const currentTimestamp = Date.now();

      if (lastTimestamp !== null) {
        const deltaYDiff = currentDelta - (lastDelta ?? 0);
        const timeDiff = currentTimestamp - lastTimestamp;

        const currentVelocity = deltaYDiff / timeDiff;

        setVelocity(currentVelocity);
      }

      setDelta(currentDelta);
    },
    [lastDelta, lastTimestamp]
  );

  const freshHandleWheel = useFreshCallback(handleWheel);

  useEffect(() => {
    window.addEventListener("wheel", freshHandleWheel);

    return () => {
      window.removeEventListener("wheel", freshHandleWheel);
    };
  }, [lastDelta, lastTimestamp, freshHandleWheel]);

  return { delta, velocity };
};

export { useMouseWheelDelta };
