import { useLayoutEffect } from "react";

function useOutsideClick(ref, handler, when = true) {
  function handle(e) {
    if (ref && ref.current && !ref.current.contains(e.target)) {
      handler(e);
    }
  }
  useLayoutEffect(() => {
    if (when) {
      document.addEventListener("click", handle);
      document.addEventListener("ontouchstart", handle);
      return () => {
        document.removeEventListener("click", handle);
        document.removeEventListener("ontouchend", handle);
      };
    }
  }, [ref, handler, when]);
}

export default useOutsideClick;
