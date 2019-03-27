interface Interval {
  /**
   * Start the interval
   */
  start(): void;
  /**
   * Stop the interval
   */
  stop(): void;
  /**
   * IntervalId of the interval
   */
  intervalId: number;
}

/**
 *
 * @param callback Function be invoked after each interval duration
 * @param {number} intervalDuration Duration in milliseconds after which callback is invoked
 * @param {boolean} [startImmediate=false] Should the timer start immediately or not. Default is false.
 */
export default function useInterval(
  callback: () => void,
  intervalDuration: number,
  startImmediate?: boolean
): Interval;
