import { useState, useEffect } from "react";

export default function useNavigatorLanguage() {
  const [language, setLanguage] = useState(null);
  useEffect(() => {
    setLanguage(navigator.language || navigator.userLanguage);
  }, []);
  return language;
}
