/**
 * @jest-environment jsdom
 */
import React, { useState } from "react";
import useDidMount from "..";
import { render, cleanup, act } from "react-testing-library";

describe("useDidMount", () => {
  let App;
  beforeEach(() => {
    App = function() {
      const [value, setValue] = useState(0);
      useDidMount(() => {
        setValue(1);
      });
      return (
        <div>
          <span data-testid="element">{value}</span>
        </div>
      );
    };
  });
  afterEach(cleanup); // <-- add this

  it("gets called on mount correctly", () => {
    const { getByTestId } = render(<App />);
    const renderedElement = getByTestId("element");
    expect(parseInt(renderedElement.textContent)).toEqual(1);
  });

  it("should be defined", () => {
    expect(useDidMount).toBeDefined();
  });
});

// figure out tests
