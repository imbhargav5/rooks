/**
 * @jest-environment jsdom
 */
import React from "react";
import useInput from "../src";
import {
  render,
  cleanup,
  fireEvent,
  flushEffects
} from "react-testing-library";

describe("useInput", () => {
  // basic tests
  describe("basic", () => {
    let App;
    beforeEach(() => {
      App = function() {
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

    it("should be defined", () => {
      expect(useInput).toBeDefined();
    });
    it("sets initial value correctly", () => {
      const { getByTestId, rerender } = render(<App />);
      const inputElement = getByTestId("input-element");
      expect(inputElement.value).toBe("hello");
    });
    it("updates value correctly", () => {
      const { getByTestId, rerender } = render(<App />);
      const inputElement = getByTestId("input-element");
      const displayElement = getByTestId("display-element");
      expect(inputElement.value).toBe("hello");
      expect(displayElement.value).toBe("hello");
      fireEvent.change(inputElement, {
        target: {
          value: "world"
        }
      });
      expect(inputElement.value).toBe("world");
      expect(displayElement.value).toBe("world");
    });
  });
  // validate
  describe("validate", () => {
    let App;
    beforeEach(() => {
      App = function() {
        const myInput = useInput(5, {
          validate: newValue => newValue < 10
        });
        return (
          <div>
            <input type="number" data-testid="input-element" {...myInput} />
          </div>
        );
      };
    });
    afterEach(cleanup); // <-- add this

    it("does not update if validate returns false", () => {
      const { getByTestId, rerender } = render(<App />);
      const inputElement = getByTestId("input-element");
      fireEvent.change(inputElement, {
        target: {
          value: 10
        }
      });
      expect(parseInt(inputElement.value)).toBe(5);
    });
    it("updates if validate returns true", () => {
      const { getByTestId, rerender } = render(<App />);
      const inputElement = getByTestId("input-element");
      fireEvent.change(inputElement, {
        target: {
          value: 9
        }
      });
      expect(parseInt(inputElement.value)).toBe(9);
    });
  });

  describe("multiple", () => {
    let App;
    beforeEach(() => {
      App = function() {
        const myInput = useInput(5);
        const myInput2 = useInput(myInput.value);
        return (
          <div>
            <input type="number" data-testid="input-element1" {...myInput} />
            <input type="number" data-testid="input-element2" {...myInput2} />
          </div>
        );
      };
    });
    afterEach(cleanup); // <-- add this

    it("updates value of input if initial value changes ", () => {
      const { getByTestId, rerender } = render(<App />);
      const inputElement1 = getByTestId("input-element1");
      const inputElement2 = getByTestId("input-element2");
      expect(parseInt(inputElement1.value)).toBe(5);
      expect(parseInt(inputElement2.value)).toBe(5);

      fireEvent.change(inputElement2, {
        target: {
          value: 6
        }
      });
      expect(parseInt(inputElement2.value)).toBe(6);

      fireEvent.change(inputElement1, {
        target: {
          value: 10
        }
      });

      expect(parseInt(inputElement1.value)).toBe(10);
      flushEffects();
      expect(parseInt(inputElement2.value)).toBe(10);
    });
  });
});

// figure out tests
