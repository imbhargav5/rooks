import { useEffect, useRef, useState } from "react";
import { useIntervalWhen } from "./useIntervalWhen";
import { useFreshRef } from "./useFreshRef";

type CountdownOptions = {
  interval?: number;
  onDown?: (restTime: number, newTime: Date) => void;
  onEnd?: (newTime: Date) => void;
};

/**
 *
 * useCountdown
 * Easy way to countdown until a given endtime in intervals
 *
 * @param endTime Time to countdown
 * @param options  Countdown options
 * @see https://rooks.vercel.app/docs/hooks/useCountdown
 */
function useCountdown(endTime: Date, options: CountdownOptions = {}): number {
  const { interval = 1_000, onDown, onEnd } = options;
  const [time, setTime] = useState<Date>(() => new Date());
  const endTimeMs = endTime.getTime();
  const restTime = endTimeMs - time.getTime();
  const count = restTime > 0 ? Math.ceil(restTime / interval) : 0;
  const endedAtRef = useRef<number | null>(null);
  const onEndRef = useFreshRef(onEnd);

  useIntervalWhen(onTick, interval, count > 0, true);

  useEffect(() => {
    if (
      Number.isFinite(endTimeMs) &&
      endTimeMs <= Date.now() &&
      endedAtRef.current !== endTimeMs
    ) {
      endedAtRef.current = endTimeMs;
      onEndRef.current?.(new Date());
    }
  }, [endTimeMs, onEndRef]);

  return count;

  function onTick() {
    const newTime = new Date();
    const newRestTime = endTimeMs - newTime.getTime();

    if (newRestTime <= 0) {
      if (endedAtRef.current !== endTimeMs) {
        endedAtRef.current = endTimeMs;
        onEnd?.(newTime);
      }

      setTime(endTime);

      return;
    }

    if (onDown) {
      onDown(newRestTime, newTime);
    }

    setTime(newTime);
  }
}

export { useCountdown };
