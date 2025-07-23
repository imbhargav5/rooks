/**
 * useDocumentTitle
 * @description A hook to easily update document title with React
 */
import { noop } from "@/utils/noop";
import { useEffect, useRef } from "react";

type UseDocumentTitleOptions = {
  resetOnUnmount?: boolean;
};

/**
 * useDocumentTitle hook
 *
 * This hook allows you to set the document title.
 *
 * @param title - The new title for the document
 * @param options - An optional object with a `resetOnUnmount` property to control whether the document title should be reset to its previous value when the component is unmounted. Defaults to false.
 *
 * @example
 * function App() {
 *   useDocumentTitle("My App", { resetOnUnmount: true });
 *   return <div>Hello, world!</div>;
 * }
 * @see {@link https://rooks.vercel.app/docs/hooks/useDocumentTitle}
 */
function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const isBrowser = typeof window !== "undefined";
  const prevTitleRef = useRef(isBrowser ? document.title : "");
  const { resetOnUnmount = false } = options;

  useEffect(() => {
    if (isBrowser) {
      document.title = title;
      const lastTitle = prevTitleRef.current;
      if (resetOnUnmount) {
        return () => {
          document.title = lastTitle;
        };
      }
    }
    return noop;
  }, [title, isBrowser, resetOnUnmount]);
}

export { useDocumentTitle };
