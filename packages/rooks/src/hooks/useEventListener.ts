import { useCallback, useEffect, useRef } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { useFreshRef } from "./useFreshRef";
import type { ListenerOptions } from "@/types/utils";
import {
  resolveEventTarget,
  type EventForTarget,
  type EventNameForTarget,
  type EventTargetLike,
} from "@/utils/eventTarget";

export type UseEventListenerOptions<TTarget extends EventTarget> = {
  target: EventTargetLike<TTarget>;
  listenerOptions?: ListenerOptions;
  when?: boolean;
  isLayoutEffect?: boolean;
};

type ActiveSubscription = {
  target: EventTarget;
  eventName: string;
  listener: EventListener;
  listenerOptions: ListenerOptions;
  capture: boolean | undefined;
  once: boolean | undefined;
  passive: boolean | undefined;
  signal: AbortSignal | undefined;
  isLayoutEffect: boolean;
};

/**
 * useEventListener
 * @description A strongly typed event-listener hook for DOM and browser targets.
 * @see {@link https://rooks.vercel.app/docs/hooks/useEventListener}
 */
function useEventListener<
  TTarget extends EventTarget,
  TEventName extends EventNameForTarget<NoInfer<TTarget>>,
>(
  eventName: TEventName,
  callback: (event: EventForTarget<NoInfer<TTarget>, TEventName>) => void,
  options: UseEventListenerOptions<TTarget>
): void {
  const {
    target,
    listenerOptions = {},
    when = true,
    isLayoutEffect = false,
  } = options;
  const callbackRef = useFreshRef(callback, true);
  const subscriptionRef = useRef<ActiveSubscription | null>(null);
  const capture =
    typeof listenerOptions === "boolean"
      ? listenerOptions
      : listenerOptions.capture;
  const once =
    typeof listenerOptions === "boolean" ? undefined : listenerOptions.once;
  const passive =
    typeof listenerOptions === "boolean" ? undefined : listenerOptions.passive;
  const signal =
    typeof listenerOptions === "boolean" ? undefined : listenerOptions.signal;

  const listener = useCallback<EventListener>(
    (event) => {
      callbackRef.current(
        event as EventForTarget<NoInfer<TTarget>, TEventName>
      );
    },
    [callbackRef]
  );

  const detach = useCallback(() => {
    const subscription = subscriptionRef.current;
    if (!subscription) {
      return;
    }

    subscription.target.removeEventListener(
      subscription.eventName,
      subscription.listener,
      subscription.listenerOptions
    );
    subscriptionRef.current = null;
  }, []);

  const synchronize = () => {
    const resolvedTarget = resolveEventTarget(target);
    const subscription = subscriptionRef.current;
    const isCurrent =
      subscription?.target === resolvedTarget &&
      subscription.eventName === eventName &&
      subscription.listener === listener &&
      subscription.capture === capture &&
      subscription.once === once &&
      subscription.passive === passive &&
      subscription.signal === signal &&
      subscription.isLayoutEffect === isLayoutEffect;

    if (!when || !resolvedTarget) {
      detach();
      return;
    }

    if (isCurrent) {
      return;
    }

    detach();
    resolvedTarget.addEventListener(eventName, listener, listenerOptions);
    subscriptionRef.current = {
      target: resolvedTarget,
      eventName,
      listener,
      listenerOptions,
      capture,
      once,
      passive,
      signal,
      isLayoutEffect,
    };
  };

  // Ref targets change during commit, so synchronize after every commit and
  // retain the existing listener when the resolved configuration is unchanged.
  useIsomorphicEffect(() => {
    if (isLayoutEffect) {
      synchronize();
    }
  });

  useEffect(() => {
    if (!isLayoutEffect) {
      synchronize();
    }
  });

  useIsomorphicEffect(() => {
    return () => {
      detach();
    };
  }, [detach]);
}

export { useEventListener };
