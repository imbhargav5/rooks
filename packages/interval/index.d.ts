interface Interval {
  start(): void;
  stop(): void;
  intervalId: number;
}

export default function useInterval(
  callback: () => void,
  intervalDuration: number,
  startImmediate?: boolean
): Interval;
