import { useState } from 'react';
import { useInterval } from './useInterval';

type CountdownOptions = {
  interval?: number;
  onDown?: Function;
  onEnd?: Function;
};

/**
 *
 * useCountdown
 * Easy way to countdown until a given endtime in intervals
 *
 * @param endTime Time to countdown
 * @param options  Countdown options
 */
function useCountdown(endTime: Date, options: CountdownOptions = {}): number {
  const { interval = 1_000, onDown, onEnd } = options;
  const [time, setTime] = useState<Date>(() => new Date());
  const restTime = endTime.getTime() - time.getTime();
  const count = restTime > 0 ? Math.ceil(restTime / interval) : 0;

  useInterval(onTick, count ? interval : null, true);

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
