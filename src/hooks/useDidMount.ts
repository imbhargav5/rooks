import { useEffect } from "react";

/**
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 */
// eslint-disable-next-line promise/prefer-await-to-callbacks
function useDidMount(callback: () => void): void {
  useEffect(() => {
    if (typeof callback === "function") {
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { useDidMount };
