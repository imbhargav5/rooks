interface Timeout {
  clear(): void;
  start(): void;
}

export default function useTimeout(
  callback: () => void,
  timeoutDelay?: number
): Timeout;
