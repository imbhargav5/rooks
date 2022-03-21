"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStackState = void 0;
var react_1 = require("react");
function useStackState(initialList) {
  var _a = (0, react_1.useState)(__spreadArray([], initialList, true)),
    list = _a[0],
    setList = _a[1];
  var length = list.length;
  var listInReverse = (0, react_1.useMemo)(
    function () {
      var reverseList = __spreadArray([], list, true);
      reverseList.reverse();
      return reverseList;
    },
    [list]
  );
  var push = (0, react_1.useCallback)(
    function (item) {
      var newList = __spreadArray(__spreadArray([], list, true), [item], false);
      setList(newList);
      return newList.length;
    },
    [list]
  );
  var pop = (0, react_1.useCallback)(
    function () {
      if (list.length > 0) {
        var lastItem = list[list.length - 1];
        setList(__spreadArray([], list.slice(0, list.length - 1), true));
        return lastItem;
      }
      return undefined;
    },
    [list]
  );
  var peek = (0, react_1.useCallback)(
    function () {
      if (list.length > 0) {
        return list[list.length - 1];
      }
      return undefined;
    },
    [list]
  );
  var clear = function () {
    return setList([]);
  };
  var isEmpty = (0, react_1.useCallback)(
    function () {
      return list.length === 0;
    },
    [list]
  );
  var controls = {
    clear: clear,
    isEmpty: isEmpty,
    length: length,
    peek: peek,
    pop: pop,
    push: push,
  };
  return [list, controls, listInReverse];
}
exports.useStackState = useStackState;
