"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment jsdom
 */
var react_1 = require("@testing-library/react");
var react_2 = __importStar(require("react"));
var useOutsideClickRef_1 = require("../hooks/useOutsideClickRef");
var VolumeOn = function () {
  return react_2.default.createElement(
    "svg",
    {
      fill: "none",
      stroke: "currentColor",
      width: "60",
      height: "60",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    },
    react_2.default.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
    })
  );
};
var VolumeOff = function () {
  return react_2.default.createElement(
    "svg",
    {
      fill: "none",
      width: "60",
      height: "60",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    },
    react_2.default.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
      clipRule: "evenodd",
    }),
    react_2.default.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2",
    })
  );
};
var Button = function () {
  var _a = (0, react_2.useState)(false),
    clicked = _a[0],
    setClicked = _a[1];
  return react_2.default.createElement(
    "div",
    {
      onClick: function () {
        return setClicked(!clicked);
      },
      "data-testid": "button",
    },
    clicked
      ? react_2.default.createElement(VolumeOn, null)
      : react_2.default.createElement(VolumeOff, null)
  );
};
describe("useOutsideClickRef", function () {
  var App;
  beforeEach(function () {
    App = function () {
      var _a = (0, react_2.useState)(""),
        message = _a[0],
        setMessage = _a[1];
      var ref = (0, useOutsideClickRef_1.useOutsideClickRef)(callback)[0];
      function callback() {
        setMessage("clicked outside");
      }
      return react_2.default.createElement(
        "div",
        {
          className: "App",
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          "data-testid": "app",
        },
        react_2.default.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              backgroundColor: "lightblue",
            },
          },
          react_2.default.createElement(
            "div",
            {
              className: "inside",
              style: { backgroundColor: "lightgreen" },
              ref: ref,
            },
            react_2.default.createElement("h2", null, "This is inside"),
            react_2.default.createElement(Button, null)
          )
        ),
        react_2.default.createElement(
          "div",
          { "data-testid": "message" },
          message
        )
      );
    };
  });
  afterEach(react_1.cleanup);
  it("should be defined", function () {
    expect(useOutsideClickRef_1.useOutsideClickRef).toBeDefined();
  });
  it("should trigger the calback when click on outide", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var app = (0, react_1.getByTestId)(container, "app");
    var message = (0, react_1.getByTestId)(container, "message");
    (0, react_1.act)(function () {
      react_1.fireEvent.click(app);
    });
    expect(message.innerHTML).toBe("clicked outside");
  });
  it("should not trigger the calback when click the volumn button (inside)", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(App, null)
    ).container;
    var button = (0, react_1.getByTestId)(container, "button");
    var message = (0, react_1.getByTestId)(container, "message");
    (0, react_1.act)(function () {
      react_1.fireEvent.click(button);
    });
    expect(message.innerHTML).toBe("");
  });
});
