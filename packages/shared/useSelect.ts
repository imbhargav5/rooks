import { useState } from "react";

/**
 *
 * @typedef handler
 * @type {Object}
 * @property {number} index The index of the selected item in the list
 * @property {function}  item The selected item in the list
 * @property {function} setIndex Set value at index
 * @property {function} setItem Set value
 */

/**
 *
 *
 * @param {Array} list List of values to select a value from
 * @param {number} [initialIndex=0] Initial index which is selected
 * @returns {handler}
 */
function useSelect(list, initialIndex = 0) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  /**
   *
   * @param {*} item The item to select as
   */
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

export { useSelect };
