import { useFreshRef } from "./useFreshRef";
import { useEventListener } from "./useEventListener";

export type UseBeforeUnloadOptions = {
  when?: boolean | (() => boolean);
  message?: string;
  onBeforeUnload?: (event: BeforeUnloadEvent) => boolean | string | void;
};

/**
 * useBeforeUnload
 * @description Prompts the user before unloading the page when the guard passes.
 * @see {@link https://rooks.vercel.app/docs/hooks/useBeforeUnload}
 */
function useBeforeUnload(options: UseBeforeUnloadOptions = {}): void {
  const { when = true, message, onBeforeUnload } = options;
  const whenRef = useFreshRef(when, true);
  const messageRef = useFreshRef(message, true);
  const callbackRef = useFreshRef(onBeforeUnload, true);
  const shouldListen =
    typeof when === "function" || when || typeof onBeforeUnload === "function";

  useEventListener(
    "beforeunload",
    (event) => {
      const guardValue = whenRef.current;
      const shouldBlock =
        typeof guardValue === "function" ? guardValue() : guardValue;
      const callbackResult = callbackRef.current?.(event);
      const callbackMessage =
        typeof callbackResult === "string" ? callbackResult : undefined;

      if (shouldBlock || callbackResult === true || callbackMessage) {
        event.preventDefault();
        event.returnValue = callbackMessage ?? messageRef.current ?? "";
      }
    },
    {
      target: typeof window !== "undefined" ? window : null,
      when: shouldListen,
    }
  );
}

export { useBeforeUnload };
