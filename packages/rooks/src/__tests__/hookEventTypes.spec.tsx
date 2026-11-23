import { renderHook } from "@testing-library/react";
import { expectTypeOf } from "vitest";
import { useDocumentEventListener } from "@/hooks/useDocumentEventListener";
import { useEventListenerRef } from "@/hooks/useEventListenerRef";
import { useWebWorker } from "@/hooks/useWebWorker";
import { useWindowEventListener } from "@/hooks/useWindowEventListener";

describe("hook event types", () => {
  it("infers the event type from the event name", () => {
    expect.hasAssertions();
    renderHook(() => {
      useWindowEventListener("keydown", (event) => {
        expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
      });
      useDocumentEventListener("visibilitychange", (event) => {
        expectTypeOf(event).toEqualTypeOf<Event>();
      });
      useDocumentEventListener("keydown", (event) => {
        expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
      });
      useEventListenerRef("pointerdown", (event) => {
        expectTypeOf(event).toEqualTypeOf<PointerEvent>();
      });
      useEventListenerRef("my-custom-event", (event) => {
        expectTypeOf(event).toEqualTypeOf<Event>();
      });
    });
    expect(true).toBe(true);
  });

  it("still accepts previously valid callback shapes", () => {
    expect.hasAssertions();
    const legacyCallback = (...args: unknown[]): void => {
      void args;
    };
    const eventCallback: EventListener = () => {};
    renderHook(() => {
      useWindowEventListener("resize", legacyCallback);
      useWindowEventListener("resize", eventCallback);
      useDocumentEventListener("keyup", legacyCallback);
      useEventListenerRef("click", legacyCallback);
      const eventName: string = "click";
      useEventListenerRef(eventName, legacyCallback);
    });
    expect(true).toBe(true);
  });

  it("types worker messages only when requested", () => {
    expect.hasAssertions();
    const untyped = () => useWebWorker("worker.js");
    type Untyped = ReturnType<typeof untyped>;
    expectTypeOf<Parameters<Untyped["postMessage"]>[0]>().toBeAny();

    const typed = () => useWebWorker<number, { n: number }>("worker.js");
    type Typed = ReturnType<typeof typed>;
    expectTypeOf<Parameters<Typed["postMessage"]>[0]>().toEqualTypeOf<{
      n: number;
    }>();
    expectTypeOf<Typed["data"]>().toEqualTypeOf<number | null>();
    expect(true).toBe(true);
  });
});
