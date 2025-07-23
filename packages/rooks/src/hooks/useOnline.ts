import { useSyncExternalStore } from "use-sync-external-store/shim";
import { noop } from "@/utils/noop";

/**
 *
 * @returns {boolean} Is navigator online
 */
function getSnapshot(): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  return navigator.onLine;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window !== "undefined") {
    window.addEventListener("online", onStoreChange);
    window.addEventListener("offline", onStoreChange);
    return () => {
      window.removeEventListener("online", onStoreChange);
      window.removeEventListener("offline", onStoreChange);
    };
  } else {
    console.warn("useOnline: window is undefined.");
    return noop;
  }
}

/**
 * useOnline hook
 *
 * Returns true if navigator is online, false if not.
 *
 * @returns {boolean} The value of navigator.onLine
 * @see https://rooks.vercel.app/docs/hooks/useOnline
 */
function useOnline(): boolean | null {
  const isOnline = useSyncExternalStore<boolean | null>(subscribe, getSnapshot);

  return isOnline;
}

export { useOnline };
