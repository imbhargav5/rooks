import { useState, useEffect } from "react";

function getIsOnline() {
  return navigator.onLine;
}

export default function useOnline() {
  const [online, changeOnline] = useState(getIsOnline());

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

  return online;
}
