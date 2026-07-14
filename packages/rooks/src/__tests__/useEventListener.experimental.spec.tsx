import React, { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useEventListener } from "@/hooks/useEventListener";
import type { EventTargetLike } from "@/utils/eventTarget";

class MockMediaQueryList extends EventTarget implements MediaQueryList {
  readonly media: string;
  matches: boolean;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null =
    null;

  constructor(query: string, matches = false) {
    super();
    this.media = query;
    this.matches = matches;
  }

  addListener(callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any) {
    this.addEventListener("change", callback as EventListener);
  }

  removeListener(
    callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any
  ) {
    this.removeEventListener("change", callback as EventListener);
  }
}

class GenericTarget extends EventTarget {}

type SupportedTarget =
  | Window
  | Document
  | HTMLElement
  | SVGElement
  | MediaQueryList
  | EventTarget;

type TargetCase = {
  label: string;
  createTarget: () => SupportedTarget;
};

type MatrixCase = TargetCase & {
  mode: "direct" | "ref";
};

const baseTargetCases: TargetCase[] = [
  {
    label: "window",
    createTarget: () => window,
  },
  {
    label: "document",
    createTarget: () => document,
  },
  {
    label: "html element",
    createTarget: () => document.createElement("button"),
  },
  {
    label: "svg element",
    createTarget: () =>
      document.createElementNS("http://www.w3.org/2000/svg", "svg"),
  },
  {
    label: "media query list",
    createTarget: () => new MockMediaQueryList("(max-width: 600px)"),
  },
  {
    label: "generic event target",
    createTarget: () => new GenericTarget(),
  },
];

const matrixCases: MatrixCase[] = baseTargetCases.flatMap((targetCase) => [
  {
    ...targetCase,
    mode: "direct" as const,
  },
  {
    ...targetCase,
    mode: "ref" as const,
  },
]);

function asTargetLike(
  target: SupportedTarget,
  mode: MatrixCase["mode"]
): EventTargetLike<EventTarget> {
  if (mode === "ref") {
    return {
      current: target,
    };
  }

  return target as EventTargetLike<EventTarget>;
}

function dispatchEventByName(target: SupportedTarget, eventName: string) {
  target.dispatchEvent(
    new Event(eventName, {
      bubbles: true,
      cancelable: true,
    })
  );
}

type HookProps = {
  callback: (event: Event) => void;
  eventName: string;
  isLayoutEffect?: boolean;
  listenerOptions?: AddEventListenerOptions;
  target: EventTargetLike<EventTarget>;
  when?: boolean;
};

function renderGenericEventListener(initialProps: HookProps) {
  return renderHook(
    ({
      callback,
      eventName,
      isLayoutEffect = false,
      listenerOptions,
      target,
      when = true,
    }: HookProps) =>
      useEventListener<EventTarget>(eventName, callback, {
        target,
        listenerOptions,
        when,
        isLayoutEffect,
      }),
    {
      initialProps,
    }
  );
}

const strictModeWrapper = ({ children }: { children: React.ReactNode }) => (
  <StrictMode>{children}</StrictMode>
);

describe("useEventListener", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is defined", () => {
    expect.hasAssertions();
    expect(useEventListener).toBeDefined();
  });

  it("treats null targets as a no-op", () => {
    expect.hasAssertions();

    expect(() => {
      renderGenericEventListener({
        callback: vi.fn(),
        eventName: "alpha",
        target: null,
      });
    }).not.toThrow();
  });

  it.each(matrixCases)(
    "attaches and dispatches for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();

      renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "does not attach when disabled for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const addSpy = vi.spyOn(target, "addEventListener");

      renderGenericEventListener({
        callback: vi.fn(),
        eventName: "alpha",
        target: asTargetLike(target, mode),
        when: false,
      });

      expect(addSpy).not.toHaveBeenCalled();
    }
  );

  it.each(matrixCases)(
    "rebinds when the event name changes for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      rerender({
        callback,
        eventName: "beta",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
        dispatchEventByName(target, "beta");
      });

      expect(callback).toHaveBeenCalledTimes(2);
    }
  );

  it.each(matrixCases)(
    "uses the latest callback after rerender for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback: firstCallback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      rerender({
        callback: secondCallback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "supports when toggling for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
        when: false,
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      rerender({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
        when: true,
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      rerender({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
        when: false,
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "cleans up listeners on unmount for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const { unmount } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      unmount();

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "works in layout-effect mode for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();

      renderGenericEventListener({
        callback,
        eventName: "alpha",
        isLayoutEffect: true,
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "supports once listeners for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();

      renderGenericEventListener({
        callback,
        eventName: "alpha",
        listenerOptions: { once: true },
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "supports AbortSignal listener options for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const controller = new AbortController();

      renderGenericEventListener({
        callback,
        eventName: "alpha",
        listenerOptions: { signal: controller.signal },
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      controller.abort();

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "rebinds when listener options change for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const addSpy = vi.spyOn(target, "addEventListener");
      const removeSpy = vi.spyOn(target, "removeEventListener");
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        listenerOptions: { capture: true },
        target: asTargetLike(target, mode),
      });

      rerender({
        callback,
        eventName: "alpha",
        listenerOptions: { passive: true },
        target: asTargetLike(target, mode),
      });

      expect(addSpy).toHaveBeenCalledWith(
        "alpha",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );
      expect(removeSpy).toHaveBeenCalledWith(
        "alpha",
        expect.any(Function),
        expect.objectContaining({ capture: true })
      );
      expect(addSpy).toHaveBeenCalledWith(
        "alpha",
        expect.any(Function),
        expect.objectContaining({ passive: true })
      );
    }
  );

  it.each(
    matrixCases.filter(
      ({ label, mode }) =>
        mode === "ref" && label !== "window" && label !== "document"
    )
  )(
    "retargets ref-backed listeners for $label",
    ({ createTarget }) => {
      expect.hasAssertions();
      const firstTarget = createTarget();
      const secondTarget = createTarget();
      const targetRef = {
        current: firstTarget,
      };
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: targetRef,
      });

      act(() => {
        dispatchEventByName(firstTarget, "alpha");
      });
      expect(callback).toHaveBeenCalledTimes(1);
      callback.mockClear();

      targetRef.current = secondTarget;
      rerender({
        callback,
        eventName: "alpha",
        target: targetRef,
      });

      act(() => {
        dispatchEventByName(firstTarget, "alpha");
        dispatchEventByName(secondTarget, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "does not reattach on plain rerender for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const addSpy = vi.spyOn(target, "addEventListener");
      const removeSpy = vi.spyOn(target, "removeEventListener");
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      rerender({
        callback,
        eventName: "alpha",
        target: asTargetLike(target, mode),
      });

      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).not.toHaveBeenCalled();
    }
  );

  it.each(matrixCases)(
    "preserves once semantics across rerenders for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const { rerender } = renderGenericEventListener({
        callback,
        eventName: "alpha",
        listenerOptions: { once: true },
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      rerender({
        callback,
        eventName: "alpha",
        listenerOptions: { once: true },
        target: asTargetLike(target, mode),
      });

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );

  it.each(matrixCases)(
    "survives StrictMode mount and unmount cycles for $label ($mode)",
    ({ createTarget, mode }) => {
      expect.hasAssertions();
      const target = createTarget();
      const callback = vi.fn();
      const { unmount } = renderHook(
        () =>
          useEventListener<EventTarget>("alpha", callback, {
            target: asTargetLike(target, mode),
          }),
        {
          wrapper: strictModeWrapper,
        }
      );

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      unmount();

      act(() => {
        dispatchEventByName(target, "alpha");
      });

      expect(callback).toHaveBeenCalledTimes(1);
    }
  );
});
