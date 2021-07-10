import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { renderHook, act as actHook } from "@testing-library/react-hooks";
import React from "react";
import { useInput } from "../hooks/useInput";

describe("useInput", () => {
  // basic tests
  describe("basic", () => {
    let App;
    beforeEach(() => {
      App = function () {
        const myInput = useInput("hello");

        return (
          <div>
            <input data-testid="input-element" {...myInput} />
            <input data-testid="display-element" {...myInput} />
          </div>
        );
      };
    });
    afterEach(cleanup); // <-- add this

    test("memo", () => {
      const { result, rerender } = renderHook(() => useInput("hello"));
      const onChangeBeforeRerender = result.current.onChange;
      rerender();
      const onChangeAfterRerender = result.current.onChange;
      // fn is memo
      expect(onChangeBeforeRerender).toBe(onChangeAfterRerender);
      actHook(() => {
        onChangeAfterRerender({ target: { value: "string" } } as any);
      });
      // memo fn is still able to set data
      expect(result.current.value).toBe("string");
      // memo fn is reactive
      actHook(() => {
        onChangeAfterRerender({ target: { value: "string2" } } as any);
      });
      expect(result.current.value).toBe("string2");
    });

    it("should be defined", () => {
      expect(useInput).toBeDefined();
    });
    it("sets initial value correctly", () => {
      const { getByTestId } = render(<App />);
      const inputElement = getByTestId("input-element") as HTMLInputElement;
      expect(inputElement.value).toBe("hello");
    });
    it("updates value correctly", () => {
      const { getByTestId } = render(<App />);
      const inputElement = getByTestId("input-element") as HTMLInputElement;
      const displayElement = getByTestId("display-element") as HTMLInputElement;
      expect(inputElement.value).toBe("hello");
      expect(displayElement.value).toBe("hello");
      act(() => {
        fireEvent.change(inputElement, {
          target: {
            value: "world",
          },
        });
      });
      expect(inputElement.value).toBe("world");
      expect(displayElement.value).toBe("world");
    });
  });
  // validate
  describe("validate", () => {
    let App;
    beforeEach(() => {
      App = function ({ validate }) {
        const myInput = useInput(5, {
          validate: validate || ((newValue) => newValue < 10),
        });

        return (
          <div>
            <input data-testid="input-element" type="number" {...myInput} />
          </div>
        );
      };
    });
    afterEach(cleanup); // <-- add this

    it("does not update if validate returns false", () => {
      const { getByTestId } = render(<App />);
      const inputElement = getByTestId("input-element") as HTMLInputElement;
      act(() => {
        fireEvent.change(inputElement, {
          target: {
            value: 10,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(5);
    });
    it("updates if validate returns true", () => {
      const { getByTestId } = render(<App />);
      const inputElement = getByTestId("input-element") as HTMLInputElement;
      act(() => {
        fireEvent.change(inputElement, {
          target: {
            value: 9,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(9);
    });
    it("validate can be used to compare possible newvalue with current value", () => {
      const { getByTestId } = render(
        <App
          validate={(newValue, currentValue) => newValue % currentValue != 0}
        />
      );
      const inputElement = getByTestId("input-element") as HTMLInputElement;
      act(() => {
        fireEvent.change(inputElement, {
          target: {
            value: 6,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(6);
      act(() => {
        fireEvent.change(inputElement, {
          target: {
            value: 12,
          },
        });
      });
      expect(Number.parseInt(inputElement.value)).toBe(6);
    });
  });

  describe("multiple", () => {
    let App;
    beforeEach(() => {
      App = function () {
        const myInput = useInput(5);
        const myInput2 = useInput(myInput.value);

        return (
          <div>
            <input data-testid="input-element1" type="number" {...myInput} />
            <input data-testid="input-element2" type="number" {...myInput2} />
          </div>
        );
      };
    });
    afterEach(cleanup); // <-- add this

    it("updates value of input if initial value changes", () => {
      const { getByTestId } = render(<App />);
      const inputElement1 = getByTestId("input-element1") as HTMLInputElement;
      const inputElement2 = getByTestId("input-element2") as HTMLInputElement;
      expect(Number.parseInt(inputElement1.value)).toBe(5);
      expect(Number.parseInt(inputElement2.value)).toBe(5);

      act(() => {
        fireEvent.change(inputElement2, {
          target: {
            value: 6,
          },
        });
      });
      expect(Number.parseInt(inputElement2.value)).toBe(6);

      act(() => {
        fireEvent.change(inputElement1, {
          target: {
            value: 10,
          },
        });
      });
      expect(Number.parseInt(inputElement1.value)).toBe(10);
      expect(Number.parseInt(inputElement2.value)).toBe(10);
    });
  });
});

// figure out tests
