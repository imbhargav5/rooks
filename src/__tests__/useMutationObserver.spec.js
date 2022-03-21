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
var react_1 = require("@testing-library/react");
var react_2 = __importStar(require("react"));
var useMutationObserver_1 = require("../hooks/useMutationObserver");
describe("useMutationObserver", function () {
  test("should watch for children changes being made to the DOM node", function () {
    var id = 1;
    function TestComp() {
      var ref = (0, react_2.useRef)(null);
      var addTodo = function () {
        var _a;
        var todo = document.createElement("li");
        id += 1;
        todo.textContent = "todo ".concat(id);
        (_a = ref.current) === null || _a === void 0
          ? void 0
          : _a.appendChild(todo);
      };
      (0, useMutationObserver_1.useMutationObserver)(ref, function (mutations) {
        for (
          var _i = 0, mutations_1 = mutations;
          _i < mutations_1.length;
          _i++
        ) {
          var mutation = mutations_1[_i];
          if (mutation.type === "childList" && mutation.addedNodes) {
            mutation.addedNodes.forEach(function (node) {
              console.log(
                "".concat(node.textContent, " has been added to todo list.")
              );
            });
          }
        }
      });
      return react_2.default.createElement(
        "div",
        null,
        react_2.default.createElement(
          "ul",
          { ref: ref },
          react_2.default.createElement("li", null, "todo ", id)
        ),
        react_2.default.createElement(
          "button",
          { onClick: addTodo, type: "button" },
          "Add Todo"
        )
      );
    }
    (0, react_1.render)(react_2.default.createElement(TestComp, null));
    var button = react_1.screen.getByText(/add todo/i);
    react_1.fireEvent.click(button);
    expect(react_1.screen.getAllByRole("listitem")).toHaveLength(2);
  });
  test("should observe the same DOM node multiple times when provide multiple listeners", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      function TestComp() {
        var ref = (0, react_2.useRef)(null);
        (0, useMutationObserver_1.useMutationObserver)(ref, listener1);
        (0, useMutationObserver_1.useMutationObserver)(ref, listener2);
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement("div", { ref: ref }, "status: coding"),
          react_2.default.createElement(
            "button",
            {
              onClick: function () {
                if (ref.current) {
                  ref.current.textContent = "status: Gaming";
                }
              },
              type: "button",
            },
            "Start to play game!"
          )
        );
      }
      var listener1, listener2, button;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.hasAssertions();
            listener1 = jest.fn();
            listener2 = jest.fn();
            (0, react_1.render)(react_2.default.createElement(TestComp, null));
            button = react_1.screen.getByText(/start to play game!/i);
            react_1.fireEvent.click(button);
            return [
              4 /*yield*/,
              (0, react_1.waitFor)(function () {
                expect(listener1).toHaveBeenCalled();
                expect(listener2).toHaveBeenCalled();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  test("should observe the DOM node multiple times even if the listener is same", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      function TestComp() {
        var ref = (0, react_2.useRef)(null);
        var listener = function () {
          calls++;
        };
        (0, useMutationObserver_1.useMutationObserver)(ref, listener);
        (0, useMutationObserver_1.useMutationObserver)(ref, listener);
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement("div", { ref: ref }, "status: coding"),
          react_2.default.createElement(
            "button",
            {
              onClick: function () {
                if (ref.current) {
                  ref.current.textContent = "status: Gaming";
                }
              },
              type: "button",
            },
            "Start to play game!"
          )
        );
      }
      var calls, button;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.hasAssertions();
            calls = 0;
            (0, react_1.render)(react_2.default.createElement(TestComp, null));
            button = react_1.screen.getByText(/start to play game!/i);
            react_1.fireEvent.click(button);
            return [
              4 /*yield*/,
              (0, react_1.waitFor)(function () {
                expect(calls).toBe(2);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  test("should stop the MutationObserver instance from receiving further notifications", function () {
    return __awaiter(void 0, void 0, void 0, function () {
      function TestComp() {
        var ref = (0, react_2.useRef)(null);
        var listener = function (_, observer) {
          if (calls === 1) {
            observer.disconnect();
          }
          calls++;
        };
        (0, useMutationObserver_1.useMutationObserver)(ref, listener);
        return react_2.default.createElement(
          "div",
          null,
          react_2.default.createElement("div", { ref: ref }, "status: coding"),
          react_2.default.createElement(
            "button",
            {
              onClick: function () {
                if (ref.current) {
                  ref.current.textContent = "status: Gaming";
                }
              },
              type: "button",
            },
            "Start to play game!"
          )
        );
      }
      var calls, button;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            expect.hasAssertions();
            calls = 0;
            (0, react_1.render)(react_2.default.createElement(TestComp, null));
            button = react_1.screen.getByText(/start to play game!/i);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            return [
              4 /*yield*/,
              (0, react_1.waitFor)(function () {
                expect(calls).toBe(1);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
});
