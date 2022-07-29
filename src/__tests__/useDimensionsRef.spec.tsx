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
    let App = () => <div />;

    beforeEach(() => {
      jest
        .spyOn(Element.prototype, "getBoundingClientRect")
        .mockImplementation(() => new window.DOMRect(0, 0, 120, 300));
      jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((callback: Function) => callback());

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof window !== "undefined" && !window.DOMRect) {
        (window as { DOMRect: typeof DOMRect }).DOMRect = DOMRectPolyfill;
      }

      App = () => {
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
    afterEach(() => {
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      cleanup();
    });

    it("gets called if a state value changes", () => {
      const { getByTestId } = render(<App />);
      const valueElement = getByTestId("value");
      expect(valueElement.textContent).toBe("120");
    });
  });
});
