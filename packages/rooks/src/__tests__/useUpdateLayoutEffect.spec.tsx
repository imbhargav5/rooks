import { renderHook, act, cleanup } from "@testing-library/react";
import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { useUpdateLayoutEffect } from "@/hooks/useUpdateLayoutEffect";

describe("useUpdateLayoutEffect", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useUpdateLayoutEffect).toBeDefined();
  });

  it("does not fire effect on initial mount", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    renderHook(() => useUpdateLayoutEffect(callback, []));
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires effect on subsequent renders when deps change", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ count }: { count: number }) =>
        useUpdateLayoutEffect(callback, [count]),
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
      ({ count }: { count: number }) =>
        useUpdateLayoutEffect(callback, [count]),
      { initialProps: { count: 0 } }
    );
    rerender({ count: 0 });
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires effect on every re-render when no deps provided", () => {
    expect.hasAssertions();
    const callback = vi.fn();
    const { rerender } = renderHook(() => useUpdateLayoutEffect(callback));
    expect(callback).not.toHaveBeenCalled();
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    rerender();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("runs cleanup function returned from effect", () => {
    expect.hasAssertions();
    const cleanupFn = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ count }: { count: number }) =>
        useUpdateLayoutEffect(() => {
          return cleanupFn;
        }, [count]),
      { initialProps: { count: 0 } }
    );
    // No effect yet (first mount is skipped)
    expect(cleanupFn).not.toHaveBeenCalled();
    // Trigger effect
    rerender({ count: 1 });
    expect(cleanupFn).not.toHaveBeenCalled();
    // Trigger again — previous cleanup should run first
    rerender({ count: 2 });
    expect(cleanupFn).toHaveBeenCalledTimes(1);
    unmount();
    expect(cleanupFn).toHaveBeenCalledTimes(2);
  });

  it("integrates correctly in a component — skips mount, fires on update", () => {
    expect.hasAssertions();
    const effectLog: string[] = [];

    const App = () => {
      const [value, setValue] = useState(0);
      useUpdateLayoutEffect(() => {
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

  it("uses layout effect timing — runs synchronously before paint", () => {
    expect.hasAssertions();
    const order: string[] = [];
    const { rerender } = renderHook(
      ({ count }: { count: number }) => {
        useUpdateLayoutEffect(() => {
          order.push("layout");
        }, [count]);
      },
      { initialProps: { count: 0 } }
    );
    // Nothing on mount
    expect(order).toHaveLength(0);
    // On update, layout effect fires synchronously (before paint)
    rerender({ count: 1 });
    expect(order).toEqual(["layout"]);
  });
});
