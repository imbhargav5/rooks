import { noop } from "@/utils/noop";
import { useEffect } from "react";

/**
 * useLockBodyScroll hook
 *
 * This hook locks the scroll of the body element when `isLocked` is set to `true`.
 *
 * @param isLocked Whether or not to lock the body scroll
 * @see https://rooks.vercel.app/docs/hooks/useLockBodyScroll
 */
function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Get the original body overflow value
      const originalOverflow = window.getComputedStyle(document.body).overflow;

      // Set overflow to hidden to lock the scroll
      document.body.style.overflow = "hidden";

      // Return a cleanup function that resets the overflow back to the original value
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      return noop;
    }
  }, [isLocked]);
}

export { useLockBodyScroll };
