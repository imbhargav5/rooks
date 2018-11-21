import { useState } from "react";

export default function useSelect(list, initialIndex = 0) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  function setItem(item) {
    setSelectedIndex(list.indexOf(item));
  }

  return {
    index: selectedIndex,
    item: list[selectedIndex],
    setIndex: setSelectedIndex,
    setItem
  };
}
