import { useState, useCallback } from "react";

/**
 * Return value for the useClipboard hook
 */
interface UseClipboardReturnValue {
  /**
   * The current text content from the clipboard
   */
  text: string | null;
  /**
   * Copy text to the clipboard
   * @param value - The text to copy
   * @returns Promise that resolves when copy is complete
   */
  copy: (value: string) => Promise<void>;
  /**
   * Read text from the clipboard
   * @returns Promise that resolves when read is complete
   */
  paste: () => Promise<void>;
  /**
   * Whether the Clipboard API is supported
   */
  isSupported: boolean;
  /**
   * Any error that occurred during clipboard operations
   */
  error: Error | null;
}

/**
 * useClipboard hook
 *
 * Read from and write to the system clipboard using the Clipboard API.
 * Provides methods to copy text to clipboard and read text from clipboard,
 * along with support detection and error handling.
 *
 * @returns Object containing clipboard operations and state
 *
 * @example
 * ```tsx
 * import { useClipboard } from "rooks";
 *
 * function ClipboardDemo() {
 *   const { copy, paste, text, isSupported, error } = useClipboard();
 *   const [inputValue, setInputValue] = useState("");
 *
 *   const handleCopy = async () => {
 *     await copy(inputValue);
 *   };
 *
 *   const handlePaste = async () => {
 *     await paste();
 *   };
 *
 *   if (!isSupported) {
 *     return <div>Clipboard API not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <input
 *         value={inputValue}
 *         onChange={(e) => setInputValue(e.target.value)}
 *         placeholder="Enter text to copy"
 *       />
 *       <button onClick={handleCopy}>Copy</button>
 *       <button onClick={handlePaste}>Paste</button>
 *       {text && <p>Clipboard: {text}</p>}
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useClipboard
 */
function useClipboard(): UseClipboardReturnValue {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "clipboard" in navigator;

  const copy = useCallback(
    async (value: string): Promise<void> => {
      if (!isSupported) {
        const err = new Error("Clipboard API is not supported");
        setError(err);
        throw err;
      }

      try {
        await navigator.clipboard.writeText(value);
        setText(value);
        setError(null);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to copy to clipboard");
        setError(error);
        throw error;
      }
    },
    [isSupported]
  );

  const paste = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      const err = new Error("Clipboard API is not supported");
      setError(err);
      throw err;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to read from clipboard");
      setError(error);
      throw error;
    }
  }, [isSupported]);

  return {
    text,
    copy,
    paste,
    isSupported,
    error,
  };
}

export { useClipboard };
export type { UseClipboardReturnValue };
