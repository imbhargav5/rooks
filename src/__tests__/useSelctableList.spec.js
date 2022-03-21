"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hooks_1 = require("@testing-library/react-hooks");
var useSelectableList_1 = require("../hooks/useSelectableList");
jest.spyOn(console, "warn").mockImplementation(jest.fn);
describe("useSelctableList", function () {
  afterEach(function () {
    console.warn.mockReset();
  });
  var result = (0, react_hooks_1.renderHook)(function () {
    return (0, useSelectableList_1.useSelectableList)([1, 2, 3]);
  }).result;
  describe("matchSelection", function () {
    test("console.warn", function () {
      (0, react_hooks_1.act)(function () {
        result.current[1].matchSelection({ index: 1, value: 2 });
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "matchSelection. Expected either index or value to be provided. However all were provided"
      );
      (0, react_hooks_1.act)(function () {
        result.current[1].matchSelection({});
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "matchSelection. index , value are all undefined."
      );
    });
    test("match index", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      expect(internalResult.current[1].matchSelection({ index: 0 })).toBe(true);
      expect(internalResult.current[1].matchSelection({ index: 1 })).toBe(
        false
      );
    });
    test("match value", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      expect(internalResult.current[1].matchSelection({ value: 1 })).toBe(true);
      expect(internalResult.current[1].matchSelection({ value: 2 })).toBe(
        false
      );
    });
  });
  describe("updateSelection", function () {
    test("set by index", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].updateSelection({ index: 1 })();
      });
      var _a = internalResult.current[0],
        currentIndex = _a[0],
        currentValue = _a[1];
      expect(currentIndex).toBe(1);
      expect(currentValue).toBe(2);
    });
    test("set by value", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].updateSelection({ value: 2 })();
      });
      var _a = internalResult.current[0],
        currentIndex = _a[0],
        currentValue = _a[1];
      expect(currentIndex).toBe(1);
      expect(currentValue).toBe(2);
    });
    test("set by value fail", function () {
      var _a = result.current[0],
        beforeIndex = _a[0],
        beforeValue = _a[1];
      (0, react_hooks_1.act)(function () {
        result.current[1].updateSelection({ value: 22 })();
      });
      var _b = result.current[0],
        afterIndex = _b[0],
        afterValue = _b[1];
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "updateSelection failed. Does the value 22 exist in the list?"
      );
      console.warn.mockReset();
      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
    });
    test("console.warn", function () {
      (0, react_hooks_1.act)(function () {
        result.current[1].updateSelection({ index: 1, value: 2 })();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "updateSelection. Expected either index or value to be provided. However all were provided"
      );
      (0, react_hooks_1.act)(function () {
        result.current[1].updateSelection({})();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "updateSelection. index , value are all undefined."
      );
    });
  });
  describe("toggleSelection", function () {
    test("should toggle selected index", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].toggleSelection({ index: 0 })();
      });
      var _a = internalResult.current[0],
        currentIndex = _a[0],
        currentValue = _a[1];
      expect(currentIndex).toBe(-1);
      expect(currentValue).toBe(undefined);
    });
    test("shouldn't toggle selected index when allowUnselected = false", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, false);
      }).result;
      var _a = internalResult.current[0],
        beforeIndex = _a[0],
        beforeValue = _a[1];
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].toggleSelection({ index: 0 })();
      });
      var _b = internalResult.current[0],
        afterIndex = _b[0],
        afterValue = _b[1];
      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "allowUnselected is false. Cannot unselect item"
      );
      console.warn.mockReset();
    });
    test("should toggle selected value", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, true);
      }).result;
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].toggleSelection({ value: 1 })();
      });
      var _a = internalResult.current[0],
        currentIndex = _a[0],
        currentValue = _a[1];
      expect(currentIndex).toBe(-1);
      expect(currentValue).toBe(undefined);
    });
    test("shouldn't toggle selected value when allowUnselected", function () {
      var internalResult = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelectableList_1.useSelectableList)([1, 2, 3], 0, false);
      }).result;
      var _a = internalResult.current[0],
        beforeIndex = _a[0],
        beforeValue = _a[1];
      (0, react_hooks_1.act)(function () {
        internalResult.current[1].toggleSelection({ value: 1 })();
      });
      var _b = internalResult.current[0],
        afterIndex = _b[0],
        afterValue = _b[1];
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "allowUnselected is false. Cannot unselect item"
      );
      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
      console.warn.mockReset();
    });
    test("console.warn", function () {
      (0, react_hooks_1.act)(function () {
        result.current[1].toggleSelection({ index: 1, value: 2 })();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "toggleSelection. Expected either index or value to be provided. However all were provided"
      );
      (0, react_hooks_1.act)(function () {
        result.current[1].toggleSelection({})();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "toggleSelection. index , value are all undefined."
      );
    });
  });
});
