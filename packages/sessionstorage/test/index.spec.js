/**
 * @jest-environment jsdom
 */
import React from "react";
import useSessionstorage from "..";
import { render, cleanup, act } from "react-testing-library";

describe("useSessionstorage", () => {
  let App;
  beforeEach(() => {
    sessionStorage.clear();
    function SubApp1() {
      const { value: titan, set, remove } = useSessionstorage("titan", "eren");

      return (
        <div>
          <button onClick={() => set("mikasa")}>Add</button>
          <button onClick={() => remove()}>Remove</button>
          <p data-testid="element1">{titan}</p>
        </div>
      );
    }

    function SubApp2() {
      const { value: titan } = useSessionstorage("titan");
      return (
        <div>
          <p data-testid="element2">{titan}</p>
        </div>
      );
    }
    App = function() {
      return (
        <>
          <SubApp1 />
          <SubApp2 />
        </>
      );
    };
  });

  afterEach(cleanup); // <-- add this

  // it("should be defined", () => {
  //   expect(useSessionstorage).toBeDefined();
  // });

  // it("value should be null on initial render", () => {
  //   const { getByTestId } = render(<App />);
  //   const renderedElement = getByTestId("element1");
  //   expect(renderedElement.textContent).toEqual("");
  //   expect(renderedElement.textContent).toEqual("eren");
  // });

  it.skip("updating one component should update the other automatically", () => {
    const { getByTestId: getByTestId1 } = render(<App />);
    const renderedElement1 = getByTestId1("element1");
    const renderedElement2 = getByTestId1("element2");
    expect(renderedElement1.textContent).toEqual("");
    expect(renderedElement2.textContent).toEqual("");
    expect(renderedElement1.textContent).toEqual("eren");
    //expect(renderedElement2.textContent).toEqual("eren");
  });
});

// figure out tests
