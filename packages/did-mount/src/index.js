import { useEffect } from "react";

function useDidMount(cb) {
  useEffect(() => {
    if (typeof cb === "function") {
      cb();
    }
  }, []);
}

module.exports = useDidMount;
