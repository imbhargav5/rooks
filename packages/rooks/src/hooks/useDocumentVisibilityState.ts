import { useState } from "react";
import { useGlobalObjectEventListener } from "./useGlobalObjectEventListener";

type UseDocumentVisibilityStateReturnType = Document["visibilityState"] | null;

/**
 * useDocumentVisibilityState
 * @description Returns the visibility state of the document. Returns null on the server side.
 * @returns {UseDocumentVisibilityStateReturnType} The visibility state of the document. `null` on the server.
 * @see {@link https://react-hooks.org/docs/useDocumentVisibilityState}
 */
function useDocumentVisibilityState(): UseDocumentVisibilityStateReturnType {
  const [visibilityState, setVisibilityState] =
    useState<UseDocumentVisibilityStateReturnType>(
      document ? document.visibilityState : null
    );

  useGlobalObjectEventListener(
    global.document,
    "visibilitychange",
    () => {
      setVisibilityState(document.visibilityState);
    },
    {},
    true,
    true
  );

  return visibilityState;
}

export { useDocumentVisibilityState };
