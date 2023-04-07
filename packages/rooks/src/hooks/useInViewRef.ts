import { useEffect, useCallback, useState } from "react";
import type { HTMLElementOrNull, CallbackRef } from "../utils/utils";
import { noop } from "@/utils/noop";

const config: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: [0, 1],
};

function useInViewRef(): [CallbackRef, boolean];
function useInViewRef(
  options: IntersectionObserverInit
): [CallbackRef, boolean];
function useInViewRef(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): [CallbackRef, boolean];
function useInViewRef(
  callbackOrOptions?: IntersectionObserverCallback | IntersectionObserverInit,
  options?: IntersectionObserverInit
): [CallbackRef, boolean] {
  const callback =
    typeof callbackOrOptions === "function" ? callbackOrOptions : noop;
  const opts =
    typeof callbackOrOptions === "object"
      ? callbackOrOptions
      : options || config;

  const { root = null, rootMargin, threshold } = opts;

  const [node, setNode] = useState<HTMLElementOrNull>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    if (node) {
      const observer = new IntersectionObserver((entries, observerRef) => {
        for (const { isIntersecting } of entries) setInView(isIntersecting);
        callback(entries, observerRef);
      }, opts);

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }

    return noop;
  }, [node, callback, root, rootMargin, threshold, opts]);

  const ref = useCallback((nodeElement: HTMLElementOrNull) => {
    setNode(nodeElement);
  }, []);

  return [ref, inView];
}

export { useInViewRef };
