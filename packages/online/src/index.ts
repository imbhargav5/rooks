import { useState, useEffect } from "react";

/**
 *
 * @returns {boolean} Is navigator online
 */
function getIsOnline(): boolean {
  return navigator.onLine;
}

/**
 * useOnline hook
 *
 * Returns true if navigator is online, false if not.
 *
 * @returns {boolean} The value of navigator.onLine
 */
function useOnline(): boolean {
  const [online, changeOnline] = useState<boolean>(false);

  function setOffline() {
    changeOnline(false);
  }

  function setOnline() {
    changeOnline(true);
  }

  // we only needs this to be set on mount
  // hence []
  useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  useEffect(() => {
    changeOnline(getIsOnline());
  }, []);

  return online;
}

export default useOnline;
