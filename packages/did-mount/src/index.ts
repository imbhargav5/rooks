import { useEffect } from "react";

/**
 *
 * @param {function} callback Callback function to be called on mount
 */
function useDidMount(callback: () => any): void {
  useEffect(() => {
    if (typeof callback === "function") {
      callback();
    }
  }, []);
}

export default useDidMount;
