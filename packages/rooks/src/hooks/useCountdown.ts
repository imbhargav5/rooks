import { useState } from "react";
import { useIntervalWhen } from "./useIntervalWhen";

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
  const restTime = endTime.getTime() - time.getTime();
  const count = restTime > 0 ? Math.ceil(restTime / interval) : 0;

  useIntervalWhen(onTick, count ? interval : undefined, true, true);

  return count;

  function onTick() {
    const newTime = new Date();
    if (newTime > endTime) {
      if (onEnd) {
        onEnd(newTime);
      }

      setTime(endTime);

      return;
    }

    if (onDown) {
      onDown(restTime, newTime);
    }

    setTime(newTime);
  }
}

export { useCountdown };
