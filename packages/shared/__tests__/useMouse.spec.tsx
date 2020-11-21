/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import {useMouse} from "../useMouse";

function TestMouse(){
  const mouse = useMouse();
  return <>{JSON.stringify(mouse)}</>;
};

describe("useMouse", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useMouse).toBeDefined();
  });

  it("should default with null values", () => {
    const { queryByText } = render(<TestMouse />);
    const expected =
      '{"x":null,"y":null,"screenX":null,"screenY":null,"pageX":null,"pageY":null,"clientX":null,"clientY":null,"movementX":null,"movementY":null,"offsetX":null,"offsetY":null}';
    expect(queryByText(expected)).toBeTruthy();
  });

  it("should update client position when mouse is moved", () => {
    const { queryByText } = render(
      <div style={{ width: 100, height: 100 }}>
        <TestMouse />
      </div>
    );
    const expected =
      '{"screenX":0,"screenY":0,"clientX":80,"clientY":20,"x":0,"y":0}';
    fireEvent.mouseMove(document, { clientX: 80, clientY: 20 });
    expect(queryByText(expected)).toBeTruthy();
  });

  it("should update screen position when mouse is moved", () => {
    const { queryByText } = render(
      <div style={{ width: 100, height: 100 }}>
        <TestMouse />
      </div>
    );
    const expected =
      '{"screenX":80,"screenY":20,"clientX":0,"clientY":0,"x":80,"y":20}';
    fireEvent.mouseMove(document, { screenX: 80, screenY: 20 });
    expect(queryByText(expected)).toBeTruthy();
  });
});
