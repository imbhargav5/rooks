"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMapState = void 0;
var react_1 = require("react");
/**
 * useMapState hook
 * A hook to manage state in the form of a map or object.
 *
 * @param initialValue Initial value of the map
 */
function useMapState(initialValue) {
  var _a = (0, react_1.useState)(initialValue),
    map = _a[0],
    setMap = _a[1];
  var set = (0, react_1.useCallback)(function (key, value) {
    setMap(function (currentMap) {
      var _a;
      return __assign(
        __assign({}, currentMap),
        ((_a = {}), (_a[key] = value), _a)
      );
    });
  }, []);
  var has = (0, react_1.useCallback)(
    function (key) {
      return typeof map[key] !== "undefined";
    },
    [map]
  );
  var setMultiple = (0, react_1.useCallback)(function (object) {
    setMap(function (currentMap) {
      return __assign(__assign({}, currentMap), object);
    });
  }, []);
  var removeMultiple = (0, react_1.useCallback)(function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      keys[_i] = arguments[_i];
    }
    setMap(function (currentMap) {
      var newMap = {};
      Object.keys(currentMap).forEach(function (key) {
        if (!keys.includes(key)) {
          newMap[key] = currentMap[key];
        }
      });
      return newMap;
    });
  }, []);
  var remove = (0, react_1.useCallback)(function (key) {
    setMap(function (currentMap) {
      var newMap = {};
      Object.keys(currentMap).forEach(function (mapKey) {
        if (mapKey !== key) {
          newMap[mapKey] = currentMap[mapKey];
        }
      });
      return newMap;
    });
  }, []);
  var removeAll = (0, react_1.useCallback)(function () {
    setMap({});
  }, []);
  var controls = {
    has: has,
    remove: remove,
    removeAll: removeAll,
    removeMultiple: removeMultiple,
    set: set,
    setMultiple: setMultiple,
  };
  return [map, controls];
}
exports.useMapState = useMapState;
