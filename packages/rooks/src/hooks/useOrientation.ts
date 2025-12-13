/**
 * useOrientation
 * @description orientation hook for react
 * @see {@link https://rooks.vercel.app/docs/hooks/useOrientation}
 */
import { useCallback, useSyncExternalStore } from "react";

const useOrientation = (): ScreenOrientation | null => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.screen.orientation.addEventListener("change", onStoreChange);
    return () => {
      window.screen.orientation.removeEventListener("change", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return window.screen.orientation;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return null;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export { useOrientation };
