import { vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import React, { useState } from "react";
import { useTrackedEffect } from "@/hooks/useTrackedEffect";

describe("useTrackedEffect", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTrackedEffect).toBeDefined();
  });

  it("calls callback on mount with empty changedIndices", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [count] = useState(0);
      useTrackedEffect(callback, [count]);
      return <div />;
    };
    render(<App />);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([]);
  });

  it("passes changed index when a single dep changes", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [count, setCount] = useState(0);
      useTrackedEffect(callback, [count]);
      return (
        <button
          data-testid="btn"
          onClick={() => setCount((c) => c + 1)}
          type="button"
        >
          inc
        </button>
      );
    };
    const { getByTestId } = render(<App />);
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith([0]);
  });

  it("passes correct changed indices when multiple deps change", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [a, setA] = useState(0);
      const [b, setB] = useState(0);
      const [c, setC] = useState(0);
      useTrackedEffect(callback, [a, b, c]);
      return (
        <div>
          <button
            data-testid="btn-ab"
            onClick={() => {
              setA((v) => v + 1);
              setB((v) => v + 1);
            }}
            type="button"
          >
            inc a and b
          </button>
        </div>
      );
    };
    render(<App />);
    callback.mockClear();
    act(() => {
      fireEvent.click(document.querySelector("[data-testid='btn-ab']")!);
    });
    // Both a (index 0) and b (index 1) changed; c (index 2) did not
    expect(callback).toHaveBeenLastCalledWith([0, 1]);
  });

  it("passes only the index of the dep that actually changed", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [a, setA] = useState(0);
      const [b] = useState(0);
      useTrackedEffect(callback, [a, b]);
      return (
        <button
          data-testid="btn"
          onClick={() => setA((v) => v + 1)}
          type="button"
        >
          inc a
        </button>
      );
    };
    const { getByTestId } = render(<App />);
    callback.mockClear();
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(callback).toHaveBeenLastCalledWith([0]);
  });

  it("does not call callback when deps do not change", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [, forceRender] = useState(0);
      const stableValue = 42;
      useTrackedEffect(callback, [stableValue]);
      return (
        <button
          data-testid="btn"
          onClick={() => forceRender((v) => v + 1)}
          type="button"
        >
          force
        </button>
      );
    };
    const { getByTestId } = render(<App />);
    const initialCallCount = callback.mock.calls.length;
    // Clicking re-renders the component but stableValue doesn't change,
    // so useEffect won't re-run (deps unchanged)
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(callback).toHaveBeenCalledTimes(initialCallCount);
  });

  it("runs the cleanup returned by the callback", () => {
    expect.hasAssertions();
    const cleanup = vi.fn();
    const App = () => {
      const [count, setCount] = useState(0);
      useTrackedEffect(() => cleanup, [count]);
      return (
        <button
          data-testid="btn"
          onClick={() => setCount((c) => c + 1)}
          type="button"
        >
          inc
        </button>
      );
    };
    const { getByTestId, unmount } = render(<App />);
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    // cleanup should have been called once (from the first render's effect cleanup)
    expect(cleanup).toHaveBeenCalledTimes(1);
    unmount();
    // cleanup should have been called again on unmount
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it("works with no deps (runs on every render)", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [count, setCount] = useState(0);
      useTrackedEffect(callback);
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button
            data-testid="btn"
            onClick={() => setCount((c) => c + 1)}
            type="button"
          >
            inc
          </button>
        </div>
      );
    };
    const { getByTestId } = render(<App />);
    expect(callback).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("reports the correct index when the second dep changes and the first stays the same", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const App = () => {
      const [a] = useState("stable");
      const [b, setB] = useState(0);
      useTrackedEffect(callback, [a, b]);
      return (
        <button
          data-testid="btn"
          onClick={() => setB((v) => v + 1)}
          type="button"
        >
          inc b
        </button>
      );
    };
    const { getByTestId } = render(<App />);
    callback.mockClear();
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(callback).toHaveBeenLastCalledWith([1]);
  });
});
