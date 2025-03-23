import { useCallback, useState } from "react";

type ClipboardState = {
    value: string | null;
    error: Error | null;
    copied: boolean;
};

type ClipboardHandler = {
    copyToClipboard: (text: string) => Promise<boolean>;
    readFromClipboard: () => Promise<string>;
    clipboardState: ClipboardState;
};

/**
 * useClipboard
 * @description A hook to interact with the Clipboard API
 * @returns {ClipboardHandler} An object with methods to interact with the clipboard
 * @see {@link https://rooks.vercel.app/docs/useClipboard}
 * 
 * @example
 * 
 * const { copyToClipboard, readFromClipboard, clipboardState } = useClipboard();
 * 
 * // Copy text
 * copyToClipboard("Text to copy");
 * 
 * // Read from clipboard (with permissions)
 * readFromClipboard().then(text => console.log(text));
 * 
 * // Check clipboard state
 * if (clipboardState.error) {
 *   console.error(clipboardState.error);
 * }
 */
function useClipboard(): ClipboardHandler {
    const [clipboardState, setClipboardState] = useState<ClipboardState>({
        value: null,
        error: null,
        copied: false,
    });

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            setClipboardState({
                value: text,
                error: null,
                copied: true,
            });
            return true;
        } catch (error) {
            setClipboardState({
                value: null,
                error: error instanceof Error ? error : new Error(String(error)),
                copied: false,
            });
            return false;
        }
    }, []);

    const readFromClipboard = useCallback(async (): Promise<string> => {
        try {
            const text = await navigator.clipboard.readText();
            setClipboardState({
                value: text,
                error: null,
                copied: false,
            });
            return text;
        } catch (error) {
            setClipboardState({
                value: null,
                error: error instanceof Error ? error : new Error(String(error)),
                copied: false,
            });
            throw error;
        }
    }, []);

    return {
        copyToClipboard,
        readFromClipboard,
        clipboardState,
    };
}

export { useClipboard }; 