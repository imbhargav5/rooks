import { useState, useEffect } from 'react';

type Options = {
  interval?: number,
  onTick?: Function,
}

const ONE_SECOND = 1000;

const useTime = ({ interval = ONE_SECOND, onTick }: Options = {}) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    if (interval <= 0) return;
    
    const intervalId = setInterval(() => {
      const newTime = new Date();
      if (onTick) onTick(newTime);
      setTime(newTime);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, onTick]);

  return time;
};

export default useTime;
