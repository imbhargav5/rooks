/**
 * @jest-environment jsdom
 */
import {
  render,
  cleanup,
  fireEvent,
  act,
  getByTestId,
} from "@testing-library/react";
import React, { useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

const VolumeOn = () => (
  <svg
    fill="none"
    height="60"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="60"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const VolumeOff = () => (
  <svg
    fill="none"
    height="60"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="60"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const Button = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div data-testid="button" onClick={() => setClicked(!clicked)}>
      {clicked ? <VolumeOn /> : <VolumeOff />}
    </div>
  );
};

describe("useOutsideClick", () => {
  let App = () => <div />;
  beforeEach(() => {
    App = () => {
      const [message, setMessage] = useState("");
      const ref = useRef(null);
      useOutsideClick(ref, callback);
      function callback() {
        setMessage("clicked outside");
      }

      return (
        <div
          className="App"
          data-testid="app"
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "lightblue",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              className="inside"
              ref={ref}
              style={{ backgroundColor: "lightgreen" }}
            >
              <h2>This is inside</h2>
              <Button />
            </div>
          </div>

          <div data-testid="message">{message}</div>
        </div>
      );
    };
  });

  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOutsideClick).toBeDefined();
  });

  it("should trigger the calback when click on outide", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const app = getByTestId(container as HTMLElement, "app");
    const message = getByTestId(container as HTMLElement, "message");
    act(() => {
      fireEvent.click(app);
    });
    expect(message.innerHTML).toBe("clicked outside");
  });

  it("should not trigger the calback when click the volumn button (inside)", () => {
    expect.hasAssertions();
    const { container } = render(<App />);
    const button = getByTestId(container as HTMLElement, "button");
    const message = getByTestId(container as HTMLElement, "message");

    act(() => {
      fireEvent.click(button);
    });
    expect(message.innerHTML).toBe("");
  });
});
