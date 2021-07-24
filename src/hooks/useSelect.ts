import { useCallback, useState } from "react";

type SelectHandler<T> = {
  index: number;
  item: T;
  setIndex: (newIndex: number) => void;
  setItem: (newItem: T) => void;
};

/**
 * useSelect hook
 * Helps easily select a value from a list of values
 *
 * @param list List of values to select a value from
 * @param [initialIndex=0] Initial index which is selected
 * @returns handler
 */
function useSelect<T>(list: T[], initialIndex: number = 0): SelectHandler<T> {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const setItem = useCallback(
    (item: T) => {
      setSelectedIndex(list.indexOf(item));
    },
    [list]
  );

  return {
    index: selectedIndex,
    item: list[selectedIndex],
    setIndex: setSelectedIndex,
    setItem,
  };
}

export { useSelect };
