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
 * @param {number} initialIndex Initial index which is selected
 * @returns handler
 * @see https://rooks.vercel.app/docs/hooks/useSelect
 */
function useSelect<T>(list: T[], initialIndex = 0): SelectHandler<T> {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const setItem = useCallback(
    (item: T) => {
      setSelectedIndex(list.indexOf(item));
    },
    [list]
  );

  return {
    index: selectedIndex,
    item: list[selectedIndex] as T,
    setIndex: setSelectedIndex,
    setItem,
  };
}

export { useSelect };
