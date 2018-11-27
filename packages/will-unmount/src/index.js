import { useEffect } from "react";

function useWillUnmount(cb) {
  // run only once
  useEffect(() => {
    return cb;
  }, []);
  return null;
}

module.exports = useWillUnmount;
