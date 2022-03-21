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
exports.useQueueState = void 0;
var react_1 = require("react");
function useQueueState(initialList) {
  var _a = (0, react_1.useState)(__spreadArray([], initialList, true)),
    list = _a[0],
    setList = _a[1];
  var enqueue = (0, react_1.useCallback)(
    function (item) {
      var newList = __spreadArray(__spreadArray([], list, true), [item], false);
      setList(newList);
      return newList.length;
    },
    [list]
  );
  var dequeue = (0, react_1.useCallback)(
    function () {
      if (list.length > 0) {
        var firstItem = list[0];
        setList(__spreadArray([], list.slice(1), true));
        return firstItem;
      }
      return undefined;
    },
    [list]
  );
  var peek = (0, react_1.useCallback)(
    function () {
      if (list.length > 0) {
        return list[0];
      }
      return undefined;
    },
    [list]
  );
  var controls = {
    dequeue: dequeue,
    enqueue: enqueue,
    length: list.length,
    peek: peek,
  };
  return [list, controls];
}
exports.useQueueState = useQueueState;
