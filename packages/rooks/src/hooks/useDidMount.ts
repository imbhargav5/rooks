import { useEffect } from "react";
import type { CallbackWithNoArguments } from "@/types/types";

/**
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 * @see {@link https://react-hooks.org/docs/useDidMount}
 */
function useDidMount(callback: CallbackWithNoArguments): void {
  useEffect(() => {
    if (typeof callback === "function") {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { useDidMount };
