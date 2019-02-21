import { useLayoutEffect } from "react";

function useOutsideClick(ref, handler, when = true) {
  if ('ontouchstart' in document.documentElement) {
    document.body.style.cursor = 'pointer'
  }
  function handle(e) {
    if (ref && ref.current && !ref.current.contains(e.target)) {
      handler(e);
    }
  }
  useLayoutEffect(() => {
    if (when) {
      document.addEventListener("click", handle);
      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [ref, handler, when]);
}

export default useOutsideClick;
