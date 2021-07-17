/**
 * @jest-environment jsdom
 */
import { render, cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useDimensionsRef } from "../hooks/useDimensionsRef";
import { DOMRectPolyfill } from "../utils/domrect-polyfill";

describe("useDimensionsRef", () => {
  it("should be defined", () => {
    expect(useDimensionsRef).toBeDefined();
  });

  describe("base", () => {
    it("runs immediately after mount", async () => {
      expect.assertions(1);
      const { result } = renderHook(() => useDimensionsRef());
      expect(result.current[0]).toBeDefined();
    });
  });

  describe("usage", () => {
    let App;

    beforeEach(() => {
      if (typeof window !== "undefined" && !window.DOMRect) {
        (window as { DOMRect: typeof DOMRect }).DOMRect = DOMRectPolyfill;
      }
      jest
        .spyOn(Element.prototype, "getBoundingClientRect")
        .mockImplementation(() => new DOMRect(0, 0, 120, 300));

      App = function () {
        const [ref, dimensions] = useDimensionsRef();

        return (
          <div>
            <span data-testid="value">{dimensions?.width ?? "null"}</span>
            <span data-testid="element" ref={ref}>
              Hello
            </span>
          </div>
        );
      };
    });
    afterEach(cleanup);

    it("gets called if a state value changes", () => {
      const { getByTestId } = render(<App />);
      const valueElement = getByTestId("value");
      expect(valueElement.textContent).toEqual("120");
    });
  });
  beforeEach(() => {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: Function) => callback());
  });

  afterEach(() => {
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });
});
