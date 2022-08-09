import { act, cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { useFocus } from "../hooks/useFocus";

describe("useFocus", () => {
  let events: { type: string; target?: EventTarget; isFocused?: boolean }[] =
    [];
  let App = () => <div />;
  beforeEach(() => {
    events = [];
    App = () => {
      const { focusProps } = useFocus({
        onFocus: (e: React.FocusEvent) =>
          events.push({ type: e.type, target: e.target }),
        onBlur: (e: React.FocusEvent) =>
          events.push({ type: e.type, target: e.target }),
        onFocusChange: (isFocused) =>
          events.push({ type: "focuschange", isFocused }),
      });
      return (
        <div {...focusProps} data-testid="example">
          <div data-testid="child"></div>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFocus).toBeDefined();
  });

  it("handles focus events on the immediate target", () => {
    expect.hasAssertions();
    const tree = render(<App />);

    const el = tree.getByTestId("example");
    act(() => {
      fireEvent.focus(el);
    });
    act(() => {
      fireEvent.blur(el);
    });

    expect(events).toEqual([
      { type: "focus", target: el },
      { type: "focuschange", isFocused: true },
      { type: "blur", target: el },
      { type: "focuschange", isFocused: false },
    ]);
  });

  it("does not handle focus events on children", () => {
    expect.hasAssertions();
    const tree = render(<App />);

    const el = tree.getByTestId("example");
    const child = tree.getByTestId("child");
    act(() => {
      fireEvent.focus(child);
    });
    act(() => {
      fireEvent.blur(child);
    });

    expect(events).toEqual([]);

    act(() => {
      fireEvent.focus(el);
    });
    act(() => {
      fireEvent.blur(el);
    });

    expect(events).toEqual([
      { type: "focus", target: el },
      { type: "focuschange", isFocused: true },
      { type: "blur", target: el },
      { type: "focuschange", isFocused: false },
    ]);
  });
});
