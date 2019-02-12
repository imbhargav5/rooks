import { useEffect } from "react";

// Originally from https://github.com/streamich/react-use
function useDebounce(fn, ms = 0, args = []) {
  useEffect(() => {
    const handle = setTimeout(fn.bind(null, args), ms);

    return () => {
      // if args change then clear timeout
      clearTimeout(handle);
    }
  }, args);
};

module.exports = useDebounce;
