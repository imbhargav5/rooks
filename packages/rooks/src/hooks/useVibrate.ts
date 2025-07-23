/**
 * useVibrate
 * @description Vibration API hook for React
 * @see {@link https://rooks.vercel.app/docs/hooks/useVibrate}
 */
import { useEffect } from "react";

type UseVibrateOptions = {
  isEnabled: boolean;
  pattern: number | number[];
};

function useVibrate({ isEnabled, pattern }: UseVibrateOptions): void {
  useEffect(() => {
    if (!("vibrate" in navigator) || typeof navigator.vibrate !== "function") {
      console.warn("Vibration API not supported by the current browser");
      return;
    }

    if (isEnabled) {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(0);
    }

    return () => {
      navigator.vibrate(0);
    };
  }, [isEnabled, pattern]);
}

export { useVibrate };
