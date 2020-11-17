import { useState } from "react";
import { useInterval } from "./useInterval";

type CountdownOptions = {
  interval?: number;
  onDown?: Function;
  onEnd?: Function;
};

const useCountdown = (
  endTime: Date,
  { interval = 1000, onDown, onEnd }: CountdownOptions = {}
): number => {
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
};

export {useCountdown};
