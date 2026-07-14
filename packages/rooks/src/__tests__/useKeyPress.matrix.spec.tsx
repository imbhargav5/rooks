import type { RefObject } from "react";
import { act, fireEvent, renderHook } from "@testing-library/react";
import { useKeyPress } from "@/hooks/useKeyPress";

type KeyIdentifier = string | number;

type TargetCase = {
  blurTarget: EventTarget;
  createTarget: () =>
    | Window
    | Document
    | RefObject<HTMLElement | SVGElement | null>
    | null;
  dispatchTarget: (target: ReturnType<TargetCase["createTarget"]>) => EventTarget;
  label: string;
};

type KeyCase = {
  keys: KeyIdentifier | KeyIdentifier[];
  label: string;
  match: KeyboardEventInit;
  mismatch: KeyboardEventInit;
};

const targetCases: TargetCase[] = [
  {
    label: "window",
    createTarget: () => window,
    dispatchTarget: () => window,
    blurTarget: window,
  },
  {
    label: "document",
    createTarget: () => document,
    dispatchTarget: () => document,
    blurTarget: window,
  },
  {
    label: "html ref",
    createTarget: () => {
      const element = document.createElement("div");
      element.tabIndex = 0;
      return { current: element };
    },
    dispatchTarget: (target) => (target as RefObject<HTMLElement>).current!,
    blurTarget: document.body,
  },
  {
    label: "svg ref",
    createTarget: () => {
      const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      return { current: element };
    },
    dispatchTarget: (target) => (target as RefObject<SVGElement>).current!,
    blurTarget: document.body,
  },
];

const keyCases: KeyCase[] = [
  {
    label: "string letter",
    keys: "a",
    match: { key: "a", which: 65, keyCode: 65 },
    mismatch: { key: "b", which: 66, keyCode: 66 },
  },
  {
    label: "string modifier",
    keys: "Shift",
    match: { key: "Shift", which: 16, keyCode: 16 },
    mismatch: { key: "Alt", which: 18, keyCode: 18 },
  },
  {
    label: "number keycode",
    keys: 13,
    match: { key: "Enter", which: 13, keyCode: 13 },
    mismatch: { key: "Escape", which: 27, keyCode: 27 },
  },
  {
    label: "array first member",
    keys: ["a", "b"],
    match: { key: "a", which: 65, keyCode: 65 },
    mismatch: { key: "c", which: 67, keyCode: 67 },
  },
  {
    label: "array second member",
    keys: ["a", "b"],
    match: { key: "b", which: 66, keyCode: 66 },
    mismatch: { key: "c", which: 67, keyCode: 67 },
  },
  {
    label: "mixed key and code",
    keys: ["Enter", 27],
    match: { key: "Escape", which: 27, keyCode: 27 },
    mismatch: { key: "Tab", which: 9, keyCode: 9 },
  },
];

function dispatchKeyDown(target: EventTarget, eventInit: KeyboardEventInit) {
  fireEvent.keyDown(target, eventInit);
}

function dispatchKeyUp(target: EventTarget, eventInit: KeyboardEventInit) {
  fireEvent.keyUp(target, eventInit);
}

describe("useKeyPress matrix", () => {
  it.each(
    targetCases.flatMap((targetCase) =>
      keyCases.map((keyCase) => ({
        keyCase,
        targetCase,
      }))
    )
  )(
    "tracks press lifecycle for $targetCase.label with $keyCase.label",
    ({ keyCase, targetCase }) => {
      expect.hasAssertions();
      const target = targetCase.createTarget();
      const dispatchTarget = targetCase.dispatchTarget(target);
      const { result } = renderHook(() =>
        useKeyPress(keyCase.keys, { target })
      );

      expect(result.current).toBe(false);

      act(() => {
        dispatchKeyDown(dispatchTarget, keyCase.match);
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchKeyUp(dispatchTarget, keyCase.match);
      });
      expect(result.current).toBe(false);
    }
  );

  it.each(
    targetCases.flatMap((targetCase) =>
      keyCases.map((keyCase) => ({
        keyCase,
        targetCase,
      }))
    )
  )(
    "ignores non-matching keys for $targetCase.label with $keyCase.label",
    ({ keyCase, targetCase }) => {
      expect.hasAssertions();
      const target = targetCase.createTarget();
      const dispatchTarget = targetCase.dispatchTarget(target);
      const { result } = renderHook(() =>
        useKeyPress(keyCase.keys, { target })
      );

      act(() => {
        dispatchKeyDown(dispatchTarget, keyCase.mismatch);
        dispatchKeyUp(dispatchTarget, keyCase.mismatch);
      });

      expect(result.current).toBe(false);
    }
  );

  it.each(
    targetCases.flatMap((targetCase) =>
      keyCases.map((keyCase) => ({
        keyCase,
        targetCase,
      }))
    )
  )(
    "clears on blur for $targetCase.label with $keyCase.label",
    ({ keyCase, targetCase }) => {
      expect.hasAssertions();
      const target = targetCase.createTarget();
      const dispatchTarget = targetCase.dispatchTarget(target);
      const blurTarget =
        "current" in (target ?? {}) && target !== null
          ? dispatchTarget
          : targetCase.blurTarget;
      const { result } = renderHook(() =>
        useKeyPress(keyCase.keys, { target })
      );

      act(() => {
        dispatchKeyDown(dispatchTarget, keyCase.match);
      });
      expect(result.current).toBe(true);

      act(() => {
        fireEvent.blur(blurTarget);
      });

      expect(result.current).toBe(false);
    }
  );

  it.each(
    targetCases.flatMap((targetCase) =>
      keyCases.map((keyCase) => ({
        keyCase,
        targetCase,
      }))
    )
  )(
    "does not react while disabled for $targetCase.label with $keyCase.label",
    ({ keyCase, targetCase }) => {
      expect.hasAssertions();
      const target = targetCase.createTarget();
      const dispatchTarget = targetCase.dispatchTarget(target);
      const { result } = renderHook(() =>
        useKeyPress(keyCase.keys, { target, when: false })
      );

      act(() => {
        dispatchKeyDown(dispatchTarget, keyCase.match);
        dispatchKeyUp(dispatchTarget, keyCase.match);
      });

      expect(result.current).toBe(false);
    }
  );

  it.each(targetCases)(
    "stays true while another tracked key remains pressed on $label",
    ({ createTarget, dispatchTarget }) => {
      expect.hasAssertions();
      const target = createTarget();
      const eventTarget = dispatchTarget(target);
      const { result } = renderHook(() =>
        useKeyPress(["Shift", "a"], { target })
      );

      act(() => {
        dispatchKeyDown(eventTarget, { key: "Shift", which: 16, keyCode: 16 });
        dispatchKeyDown(eventTarget, { key: "a", which: 65, keyCode: 65 });
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchKeyUp(eventTarget, { key: "a", which: 65, keyCode: 65 });
      });
      expect(result.current).toBe(true);

      act(() => {
        dispatchKeyUp(eventTarget, { key: "Shift", which: 16, keyCode: 16 });
      });
      expect(result.current).toBe(false);
    }
  );

  it.each(targetCases)(
    "clears immediately when when toggles false on $label",
    ({ createTarget, dispatchTarget }) => {
      expect.hasAssertions();
      const target = createTarget();
      const eventTarget = dispatchTarget(target);
      const { result, rerender } = renderHook(
        ({ when }) => useKeyPress("a", { target, when }),
        {
          initialProps: {
            when: true,
          },
        }
      );

      act(() => {
        dispatchKeyDown(eventTarget, { key: "a", which: 65, keyCode: 65 });
      });
      expect(result.current).toBe(true);

      rerender({ when: false });
      expect(result.current).toBe(false);
    }
  );

  it.each(targetCases)(
    "reactivates when when toggles back on for $label",
    ({ createTarget, dispatchTarget }) => {
      expect.hasAssertions();
      const target = createTarget();
      const eventTarget = dispatchTarget(target);
      const { result, rerender } = renderHook(
        ({ when }) => useKeyPress("a", { target, when }),
        {
          initialProps: {
            when: false,
          },
        }
      );

      act(() => {
        dispatchKeyDown(eventTarget, { key: "a", which: 65, keyCode: 65 });
      });
      expect(result.current).toBe(false);

      rerender({ when: true });

      act(() => {
        dispatchKeyDown(eventTarget, { key: "a", which: 65, keyCode: 65 });
      });
      expect(result.current).toBe(true);
    }
  );

  it.each(keyCases)(
    "resets when the tracked keys change for %s",
    ({ keys, match, label }) => {
      expect.hasAssertions();
      const target = { current: document.createElement("div") };
      const eventTarget = target.current;
      const { result, rerender } = renderHook(
        ({ trackedKeys }) => useKeyPress(trackedKeys, { target }),
        {
          initialProps: {
            trackedKeys: keys,
          },
        }
      );

      act(() => {
        dispatchKeyDown(eventTarget, match);
      });
      expect(result.current).toBe(true);

      rerender({ trackedKeys: "z" });
      expect(result.current).toBe(false);

      act(() => {
        dispatchKeyDown(eventTarget, { key: "z", which: 90, keyCode: 90 });
      });
      expect(result.current).toBe(true);
      expect(label).toBeDefined();
    }
  );

  it("rebinds when the ref target changes", () => {
    expect.hasAssertions();
    const first = document.createElement("div");
    const second = document.createElement("div");
    const target = { current: first };
    const { result, rerender } = renderHook(() => useKeyPress("a", { target }));

    act(() => {
      dispatchKeyDown(first, { key: "a", which: 65, keyCode: 65 });
    });
    expect(result.current).toBe(true);

    act(() => {
      dispatchKeyUp(first, { key: "a", which: 65, keyCode: 65 });
    });
    expect(result.current).toBe(false);

    target.current = second;
    rerender();

    act(() => {
      dispatchKeyDown(first, { key: "a", which: 65, keyCode: 65 });
    });
    expect(result.current).toBe(false);

    act(() => {
      dispatchKeyDown(second, { key: "a", which: 65, keyCode: 65 });
    });
    expect(result.current).toBe(true);
  });
});
