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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_2 = __importDefault(require("react"));
var useGeolocation_1 = require("../hooks/useGeolocation");
describe("useGeolocation", function () {
  var App;
  beforeEach(function () {
    App = function (_a) {
      var customRef = _a.customRef;
      var _b = react_2.default.useState(false),
        when = _b[0],
        setWhen = _b[1];
      var geoObject = (0, useGeolocation_1.useGeolocation)({ when: when });
      react_2.default.useEffect(function () {
        if (typeof customRef === "undefined") return;
        customRef.current++;
      });
      return react_2.default.createElement(
        "div",
        { className: "App" },
        react_2.default.createElement(
          "button",
          {
            "data-testid": "get-geolocation-btn",
            onClick: function () {
              setWhen(true);
            },
            type: "button",
          },
          "Get Geolocation"
        ),
        react_2.default.createElement(
          "p",
          { "data-testid": "geo-info" },
          geoObject && JSON.stringify(geoObject)
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("click on get geolocation gives geolocation", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var mockGeolocation, getGeolocationButton, geoInfoPElement, geoObject;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(4);
            mockGeolocation = {
              getCurrentPosition: jest
                .fn()
                .mockImplementationOnce(function (success) {
                  return success({
                    coords: { latitude: 51.1, longitude: 45.3 },
                  });
                }),
            };
            Object.defineProperty(global.navigator, "geolocation", {
              value: mockGeolocation,
              writable: true,
            });
            (0, react_1.render)(react_2.default.createElement(App, null));
            getGeolocationButton = react_1.screen.getByTestId(
              "get-geolocation-btn"
            );
            (0, react_1.act)(function () {
              react_1.fireEvent.click(getGeolocationButton);
            });
            return [4 /*yield*/, react_1.screen.findByTestId("geo-info")];
          case 1:
            geoInfoPElement = _a.sent();
            geoObject = JSON.parse(geoInfoPElement.innerHTML);
            expect("".concat(geoObject.lat)).toBe("51.1");
            expect("".concat(geoObject.lng)).toBe("45.3");
            expect(geoObject.isError).toBe(false);
            expect(geoObject.message).toBe("");
            return [2 /*return*/];
        }
      });
    });
  });
  it("render should not happen infinitely, when 'when' attribute changes to true", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      function TestComp() {
        customRef = react_2.default.useRef(0);
        return react_2.default.createElement(App, { customRef: customRef });
      }
      var customRef, getGeolocationButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.hasAssertions();
            (0, react_1.render)(react_2.default.createElement(TestComp, null));
            getGeolocationButton = react_1.screen.getByTestId(
              "get-geolocation-btn"
            );
            (0, react_1.act)(function () {
              react_1.fireEvent.click(getGeolocationButton);
            });
            return [
              4 /*yield*/,
              (0, react_1.waitFor)(function () {
                return expect(customRef.current).toBe(2);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  // GeolocationPositionError - https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
  it("should return error if user denied Geolocation", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var PERMISSION_DENIED_ERROR,
        mockGeolocation,
        getGeolocationButton,
        geoInfoPElement,
        geoObject;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(2);
            PERMISSION_DENIED_ERROR = new Error("User denied Geolocation");
            mockGeolocation = {
              getCurrentPosition: jest
                .fn()
                .mockImplementationOnce(function (_, errorCallback) {
                  return errorCallback(PERMISSION_DENIED_ERROR);
                }),
            };
            Object.defineProperty(global.navigator, "geolocation", {
              value: mockGeolocation,
              writable: true,
            });
            (0, react_1.render)(react_2.default.createElement(App, null));
            getGeolocationButton = react_1.screen.getByTestId(
              "get-geolocation-btn"
            );
            (0, react_1.act)(function () {
              react_1.fireEvent.click(getGeolocationButton);
            });
            return [4 /*yield*/, react_1.screen.findByTestId("geo-info")];
          case 1:
            geoInfoPElement = _a.sent();
            geoObject = JSON.parse(geoInfoPElement.innerHTML);
            expect(geoObject.isError).toBe(true);
            expect(geoObject.message).toBe("User denied Geolocation");
            return [2 /*return*/];
        }
      });
    });
  });
  it("should return error if browser does not support Geolocation", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var getGeolocationButton, geoInfoPElement, geoObject;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.assertions(2);
            Object.defineProperty(global.navigator, "geolocation", {
              value: undefined,
              writable: false,
            });
            (0, react_1.render)(react_2.default.createElement(App, null));
            getGeolocationButton = react_1.screen.getByTestId(
              "get-geolocation-btn"
            );
            (0, react_1.act)(function () {
              react_1.fireEvent.click(getGeolocationButton);
            });
            return [4 /*yield*/, react_1.screen.findByTestId("geo-info")];
          case 1:
            geoInfoPElement = _a.sent();
            geoObject = JSON.parse(geoInfoPElement.innerHTML);
            expect(geoObject.isError).toBe(true);
            expect(geoObject.message).toBe(
              "Geolocation is not supported for this Browser/OS."
            );
            return [2 /*return*/];
        }
      });
    });
  });
});
