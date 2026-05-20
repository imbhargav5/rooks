import { render, cleanup, fireEvent, act } from "@testing-library/react";
import React, { useState, useEffect, useRef } from "react";
import { useLatest } from "@/hooks/useLatest";

describe("useLatest", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useLatest).toBeDefined();
  });

  it("returns a ref with the initial value on first render", () => {
    expect.hasAssertions();
    function App() {
      const ref = useLatest(42);
      return <span data-testid="value">{ref.current}</span>;
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("value").textContent).toBe("42");
  });

  it("ref.current always reflects the latest value after state updates", () => {
    expect.hasAssertions();
    function App() {
      const [count, setCount] = useState(0);
      const latestCount = useLatest(count);

      return (
        <div>
          <button
            data-testid="btn"
            onClick={() => setCount((c) => c + 1)}
            type="button"
          >
            increment
          </button>
          <span data-testid="ref-value">{latestCount.current}</span>
        </div>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("ref-value").textContent).toBe("0");

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(getByTestId("ref-value").textContent).toBe("1");

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(getByTestId("ref-value").textContent).toBe("2");
  });

  it("returns the same ref object across re-renders", () => {
    expect.hasAssertions();
    const capturedRefs: React.MutableRefObject<number>[] = [];

    function App() {
      const [count, setCount] = useState(0);
      const latestRef = useLatest(count);
      capturedRefs.push(latestRef);

      return (
        <button
          data-testid="btn"
          onClick={() => setCount((c) => c + 1)}
          type="button"
        >
          click
        </button>
      );
    }

    const { getByTestId } = render(<App />);
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });

    // All renders should share the same ref object identity
    expect(capturedRefs.length).toBeGreaterThanOrEqual(3);
    const first = capturedRefs[0];
    for (const ref of capturedRefs) {
      expect(ref).toBe(first);
    }
  });

  it("works with string values", () => {
    expect.hasAssertions();
    function App() {
      const [text, setText] = useState("hello");
      const latestText = useLatest(text);

      return (
        <div>
          <button
            data-testid="btn"
            onClick={() => setText("world")}
            type="button"
          >
            change
          </button>
          <span data-testid="ref-value">{latestText.current}</span>
        </div>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("ref-value").textContent).toBe("hello");

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(getByTestId("ref-value").textContent).toBe("world");
  });

  it("works with object values", () => {
    expect.hasAssertions();
    const obj1 = { x: 1 };
    const obj2 = { x: 2 };

    function App() {
      const [obj, setObj] = useState(obj1);
      const latestObj = useLatest(obj);

      return (
        <div>
          <button
            data-testid="btn"
            onClick={() => setObj(obj2)}
            type="button"
          >
            change
          </button>
          <span data-testid="ref-value">{latestObj.current.x}</span>
        </div>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("ref-value").textContent).toBe("1");

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(getByTestId("ref-value").textContent).toBe("2");
  });

  it("provides latest value inside async callbacks without stale closure issues", () => {
    expect.hasAssertions();
    let capturedValue: number | null = null;

    function App() {
      const [count, setCount] = useState(0);
      const latestCount = useLatest(count);
      const callbackRef = useRef<() => void>(() => {});

      // Simulate a callback registered once that reads the latest value
      useEffect(() => {
        callbackRef.current = () => {
          capturedValue = latestCount.current;
        };
      });

      return (
        <div>
          <button
            data-testid="increment"
            onClick={() => setCount((c) => c + 1)}
            type="button"
          >
            increment
          </button>
          <button
            data-testid="read"
            onClick={() => callbackRef.current()}
            type="button"
          >
            read latest
          </button>
        </div>
      );
    }

    const { getByTestId } = render(<App />);

    act(() => {
      fireEvent.click(getByTestId("increment"));
    });
    act(() => {
      fireEvent.click(getByTestId("increment"));
    });
    act(() => {
      fireEvent.click(getByTestId("increment"));
    });
    act(() => {
      fireEvent.click(getByTestId("read"));
    });

    expect(capturedValue).toBe(3);
  });

  it("works with undefined value", () => {
    expect.hasAssertions();
    function App() {
      const ref = useLatest<string | undefined>(undefined);
      return (
        <span data-testid="value">{String(ref.current)}</span>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("value").textContent).toBe("undefined");
  });

  it("works with null value", () => {
    expect.hasAssertions();
    function App() {
      const ref = useLatest<string | null>(null);
      return (
        <span data-testid="value">{String(ref.current)}</span>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("value").textContent).toBe("null");
  });

  it("works with function values", () => {
    expect.hasAssertions();
    const fn1 = () => "fn1";
    const fn2 = () => "fn2";

    function App() {
      const [fn, setFn] = useState<() => string>(() => fn1);
      const latestFn = useLatest(fn);

      return (
        <div>
          <button
            data-testid="btn"
            onClick={() => setFn(() => fn2)}
            type="button"
          >
            change
          </button>
          <span data-testid="ref-value">{latestFn.current()}</span>
        </div>
      );
    }

    const { getByTestId } = render(<App />);
    expect(getByTestId("ref-value").textContent).toBe("fn1");

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(getByTestId("ref-value").textContent).toBe("fn2");
  });
});
