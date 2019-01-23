import { useState, useEffect } from "react";

/**
 *
 * @returns {boolean} Is navigator online
 */
function getIsOnline() {
  return navigator.onLine;
}

/**
 * Online hook
 * @returns {boolean} The value of navigator.onLine
 */
function useOnline() {
  const [online, changeOnline] = useState(null);

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
    getIsOnline();
  }, []);

  return online;
}

module.exports = useOnline;
