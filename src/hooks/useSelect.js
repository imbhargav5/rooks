"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelect = void 0;
var react_1 = require("react");
/**
 * useSelect hook
 * Helps easily select a value from a list of values
 *
 * @param list List of values to select a value from
 * @param [initialIndex=0] Initial index which is selected
 * @returns handler
 */
function useSelect(list, initialIndex) {
  if (initialIndex === void 0) {
    initialIndex = 0;
  }
  var _a = (0, react_1.useState)(initialIndex),
    selectedIndex = _a[0],
    setSelectedIndex = _a[1];
  var setItem = (0, react_1.useCallback)(
    function (item) {
      setSelectedIndex(list.indexOf(item));
    },
    [list]
  );
  return {
    index: selectedIndex,
    item: list[selectedIndex],
    setIndex: setSelectedIndex,
    setItem: setItem,
  };
}
exports.useSelect = useSelect;
