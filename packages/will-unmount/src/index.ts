import { useEffect } from "react";

/**
 *
 * useWillUnmount hook
 *
 * Fires a callback just before component unmounts
 *
 * @param {function} callback Callback to be called before unmount
 */
function useWillUnmount(callback: () => any): void {
  // run only once
  useEffect(() => {
    return callback;
  }, []);
}

export default useWillUnmount;
