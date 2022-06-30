import { useEffect } from "react";

type Callback = () => void;

/**
 * useWillUnmount hook
 * Fires a callback just before component unmounts
 *
 * @param {Function} callback Callback to be called before unmount
 */
function useWillUnmount(callback: Callback): void {
  // run only once
  useEffect(() => {
    return callback;
  }, [callback]);
}

export { useWillUnmount };