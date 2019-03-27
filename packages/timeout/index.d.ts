interface Timeout {
  /**
   * Clear the timeout
   */
  clear(): void;
  /**
   * Start the timeout
   */
  start(): void;
}

/**
 *
 * @param callback Function to be executed in timeout
 * @param {number} [timeoutDelay=0] Number in milliseconds after which callback is to be run. Default is 0.
 */
export default function useTimeout(
  callback: () => void,
  timeoutDelay?: number
): Timeout;
