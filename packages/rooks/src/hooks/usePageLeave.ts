import { useEffect, useRef } from "react";
import { useFreshCallback } from "./useFreshCallback";

/**
 * usePageLeave hook
 *
 * Detect when user is about to leave the page using beforeunload and visibilitychange events.
 * Useful for saving drafts, confirming navigation, or tracking engagement.
 *
 * @param onPageLeave - Callback function to execute when user is leaving the page
 *
 * @example
 * ```tsx
 * import { usePageLeave } from "rooks";
 *
 * function DraftEditor() {
 *   const [draft, setDraft] = useState("");
 *   const [saved, setSaved] = useState(true);
 *
 *   usePageLeave(() => {
 *     if (!saved && draft) {
 *       // Save draft before leaving
 *       localStorage.setItem("draft", draft);
 *     }
 *   });
 *
 *   const handleChange = (e) => {
 *     setDraft(e.target.value);
 *     setSaved(false);
 *   };
 *
 *   const handleSave = () => {
 *     localStorage.setItem("draft", draft);
 *     setSaved(true);
 *   };
 *
 *   return (
 *     <div>
 *       <textarea value={draft} onChange={handleChange} />
 *       <button onClick={handleSave}>Save Draft</button>
 *       {!saved && <p>You have unsaved changes</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Confirm before leaving with unsaved changes
 * function FormWithConfirm() {
 *   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 *
 *   usePageLeave(() => {
 *     if (hasUnsavedChanges) {
 *       return "You have unsaved changes. Are you sure you want to leave?";
 *     }
 *   });
 *
 *   return <form>Form fields here</form>;
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/usePageLeave
 */
function usePageLeave(onPageLeave: () => void | string): void {
  const freshCallback = useFreshCallback(onPageLeave);
  const isLeavingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent): string | void => {
      isLeavingRef.current = true;
      const result = freshCallback();

      // If callback returns a string, show confirmation dialog
      if (typeof result === "string") {
        event.preventDefault();
        event.returnValue = result;
        return result;
      }
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "hidden" && !isLeavingRef.current) {
        freshCallback();
      }
    };

    const handlePageHide = (): void => {
      if (!isLeavingRef.current) {
        freshCallback();
      }
    };

    // beforeunload: Fired when the window is about to unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // visibilitychange: Fired when page becomes hidden (tab switch, minimize, etc.)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // pagehide: Fired when navigating away from the page (more reliable than beforeunload in some cases)
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      isLeavingRef.current = false;
    };
  }, [freshCallback]);
}

export { usePageLeave };
