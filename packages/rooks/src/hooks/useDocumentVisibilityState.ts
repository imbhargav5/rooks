import { useSyncExternalStore } from "react";

type UseDocumentVisibilityStateReturnType = Document["visibilityState"] | null;

function getVisibilityStateSnapshot(): UseDocumentVisibilityStateReturnType {
  if (typeof document !== "undefined") {
    return document.visibilityState;
  } else {
    return null;
  }
}

function getVisibilityStateSubscription(callback: () => void) {
  // subscription function is only called on the client side
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", callback);
    return () => {
      document.removeEventListener("visibilitychange", callback);
    };
  }
  // unreachable
  return () => { };
}

function getVisibilityStateServerSnapshot(): UseDocumentVisibilityStateReturnType {
  return null;
}

/**
 * useDocumentVisibilityState
 * @description Returns the visibility state of the document. Returns null on the server side.
 * @returns {UseDocumentVisibilityStateReturnType} The visibility state of the document. `null` on the server.
 * @see {@link https://rooks.vercel.app/docs/hooks/useDocumentVisibilityState}
 */
function useDocumentVisibilityState(): UseDocumentVisibilityStateReturnType {
  return useSyncExternalStore(getVisibilityStateSubscription, getVisibilityStateSnapshot, getVisibilityStateServerSnapshot);
}

export { useDocumentVisibilityState };
