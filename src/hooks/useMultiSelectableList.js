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
exports.useMultiSelectableList = void 0;
/* eslint-disable no-negated-condition */
var react_1 = require("react");
function warnIfBothValueAndIndexAreProvided(functionName, object) {
  if (
    Object.values(object).every(function (v) {
      return typeof v !== "undefined";
    })
  ) {
    console.warn(
      ""
        .concat(functionName, ". Expected either ")
        .concat(
          Object.keys(object).join(" or "),
          " to be provided. However all were provided"
        )
    );
  } else if (
    Object.values(object).every(function (v) {
      return typeof v === "undefined";
    })
  ) {
    console.warn(
      ""
        .concat(functionName, ". ")
        .concat(Object.keys(object).join(" , "), " are all undefined.")
    );
  }
}
/**
 * useMultiSelectableList
 * A custom hook to easily select multiple values from a list
 *
 * @param list
 * @param initialSelectIndices
 * @param allowUnselected
 */
function useMultiSelectableList(list, initialSelectIndices, allowUnselected) {
  if (list === void 0) {
    list = [];
  }
  if (initialSelectIndices === void 0) {
    initialSelectIndices = [0];
  }
  if (allowUnselected === void 0) {
    allowUnselected = false;
  }
  var _a = (0, react_1.useState)(initialSelectIndices),
    currentIndices = _a[0],
    setCurrentIndices = _a[1];
  var currentValues = currentIndices.map(function (index) {
    return list[index];
  });
  var selection = [currentIndices, currentValues];
  var updateSelections = function (_a) {
    var indices = _a.indices,
      values = _a.values;
    return function () {
      warnIfBothValueAndIndexAreProvided("updateSelections", {
        indices: indices,
        values: values,
      });
      if (typeof indices !== "undefined") {
        if (!allowUnselected && indices.length === 0) {
          console.warn("updateSelections failed. indices is an empty list.");
          return;
        }
        setCurrentIndices(indices);
      } else if (typeof values !== "undefined") {
        var valueIndices = list.reduce(function (accumulator, current, index) {
          if (values.includes(current)) {
            var array = __spreadArray(
              __spreadArray([], accumulator, true),
              [index],
              false
            );
            return array;
          }
          return accumulator;
        }, []);
        if (valueIndices.length > 0) {
          setCurrentIndices(valueIndices);
        } else if (allowUnselected) {
          setCurrentIndices(valueIndices);
        } else {
          console.warn(
            "updateSelections failed. Do the values exist in the list?"
          );
        }
      }
    };
  };
  var toggleSelectionByIndex = (0, react_1.useCallback)(
    function (index) {
      var newIndices;
      if (!currentIndices.includes(index)) {
        newIndices = __spreadArray(
          __spreadArray([], currentIndices, true),
          [index],
          false
        );
      } else {
        newIndices = __spreadArray([], currentIndices, true);
        var indexOfIndex = currentIndices.indexOf(index);
        if (indexOfIndex !== -1) {
          newIndices.splice(indexOfIndex, 1);
        }
      }
      if (newIndices.length > 0) {
        setCurrentIndices(newIndices);
      } else if (allowUnselected) {
        setCurrentIndices(newIndices);
      } else {
        console.warn(
          "toggleSelection failed. Do the values exist in the list?"
        );
      }
    },
    [allowUnselected, currentIndices]
  );
  var toggleSelection = (0, react_1.useCallback)(
    function (_a) {
      var index = _a.index,
        value = _a.value;
      return function () {
        warnIfBothValueAndIndexAreProvided("toggleSelection", {
          index: index,
          value: value,
        });
        if (typeof index !== "undefined") {
          toggleSelectionByIndex(index);
        } else if (typeof value !== "undefined") {
          var valueIndex = list.indexOf(value);
          if (valueIndex > -1) {
            toggleSelectionByIndex(valueIndex);
          }
        }
      };
    },
    [list, toggleSelectionByIndex]
  );
  var matchSelection = (0, react_1.useCallback)(
    function (_a) {
      var index = _a.index,
        value = _a.value;
      warnIfBothValueAndIndexAreProvided("matchSelection", {
        index: index,
        value: value,
      });
      if (typeof index !== "undefined") {
        return currentIndices.includes(index);
      } else if (typeof value !== "undefined") {
        return currentValues.includes(value);
      }
    },
    [currentIndices, currentValues]
  );
  var controls = {
    matchSelection: matchSelection,
    toggleSelection: toggleSelection,
    updateSelections: updateSelections,
  };
  return [selection, controls];
}
exports.useMultiSelectableList = useMultiSelectableList;
