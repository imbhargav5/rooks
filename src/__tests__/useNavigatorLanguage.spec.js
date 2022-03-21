"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useNavigatorLanguage_1 = require("../hooks/useNavigatorLanguage");
describe("useNavigatorLanguage", function () {
  var languageGetter;
  beforeEach(function () {
    languageGetter = jest.spyOn(window.navigator, "language", "get");
  });
  it("should be defined", function () {
    expect(useNavigatorLanguage_1.useNavigatorLanguage).toBeDefined();
  });
  it("should get the navigator language", function () {
    languageGetter.mockReturnValue("de");
    var result = (0, react_hooks_1.renderHook)(function () {
      return (0, useNavigatorLanguage_1.useNavigatorLanguage)();
    }).result;
    expect(result.current).toBe("de");
  });
});
