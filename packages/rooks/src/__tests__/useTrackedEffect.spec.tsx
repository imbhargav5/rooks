/**
 */
import { act, cleanup, renderHook } from "@testing-library/react";
import { useState } from "react";
import { vi } from "vitest";
import { useTrackedEffect } from "@/hooks/useTrackedEffect";

describe("useTrackedEffect", () => {
  afterEach(cleanup);

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useTrackedEffect).toBeDefined();
  });

  describe("on mount", () => {
    it("calls effect once on mount", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      renderHook(() => useTrackedEffect(effect, [1, "hello"]));
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it("includes all deps in changes on mount with undefined previousValues", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      renderHook(() => useTrackedEffect(effect, [1, "hello"]));
      const [changes] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(changes).toHaveLength(2);
      expect(changes[0]).toEqual({
        index: 0,
        previousValue: undefined,
        currentValue: 1,
      });
      expect(changes[1]).toEqual({
        index: 1,
        previousValue: undefined,
        currentValue: "hello",
      });
    });

    it("passes empty array as previousDeps on mount", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      renderHook(() => useTrackedEffect(effect, [42]));
      const [, previousDeps] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(previousDeps).toEqual([]);
    });

    it("passes current deps as currentDeps on mount", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      renderHook(() => useTrackedEffect(effect, [42, "world"]));
      const [, , currentDeps] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(currentDeps).toEqual([42, "world"]);
    });
  });

  describe("when a single dep changes", () => {
    it("calls effect with only the changed dep in changes", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      const { rerender } = renderHook(
        ({ count, name }: { count: number; name: string }) =>
          useTrackedEffect(effect, [count, name]),
        { initialProps: { count: 0, name: "Alice" } }
      );
      effect.mockClear();

      rerender({ count: 1, name: "Alice" });

      expect(effect).toHaveBeenCalledTimes(1);
      const [changes] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(changes).toHaveLength(1);
      expect(changes[0]).toEqual({
        index: 0,
        previousValue: 0,
        currentValue: 1,
      });
    });

    it("passes correct previousDeps and currentDeps on update", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      const { rerender } = renderHook(
        ({ count, name }: { count: number; name: string }) =>
          useTrackedEffect(effect, [count, name]),
        { initialProps: { count: 0, name: "Alice" } }
      );
      effect.mockClear();

      rerender({ count: 1, name: "Alice" });

      const [, previousDeps, currentDeps] =
        effect.mock.calls[0] as Parameters<typeof effect>;
      expect(previousDeps).toEqual([0, "Alice"]);
      expect(currentDeps).toEqual([1, "Alice"]);
    });
  });

  describe("when multiple deps change simultaneously", () => {
    it("includes all changed deps in changes array", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      const { rerender } = renderHook(
        ({ count, name }: { count: number; name: string }) =>
          useTrackedEffect(effect, [count, name]),
        { initialProps: { count: 0, name: "Alice" } }
      );
      effect.mockClear();

      rerender({ count: 5, name: "Bob" });

      const [changes] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(changes).toHaveLength(2);
      expect(changes[0]).toEqual({
        index: 0,
        previousValue: 0,
        currentValue: 5,
      });
      expect(changes[1]).toEqual({
        index: 1,
        previousValue: "Alice",
        currentValue: "Bob",
      });
    });
  });

  describe("cleanup function", () => {
    it("calls cleanup returned by effect when deps change", () => {
      expect.hasAssertions();
      const cleanupFn = vi.fn();
      const effect = vi.fn(() => cleanupFn);

      const { rerender } = renderHook(
        ({ count }: { count: number }) =>
          useTrackedEffect(effect, [count]),
        { initialProps: { count: 0 } }
      );

      rerender({ count: 1 });

      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });

    it("calls cleanup on unmount", () => {
      expect.hasAssertions();
      const cleanupFn = vi.fn();
      const effect = vi.fn(() => cleanupFn);

      const { unmount } = renderHook(() =>
        useTrackedEffect(effect, [1])
      );

      unmount();

      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });

    it("does not throw when effect returns void", () => {
      expect.hasAssertions();
      const effect = vi.fn();

      expect(() => {
        const { rerender } = renderHook(
          ({ count }: { count: number }) =>
            useTrackedEffect(effect, [count]),
          { initialProps: { count: 0 } }
        );
        rerender({ count: 1 });
      }).not.toThrow();
    });
  });

  describe("with state-driven deps", () => {
    it("tracks changes correctly across multiple state updates", () => {
      expect.hasAssertions();
      const changes: Array<{ index: number; previousValue: unknown; currentValue: unknown }[]> = [];

      const useHook = () => {
        const [count, setCount] = useState(0);
        const [label, setLabel] = useState("start");
        useTrackedEffect(
          (c) => {
            changes.push([...c]);
          },
          [count, label]
        );
        return { setCount, setLabel };
      };

      const { result } = renderHook(() => useHook());

      act(() => {
        result.current.setCount(10);
      });

      act(() => {
        result.current.setLabel("end");
      });

      // First call (mount): both deps in changes
      expect(changes[0]).toHaveLength(2);
      // Second call (count changed): only index 0
      expect(changes[1]).toHaveLength(1);
      expect(changes[1][0].index).toBe(0);
      expect(changes[1][0].previousValue).toBe(0);
      expect(changes[1][0].currentValue).toBe(10);
      // Third call (label changed): only index 1
      expect(changes[2]).toHaveLength(1);
      expect(changes[2][0].index).toBe(1);
      expect(changes[2][0].previousValue).toBe("start");
      expect(changes[2][0].currentValue).toBe("end");
    });
  });

  describe("with empty deps array", () => {
    it("calls effect once on mount and not again on rerender", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      const { rerender } = renderHook(() => useTrackedEffect(effect, []));

      rerender();
      rerender();

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it("passes empty changes array when deps array is empty", () => {
      expect.hasAssertions();
      const effect = vi.fn();
      renderHook(() => useTrackedEffect(effect, []));

      const [changes] = effect.mock.calls[0] as Parameters<typeof effect>;
      expect(changes).toHaveLength(0);
    });
  });
});
