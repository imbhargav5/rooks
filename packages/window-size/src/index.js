import { useState, useEffect } from "react";

const initialValue = {
  width: null,
  height: null,
  outerWidth: null,
  outerHeight: null
};

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(initialValue);

  function getWindowSize() {
    setWindowSize({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    });
  }

  // run on mount
  useEffect(() => {
    // run only once
    getWindowSize();
  }, []);

  // set resize handler once on mount and clean before unmount
  useEffect(() => {
    window.addEventListener("resize", getWindowSize);
    return () => {
      window.removeEventListener("resize", getWindowSize);
    };
  }, []);

  return windowSize;
}

module.exports = useWindowSize;
