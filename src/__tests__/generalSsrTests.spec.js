"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
var react_hooks_1 = require("@testing-library/react-hooks");
var useOnWindowResize_1 = require("../hooks/useOnWindowResize");
var useOnWindowScroll_1 = require("../hooks/useOnWindowScroll");
var useIntervalWhen_1 = require("../hooks/useIntervalWhen");
var useFullscreen_1 = require("../hooks/useFullscreen");
var useLocalstorage_1 = require("../hooks/useLocalstorage");
var useLocalstorageState_1 = require("../hooks/useLocalstorageState");
var useOnline_1 = require("../hooks/useOnline");
var useSessionstorage_1 = require("../hooks/useSessionstorage");
var useThrottle_1 = require("../hooks/useThrottle");
describe("when window is undefined", function () {
  var mockCallback = jest.fn(function () {});
  var consoleSpy;
  beforeEach(function () {
    consoleSpy = jest.spyOn(console, "warn").mockImplementation(function () {});
  });
  afterEach(function () {
    consoleSpy.mockClear();
  });
  it("useOnWindowResize logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useOnWindowResize_1.useOnWindowResize)(mockCallback);
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useOnWindowScroll logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useOnWindowScroll_1.useOnWindowScroll)(mockCallback);
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useIntervalWhen logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useIntervalWhen_1.useIntervalWhen)(mockCallback);
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useFullscreen logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useFullscreen_1.useFullscreen)();
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useLocalstorage logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useLocalstorage_1.useLocalstorage)("test");
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useLocalstorageState logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useLocalstorageState_1.useLocalstorageState)("test");
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useOnline logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useOnline_1.useOnline)();
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useSessionstorage logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useSessionstorage_1.useSessionstorage)("test");
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  it("useThrottle logs warning", function () {
    (0, react_hooks_1.renderHook)(function () {
      return (0, useThrottle_1.useThrottle)(mockCallback);
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
