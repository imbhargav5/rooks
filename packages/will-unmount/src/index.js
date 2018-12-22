import { useEffect } from "react";

function useWillUnmount(cb) {
  // run only once
  useEffect(() => {
    return cb;
  }, []);
}

module.exports = useWillUnmount;
