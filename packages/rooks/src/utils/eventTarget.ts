import type { RefObject } from "react";

export type EventTargetRef<T extends EventTarget> = RefObject<T | null>;
export type EventTargetLike<T extends EventTarget> =
  | T
  | EventTargetRef<T>
  | null
  | undefined;

export type SupportedEventTarget =
  | Window
  | Document
  | HTMLElement
  | SVGElement
  | MediaQueryList
  | EventTarget;

export type EventNameForTarget<TTarget extends EventTarget> =
  TTarget extends Window
    ? keyof WindowEventMap
    : TTarget extends Document
      ? keyof DocumentEventMap
      : TTarget extends HTMLElement
        ? keyof HTMLElementEventMap
        : TTarget extends SVGElement
          ? keyof SVGElementEventMap
          : TTarget extends MediaQueryList
            ? keyof MediaQueryListEventMap
            : string;

export type EventForTarget<
  TTarget extends EventTarget,
  TEventName extends PropertyKey,
> = TTarget extends Window
  ? TEventName extends keyof WindowEventMap
    ? WindowEventMap[TEventName]
    : never
  : TTarget extends Document
    ? TEventName extends keyof DocumentEventMap
      ? DocumentEventMap[TEventName]
      : never
    : TTarget extends HTMLElement
      ? TEventName extends keyof HTMLElementEventMap
        ? HTMLElementEventMap[TEventName]
        : never
      : TTarget extends SVGElement
        ? TEventName extends keyof SVGElementEventMap
          ? SVGElementEventMap[TEventName]
          : never
        : TTarget extends MediaQueryList
          ? TEventName extends keyof MediaQueryListEventMap
            ? MediaQueryListEventMap[TEventName]
            : never
          : Event;

export function isRefObject<T extends EventTarget>(
  value: EventTargetLike<T>
): value is EventTargetRef<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "current" in value &&
    !("addEventListener" in value)
  );
}

export function resolveEventTarget<T extends EventTarget>(
  target: EventTargetLike<T>
): T | null {
  if (!target) {
    return null;
  }

  if (isRefObject(target)) {
    return target.current;
  }

  return target;
}
