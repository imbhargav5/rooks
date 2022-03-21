"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFullscreen = void 0;
var react_1 = require("react");
var useDocumentEventListener_1 = require("./useDocumentEventListener");
var warning_1 = require("./warning");
var getFullscreenControls = function () {
  var functionMap = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror",
    ],
    // New WebKit
    [
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    // Old WebKit
    [
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror",
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError",
    ],
  ];
  var returnValue = {};
  functionMap.forEach(function (functionSet) {
    if (functionSet && functionSet[1] in document) {
      functionSet.forEach(function (_function, index) {
        returnValue[functionMap[0][index]] = functionSet[index];
      });
    }
  });
  return returnValue;
};
var noop = function () {};
var defaultValue = {
  // isFullscreen
  element: undefined,
  // request
  exit: noop,
  isEnabled: false,
  // exit
  isFullscreen: false,
  // toggle
  onChange: noop,
  // onchange
  onError: noop,
  // onerror
  request: noop,
  toggle: noop,
};
function warnDeprecatedOnChangeAndOnErrorUsage() {
  (0, warning_1.warning)(
    false,
    "Using onChange and onError from the return value is deprecated and \n    will be removed in the next major version. \n    Please use it with arguments instead. \n    For eg: useFullscreen({onChange: function() {}, onError: function(){}})\n  "
  );
}
/**
 * useFullscreen
 * A hook that helps make the document fullscreen
 */
function useFullscreen(options) {
  var _this = this;
  if (options === void 0) {
    options = {};
  }
  if (typeof window === "undefined") {
    console.warn("useFullscreen: window is undefined.");
    return defaultValue;
  }
  var onChangeArgument = options.onChange,
    onErrorArgument = options.onError,
    _a = options.requestFullscreenOptions,
    requestFullscreenOptions = _a === void 0 ? {} : _a;
  var fullscreenControls = getFullscreenControls();
  var _b = (0, react_1.useState)(
      Boolean(document[fullscreenControls.fullscreenElement])
    ),
    isFullscreen = _b[0],
    setIsFullscreen = _b[1];
  var _c = (0, react_1.useState)(
      document[fullscreenControls.fullscreenElement]
    ),
    element = _c[0],
    setElement = _c[1];
  var request = (0, react_1.useCallback)(function (element) {
    return __awaiter(_this, void 0, void 0, function () {
      var finalElement, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            finalElement = element || document.documentElement;
            return [
              4 /*yield*/,
              finalElement[fullscreenControls.requestFullscreen](
                requestFullscreenOptions
              ),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_1 = _a.sent();
            console.log(error_1);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  }, []);
  var exit = (0, react_1.useCallback)(
    function () {
      return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!element) return [3 /*break*/, 4];
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [
                4 /*yield*/,
                document[fullscreenControls.exitFullscreen](),
              ];
            case 2:
              return [2 /*return*/, _a.sent()];
            case 3:
              error_2 = _a.sent();
              console.warn(error_2);
              return [3 /*break*/, 4];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [element]
  );
  var toggle = (0, react_1.useCallback)(
    function (newElement) {
      return Boolean(element)
        ? exit()
        : newElement
        ? request(newElement)
        : null;
    },
    [element]
  );
  var onChangeDeprecatedHandlerRef = (0, react_1.useRef)(noop);
  var onErrorDeprecatedHandlerRef = (0, react_1.useRef)(noop);
  // Hack to not break it for everyone
  // Honestly these two functions are tragedy and must be removed in v5
  var onChangeDeprecated = (0, react_1.useCallback)(function (callback) {
    warnDeprecatedOnChangeAndOnErrorUsage();
    return (onChangeDeprecatedHandlerRef.current = callback);
  }, []);
  var onErrorDeprecated = (0, react_1.useCallback)(function (callback) {
    warnDeprecatedOnChangeAndOnErrorUsage();
    return (onErrorDeprecatedHandlerRef.current = callback);
  }, []);
  (0, useDocumentEventListener_1.useDocumentEventListener)(
    fullscreenControls.fullscreenchange,
    function (event) {
      var _a;
      var currentFullscreenElement =
        document[fullscreenControls.fullscreenElement];
      var isOpen = Boolean(currentFullscreenElement);
      if (isOpen) {
        // fullscreen was enabled
        setIsFullscreen(true);
        setElement(currentFullscreenElement);
      } else {
        // fullscreen was disabled
        setIsFullscreen(false);
        setElement(null);
      }
      onChangeArgument === null || onChangeArgument === void 0
        ? void 0
        : onChangeArgument.call(document, event, isOpen);
      (_a = onChangeDeprecatedHandlerRef.current) === null || _a === void 0
        ? void 0
        : _a.call(document, event, isOpen);
    }
  );
  (0, useDocumentEventListener_1.useDocumentEventListener)(
    fullscreenControls.fullscreenerror,
    function (event) {
      var _a;
      onErrorArgument === null || onErrorArgument === void 0
        ? void 0
        : onErrorArgument.call(document, event);
      (_a = onErrorDeprecatedHandlerRef.current) === null || _a === void 0
        ? void 0
        : _a.call(document, event);
    }
  );
  return {
    element: element,
    exit: exit,
    isEnabled: Boolean(document[fullscreenControls.fullscreenEnabled]),
    isFullscreen: isFullscreen,
    onChange: onChangeDeprecated,
    onError: onErrorDeprecated,
    request: request,
    toggle: toggle,
  };
}
exports.useFullscreen = useFullscreen;
