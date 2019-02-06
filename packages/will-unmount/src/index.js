import { useEffect } from "react";

/**
 *
 * Unmount hook
 * @param {function} callback Callback to be called before unmount
 */
function useWillUnmount(callback) {
  // run only once
  useEffect(() => {
    return callback;
  }, []);
}

export default useWillUnmount;
