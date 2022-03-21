"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_hooks_1 = require("@testing-library/react-hooks");
var useSelect_1 = require("../hooks/useSelect");
describe("useSelect", function () {
  test("should return correct value at index", function () {
    var array = [1, 2];
    var _a = (0, react_hooks_1.renderHook)(function () {
        return (0, useSelect_1.useSelect)(array, 0);
      }),
      result = _a.result,
      rerender = _a.rerender;
    // test memo
    var incrementByBeforeRerender = result.current.setItem;
    rerender();
    var incrementByAfterRerender = result.current.setItem;
    expect(incrementByBeforeRerender).toBe(incrementByAfterRerender);
    // assertions
    expect(result.current.index).toBe(0);
    expect(result.current.item).toBe(1);
    // should be reactive to the latest memo list
    (0, react_hooks_1.act)(function () {
      array = [1, 2, 5];
      rerender();
    });
    (0, react_hooks_1.act)(function () {
      result.current.setItem(5);
    });
    // assertions
    expect(result.current.index).toBe(2);
    expect(result.current.item).toBe(5);
  });
});
