import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useToggle } from "../hooks/useToggle";

describe("useToggle", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useToggle).toBeDefined();
  });

  describe("default boolean toggle", () => {
    it("should initialize with false by default", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle());

      expect(result.current[0]).toBe(false);
    });

    it("should toggle from false to true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle());

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(true);
    });

    it("should toggle from true to false", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(false);
    });

    it("should toggle multiple times", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[1](undefined); // true
        result.current[1](undefined); // false
        result.current[1](undefined); // true
        result.current[1](undefined); // false
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe("boolean with initial value", () => {
    it("should initialize with true", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(true));

      expect(result.current[0]).toBe(true);
    });

    it("should initialize with false", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(false));

      expect(result.current[0]).toBe(false);
    });
  });

  describe("non-boolean values", () => {
    it("should toggle string values with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle("hello"));

      expect(result.current[0]).toBe("hello");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(false);
    });

    it("should toggle number values with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(1));

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(false);
    });

    it("should toggle zero with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(0));

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(true);
    });

    it("should toggle null with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(null));

      expect(result.current[0]).toBe(null);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(true);
    });

    it("should toggle undefined with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(undefined));

      // Initially becomes false due to default value casting
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](undefined);
      });

      // After toggle, !false = true
      expect(result.current[0]).toBe(true);
    });

    it("should toggle empty string with default toggle function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(""));

      expect(result.current[0]).toBe("");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe("custom toggle function", () => {
    it("should use custom toggle function for strings", () => {
      expect.hasAssertions();
      const toggleFunction = (value: string) => 
        value === "on" ? "off" : "on";
      
      const { result } = renderHook(() => 
        useToggle("on", toggleFunction)
      );

      expect(result.current[0]).toBe("on");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe("off");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe("on");
    });

    it("should use custom toggle function for numbers", () => {
      expect.hasAssertions();
      const toggleFunction = (value: number) => 
        value === 1 ? 0 : 1;
      
      const { result } = renderHook(() => 
        useToggle(1, toggleFunction)
      );

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(1);
    });

    it("should use custom toggle function with objects", () => {
      expect.hasAssertions();
      type State = { active: boolean };
      const state1: State = { active: true };
      const state2: State = { active: false };
      
      const toggleFunction = (value: State) => 
        value.active ? state2 : state1;
      
      const { result } = renderHook(() => 
        useToggle(state1, toggleFunction)
      );

      expect(result.current[0]).toBe(state1);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(state2);

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(state1);
    });

    it("should pass action parameter to custom toggle function", () => {
      expect.hasAssertions();
      const toggleFunction = jest.fn((value: string, action?: unknown) => 
        action === "force-on" ? "on" : (value === "on" ? "off" : "on")
      );
      
      const { result } = renderHook(() => 
        useToggle("off", toggleFunction)
      );

      act(() => {
        result.current[1]("force-on");
      });

      expect(toggleFunction).toHaveBeenCalledWith("off", "force-on");
      expect(result.current[0]).toBe("on");
    });

    it("should handle complex custom toggle logic", () => {
      expect.hasAssertions();
      type TrafficLight = "red" | "yellow" | "green";
      
      const trafficLightToggle = (current: TrafficLight): TrafficLight => {
        switch (current) {
          case "red": return "green";
          case "green": return "yellow";
          case "yellow": return "red";
          default: return "red";
        }
      };
      
      const { result } = renderHook(() => 
        useToggle<TrafficLight>("red", trafficLightToggle)
      );

      expect(result.current[0]).toBe("red");

      act(() => {
        result.current[1](undefined); // red -> green
      });
      expect(result.current[0]).toBe("green");

      act(() => {
        result.current[1](undefined); // green -> yellow
      });
      expect(result.current[0]).toBe("yellow");

      act(() => {
        result.current[1](undefined); // yellow -> red
      });
      expect(result.current[0]).toBe("red");
    });
  });

  describe("array-based toggle", () => {
    it("should toggle between array values", () => {
      expect.hasAssertions();
      const values = ["first", "second", "third"];
      let currentIndex = 0;
      
      const arrayToggle = () => {
        currentIndex = (currentIndex + 1) % values.length;
        return values[currentIndex];
      };
      
      const { result } = renderHook(() => 
        useToggle(values[0], arrayToggle)
      );

      expect(result.current[0]).toBe("first");

      act(() => {
        result.current[1](undefined);
      });
      expect(result.current[0]).toBe("second");

      act(() => {
        result.current[1](undefined);
      });
      expect(result.current[0]).toBe("third");

      act(() => {
        result.current[1](undefined);
      });
      expect(result.current[0]).toBe("first");
    });
  });

  describe("function reference stability", () => {
    it("should maintain stable dispatch function reference", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useToggle(false));

      const initialDispatch = result.current[1];

      rerender();

      expect(result.current[1]).toBe(initialDispatch);
    });

    it("should maintain stable dispatch function with custom toggle", () => {
      expect.hasAssertions();
      const toggleFunction = (value: string) => 
        value === "on" ? "off" : "on";
      
      const { result, rerender } = renderHook(() => 
        useToggle("on", toggleFunction)
      );

      const initialDispatch = result.current[1];

      rerender();

      expect(result.current[1]).toBe(initialDispatch);
    });
  });

  describe("re-render behavior", () => {
    it("should maintain state across re-renders", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(() => useToggle(false));

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(true);

      rerender();

      expect(result.current[0]).toBe(true);
    });

    it("should update when initial value changes", () => {
      expect.hasAssertions();
      let initialValue = false;
      
      const { result, rerender } = renderHook(() => useToggle(initialValue));

      expect(result.current[0]).toBe(false);

      initialValue = true;
      rerender();

      expect(result.current[0]).toBe(false); // Should maintain current state, not reset
    });
  });

  describe("edge cases", () => {
    it("should handle toggle function that returns the same value", () => {
      expect.hasAssertions();
      const identityToggle = (value: string) => value;
      
      const { result } = renderHook(() => 
        useToggle("constant", identityToggle)
      );

      expect(result.current[0]).toBe("constant");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe("constant");
    });

    it("should handle async actions (though toggle function itself is sync)", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle(false));

      const asyncToggle = async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        act(() => {
          result.current[1](undefined);
        });
      };

      return asyncToggle().then(() => {
        expect(result.current[0]).toBe(true);
      });
    });
  });

  describe("return value structure", () => {
    it("should return a tuple with value and dispatch function", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle());

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(2);
      expect(typeof result.current[0]).toBe("boolean");
      expect(typeof result.current[1]).toBe("function");
    });

    it("should return correct types for custom values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useToggle("test"));

      expect(typeof result.current[0]).toBe("string");
      expect(typeof result.current[1]).toBe("function");
      expect(result.current[0]).toBe("test");
    });
  });

  describe("TypeScript type safety", () => {
    it("should maintain type safety with generic usage", () => {
      expect.hasAssertions();
      type Status = "loading" | "success" | "error";
      
      const statusToggle = (current: Status): Status => {
        switch (current) {
          case "loading": return "success";
          case "success": return "error";
          case "error": return "loading";
          default: return "loading";
        }
      };
      
      const { result } = renderHook(() => 
        useToggle<Status>("loading", statusToggle)
      );

      expect(result.current[0]).toBe("loading");

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe("success");
    });
  });
});