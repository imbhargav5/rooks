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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var useRaf_1 = require("../hooks/useRaf");
var react_2 = __importStar(require("react"));
var act = react_test_renderer_1.default.act;
describe("useRaf", function () {
  var mockCallback;
  var TestJSX;
  var angle = 0;
  function updateAngle() {
    angle = (angle + 2) % 360;
    return (angle * Math.PI) / 180;
  }
  function App() {
    var canvasRef = (0, react_2.useRef)(null);
    (0, useRaf_1.useRaf)(function () {
      if (canvasRef && canvasRef.current) {
        var screenRatio = window.devicePixelRatio || 1;
        var angle_1 = updateAngle();
        var canvas = canvasRef.current;
        if (canvas) var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(screenRatio, screenRatio);
        ctx.fillStyle = "midnightblue";
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.translate(50, 50);
        ctx.rotate(angle_1);
        ctx.fillRect(-20, -20, 40, 40);
        ctx.restore();
      }
    }, true);
    return react_2.default.createElement("canvas", {
      ref: canvasRef,
      style: { height: "100px", width: "100%", background: "grey" },
    });
  }
  beforeEach(function () {
    mockCallback = jest.fn(function () {});
    TestJSX = App;
  });
  it("should be defined", function () {
    expect(useRaf_1.useRaf).toBeDefined();
  });
  it("should render", function () {
    var container = (0, react_1.render)(
      react_2.default.createElement(TestJSX, null)
    ).container;
    expect(container).toBeDefined();
  });
});
