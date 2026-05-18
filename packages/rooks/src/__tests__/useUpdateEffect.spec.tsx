import { renderHook, act, cleanup } from "@testing-library/react";
import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";

describe("useUpdateEffect", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useUpdateEffect).toBeDefined();
  });

  it("does not fire effect on initial mount", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    renderHook(() => useUpdateEffect(callback, []));
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires effect on subsequent renders when deps change", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ count }: { count: number }) => useUpdateEffect(callback, [count]),
      { initialProps: { count: 0 } }
    );
    expect(callback).not.toHaveBeenCalled();
    rerender({ count: 1 });
    expect(callback).toHaveBeenCalledTimes(1);
    rerender({ count: 2 });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("does not fire when deps have not changed", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ count }: { count: number }) => useUpdateEffect(callback, [count]),
      { initialProps: { count: 0 } }
    );
    rerender({ count: 0 });
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires effect on every re-render when no deps provided", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { rerender } = renderHook(() => useUpdateEffect(callback));
    expect(callback).not.toHaveBeenCalled();
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    rerender();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("runs cleanup function returned from effect", () => {
    expect.hasAssertions();
    const cleanup = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ count }: { count: number }) =>
        useUpdateEffect(() => {
          return cleanup;
        }, [count]),
      { initialProps: { count: 0 } }
    );
    // No effect yet (first mount is skipped)
    expect(cleanup).not.toHaveBeenCalled();
    // Trigger effect
    rerender({ count: 1 });
    expect(cleanup).not.toHaveBeenCalled();
    // Trigger again — previous cleanup should run first
    rerender({ count: 2 });
    expect(cleanup).toHaveBeenCalledTimes(1);
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it("integrates correctly in a component — skips mount, fires on update", () => {
    expect.hasAssertions();
    const effectLog: string[] = [];

    const App = () => {
      const [value, setValue] = useState(0);
      useUpdateEffect(() => {
        effectLog.push(`effect:${value}`);
      }, [value]);
      return (
        <button
          data-testid="btn"
          onClick={() => setValue((v) => v + 1)}
          type="button"
        >
          {value}
        </button>
      );
    };

    const { getByTestId } = render(<App />);
    // On mount, effect should NOT have fired
    expect(effectLog).toHaveLength(0);

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(effectLog).toEqual(["effect:1"]);

    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(effectLog).toEqual(["effect:1", "effect:2"]);
  });
});
