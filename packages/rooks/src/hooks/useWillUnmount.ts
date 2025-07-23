import { useEffect } from "react";

type Callback = () => void;

/**
 * useWillUnmount hook
 * Fires a callback just before component unmounts
 *
 * @param {Function} callback Callback to be called before unmount
 * @see https://rooks.vercel.app/docs/hooks/useWillUnmount
 */
function useWillUnmount(callback: Callback): void {
  // run only once
  useEffect(() => {
    return callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { useWillUnmount };
