import { useState, useLayoutEffect } from "react";
import raf from "raf";

/*
  We are using raf which is a polyfilled version of requestAnimationFrame
*/

/**
 *
 * useRaf
 * @param {function} callback The callback function to be executed
 * @param {boolean} [isActive=true] The value which while true, keeps the raf running infinitely
 * @returns {number} The raf id
 */
function useRaf(callback, isActive = true) {
  let [rafId, setRafId] = useState(null);
  useLayoutEffect(() => {
    if (isActive) {
      let _rafId = raf(() => {
        callback();
        setRafId(_rafId);
      });
      return () => {
        raf.cancel(rafId);
      };
    }
  }, [callback, isActive, rafId]);
  return rafId;
}
export default useRaf;
