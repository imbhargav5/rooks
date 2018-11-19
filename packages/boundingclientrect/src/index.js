import { useState, useEffect } from "react";

var config = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true
};

export default function(ref) {
  function getBoundingClientRect() {
    if (ref.current) {
      return ref.current.getBoundingClientRect();
    }
    return null;
  }

  const [value, setValue] = useState(null);

  function update() {
    setValue(getBoundingClientRect());
  }

  useEffect(
    () => {
      update();
    },
    [ref.current]
  );

  function mutate(mutationList) {
    update();
  }

  useEffect(
    () => {
      // Create an observer instance linked to the callback function
      if (ref.current) {
        const observer = new MutationObserver(mutate);

        // Start observing the target node for configured mutations
        observer.observe(ref.current, config);
        return () => {
          observer.disconnect();
        };
      }
    },
    [ref.current]
  );

  return value;
}
