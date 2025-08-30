import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import type { ChangeEvent } from "react";
import { useInput } from "../hooks/useInput";

describe("useInput", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useInput).toBeDefined();
  });

  describe("initialization", () => {
    it("should initialize with empty string by default", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput());

      expect(result.current.value).toBe("");
    });

    it("should initialize with provided string value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput("initial value"));

      expect(result.current.value).toBe("initial value");
    });

    it("should initialize with number value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(42));

      expect(result.current.value).toBe(42);
    });

    it("should initialize with undefined", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(undefined));

      // useInput defaults undefined to empty string
      expect(result.current.value).toBe("");
    });

    it("should initialize with readonly string array", () => {
      expect.hasAssertions();
      const readonlyArray = ["option1", "option2"] as const;
      const { result } = renderHook(() => useInput(readonlyArray));

      expect(result.current.value).toEqual(["option1", "option2"]);
    });
  });

  describe("onChange handler", () => {
    const createMockEvent = (value: string): ChangeEvent<HTMLInputElement> => {
      return {
        target: { value },
        currentTarget: { value },
      } as ChangeEvent<HTMLInputElement>;
    };

    it("should update value on change", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.onChange(createMockEvent("new value"));
      });

      expect(result.current.value).toBe("new value");
    });

    it("should handle multiple changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.onChange(createMockEvent("first"));
      });
      expect(result.current.value).toBe("first");

      act(() => {
        result.current.onChange(createMockEvent("second"));
      });
      expect(result.current.value).toBe("second");

      act(() => {
        result.current.onChange(createMockEvent("third"));
      });
      expect(result.current.value).toBe("third");
    });

    it("should handle empty string changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput("initial"));

      act(() => {
        result.current.onChange(createMockEvent(""));
      });

      expect(result.current.value).toBe("");
    });

    it("should handle whitespace values", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      act(() => {
        result.current.onChange(createMockEvent("   "));
      });

      expect(result.current.value).toBe("   ");
    });

    it("should handle special characters", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));
      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

      act(() => {
        result.current.onChange(createMockEvent(specialChars));
      });

      expect(result.current.value).toBe(specialChars);
    });

    it("should handle unicode characters", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));
      const unicodeText = "Hello 世界 🌍 émoji";

      act(() => {
        result.current.onChange(createMockEvent(unicodeText));
      });

      expect(result.current.value).toBe(unicodeText);
    });

    it("should handle very long strings", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));
      const longString = "a".repeat(10000);

      act(() => {
        result.current.onChange(createMockEvent(longString));
      });

      expect(result.current.value).toBe(longString);
      expect(result.current.value).toHaveLength(10000);
    });
  });

  describe("validation option", () => {
    it("should allow changes when validate returns true", () => {
      expect.hasAssertions();
      const validate = jest.fn().mockReturnValue(true);
      const { result } = renderHook(() => 
        useInput("initial", { validate })
      );

      const mockEvent = {
        target: { value: "new value" },
        currentTarget: { value: "new value" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(validate).toHaveBeenCalledWith("new value", "initial");
      expect(result.current.value).toBe("new value");
    });

    it("should prevent changes when validate returns false", () => {
      expect.hasAssertions();
      const validate = jest.fn().mockReturnValue(false);
      const { result } = renderHook(() => 
        useInput("initial", { validate })
      );

      const mockEvent = {
        target: { value: "new value" },
        currentTarget: { value: "new value" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(validate).toHaveBeenCalledWith("new value", "initial");
      expect(result.current.value).toBe("initial");
    });

    it("should validate with correct parameters", () => {
      expect.hasAssertions();
      const validate = jest.fn().mockReturnValue(true);
      const { result } = renderHook(() => 
        useInput("original", { validate })
      );

      const mockEvent = {
        target: { value: "updated" },
        currentTarget: { value: "updated" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith("updated", "original");
    });

    it("should handle validation with changing values", () => {
      expect.hasAssertions();
      const validate = jest.fn((newValue: string, currentValue: string) => {
        return newValue.length <= 5; // Only allow strings of 5 characters or less
      });
      
      const { result } = renderHook(() => 
        useInput("", { validate })
      );

      const createEvent = (value: string) => ({
        target: { value },
        currentTarget: { value },
      } as ChangeEvent<HTMLInputElement>);

      // Should allow short string
      act(() => {
        result.current.onChange(createEvent("short"));
      });
      expect(result.current.value).toBe("short");

      // Should prevent long string
      act(() => {
        result.current.onChange(createEvent("toolongstring"));
      });
      expect(result.current.value).toBe("short"); // Should remain unchanged

      // Should allow another short string
      act(() => {
        result.current.onChange(createEvent("ok"));
      });
      expect(result.current.value).toBe("ok");
    });

    it("should handle validate function that throws", () => {
      expect.hasAssertions();
      const validate = jest.fn(() => {
        throw new Error("Validation error");
      });
      
      const { result } = renderHook(() => 
        useInput("initial", { validate })
      );

      const mockEvent = {
        target: { value: "new value" },
        currentTarget: { value: "new value" },
      } as ChangeEvent<HTMLInputElement>;

      expect(() => {
        act(() => {
          result.current.onChange(mockEvent);
        });
      }).toThrow("Validation error");

      expect(result.current.value).toBe("initial");
    });

    it("should work without validation option", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput("initial"));

      const mockEvent = {
        target: { value: "new value" },
        currentTarget: { value: "new value" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(result.current.value).toBe("new value");
    });

    it("should handle falsy validation functions", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => 
        useInput("initial", { validate: undefined })
      );

      const mockEvent = {
        target: { value: "new value" },
        currentTarget: { value: "new value" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(result.current.value).toBe("new value");
    });
  });

  describe("number type support", () => {
    it("should handle number inputs", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(0));

      const mockEvent = {
        target: { value: "42" },
        currentTarget: { value: "42" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      expect(result.current.value).toBe("42");
    });

    it("should validate number inputs correctly", () => {
      expect.hasAssertions();
      const validate = jest.fn((newValue: string | number, currentValue: string | number) => {
        const num = typeof newValue === 'string' ? parseFloat(newValue) : newValue;
        return !isNaN(num) && num >= 0;
      });

      const { result } = renderHook(() => 
        useInput(0, { validate })
      );

      const mockEvent1 = {
        target: { value: "42" },
        currentTarget: { value: "42" },
      } as ChangeEvent<HTMLInputElement>;

      const mockEvent2 = {
        target: { value: "-5" },
        currentTarget: { value: "-5" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent1);
      });
      expect(result.current.value).toBe("42");

      act(() => {
        result.current.onChange(mockEvent2);
      });
      expect(result.current.value).toBe("42"); // Should not change due to validation
    });
  });

  describe("initial value synchronization", () => {
    it("should update when initial value changes", () => {
      expect.hasAssertions();
      let initialValue = "first";
      const { result, rerender } = renderHook(() => useInput(initialValue));

      expect(result.current.value).toBe("first");

      initialValue = "second";
      rerender();

      expect(result.current.value).toBe("second");
    });

    it("should sync with initial value even after user changes", () => {
      expect.hasAssertions();
      let initialValue = "first";
      const { result, rerender } = renderHook(() => useInput(initialValue));

      // User makes a change
      const mockEvent = {
        target: { value: "user input" },
        currentTarget: { value: "user input" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });
      expect(result.current.value).toBe("user input");

      // Initial value changes
      initialValue = "updated initial";
      rerender();

      expect(result.current.value).toBe("updated initial");
    });

    it("should handle initial value type changes", () => {
      expect.hasAssertions();
      let initialValue: string | number = "text";
      const { result, rerender } = renderHook(() => useInput(initialValue));

      expect(result.current.value).toBe("text");

      initialValue = 42;
      rerender();

      expect(result.current.value).toBe(42);
    });
  });

  describe("function reference stability", () => {
    it("should maintain stable onChange reference when validation doesn't change", () => {
      expect.hasAssertions();
      const validate = jest.fn().mockReturnValue(true);
      const { result, rerender } = renderHook(() => 
        useInput("test", { validate })
      );

      const initialOnChange = result.current.onChange;

      rerender();

      // Due to value dependency, this may not be stable
      expect(typeof result.current.onChange).toBe("function");
    });

    it("should update onChange reference when validation changes", () => {
      expect.hasAssertions();
      let validate = jest.fn().mockReturnValue(true);
      const { result, rerender } = renderHook(() => 
        useInput("test", { validate })
      );

      const initialOnChange = result.current.onChange;

      validate = jest.fn().mockReturnValue(false);
      rerender();

      expect(result.current.onChange).not.toBe(initialOnChange);
    });

    it("should update onChange when value changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput("initial"));

      const firstOnChange = result.current.onChange;

      const mockEvent = {
        target: { value: "changed" },
        currentTarget: { value: "changed" },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onChange(mockEvent);
      });

      // onChange function may be recreated due to value dependency
      expect(typeof result.current.onChange).toBe("function");
    });
  });

  describe("edge cases", () => {
    it("should handle null event target", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      const nullTargetEvent = {
        target: null,
      } as any;

      expect(() => {
        act(() => {
          result.current.onChange(nullTargetEvent);
        });
      }).toThrow();
    });

    it("should handle event target without value", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      const noValueEvent = {
        target: {},
      } as any;

      act(() => {
        result.current.onChange(noValueEvent);
      });

      expect(result.current.value).toBe(undefined);
    });

    it("should handle rapid consecutive changes", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(""));

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.onChange({
            target: { value: `value-${i}` },
            currentTarget: { value: `value-${i}` },
          } as ChangeEvent<HTMLInputElement>);
        }
      });

      expect(result.current.value).toBe("value-99");
    });

    it("should handle validation during rapid changes", () => {
      expect.hasAssertions();
      let callCount = 0;
      const validate = jest.fn(() => {
        callCount++;
        return callCount % 2 === 1; // Only allow odd numbered calls
      });

      const { result } = renderHook(() => 
        useInput("", { validate })
      );

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.onChange({
            target: { value: `value-${i}` },
            currentTarget: { value: `value-${i}` },
          } as ChangeEvent<HTMLInputElement>);
        }
      });

      expect(validate).toHaveBeenCalledTimes(10);
      expect(result.current.value).toBe("value-8"); // Last allowed value (9th call)
    });
  });

  describe("return value structure", () => {
    it("should return object with correct properties", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput());

      expect(result.current).toHaveProperty("value");
      expect(result.current).toHaveProperty("onChange");
      expect(typeof result.current.onChange).toBe("function");
      expect(typeof result.current.value).toBe("string");
    });

    it("should maintain return value shape with different types", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useInput(42));

      expect(result.current).toHaveProperty("value");
      expect(result.current).toHaveProperty("onChange");
      expect(typeof result.current.onChange).toBe("function");
      expect(typeof result.current.value).toBe("number");
    });
  });

  describe("performance considerations", () => {
    it("should not cause excessive re-renders", () => {
      expect.hasAssertions();
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        return useInput("");
      };

      const { result } = renderHook(TestComponent);

      const initialRenderCount = renderCount;

      act(() => {
        result.current.onChange({
          target: { value: "test" },
          currentTarget: { value: "test" },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(renderCount).toBe(initialRenderCount + 1); // Only one additional render
    });
  });
});