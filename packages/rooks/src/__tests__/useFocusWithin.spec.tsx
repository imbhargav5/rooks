import { act, cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { useFocusWithin } from "../hooks/useFocusWithin";

describe("useFocusWithin", () => {
  let events: { type: string; target?: EventTarget; isFocused?: boolean }[] =
    [];
  let App = () => <div />;
  beforeEach(() => {
    events = [];
    App = () => {
      const { focusWithinProps } = useFocusWithin({
        onFocusWithin: (e: React.FocusEvent) =>
          events.push({ type: e.type, target: e.target }),
        onBlurWithin: (e: React.FocusEvent) =>
          events.push({ type: e.type, target: e.target }),
        onFocusWithinChange: (isFocused) =>
          events.push({ type: "focuschange", isFocused }),
      });
      return (
        <div {...focusWithinProps} data-testid="example">
          <div data-testid="child"></div>
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFocusWithin).toBeDefined();
  });

  it("handles focus events on the target itself", () => {
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

  it("does handle focus events on children", function () {
    expect.hasAssertions();
    const tree = render(<App />);
    const el = tree.getByTestId("example");
    const child = tree.getByTestId("child");
    act(() => {
      fireEvent.focus(child);
    });
    act(() => {
      fireEvent.focus(el);
    });
    act(() => {
      fireEvent.focus(child);
    });
    act(() => {
      fireEvent.blur(child);
    });

    expect(events).toEqual([
      { type: "focus", target: child },
      { type: "focuschange", isFocused: true },
      { type: "blur", target: child },
      { type: "focuschange", isFocused: false },
    ]);
  });
});
