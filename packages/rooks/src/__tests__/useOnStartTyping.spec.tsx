import { vi } from "vitest";
import { renderHook, render } from "@testing-library/react";
import { act } from "react";
import { useOnStartTyping } from "../hooks/useOnStartTyping";
import * as React from "react";

/**
 * Utility to simulate keydown events
 */
function fireKeydown(key: string, options: Partial<KeyboardEvent> = {}) {
    const event = new window.KeyboardEvent("keydown", {
        key,
        keyCode: key.charCodeAt(0),
        ...options,
        bubbles: true,
        cancelable: true,
    });
    document.dispatchEvent(event);
    return event;
}

describe("useOnStartTyping", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Remove focus from any element
        (document.activeElement as HTMLElement)?.blur?.();
    });

    it("should trigger callback for a-z/A-Z when includeAZ is true (default)", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback));
        act(() => {
            fireKeydown("a");
            fireKeydown("Z");
        });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls[0][0].key).toBe("a");
        expect(callback.mock.calls[1][0].key).toBe("Z");
    });

    it("should not trigger callback for a-z/A-Z when includeAZ is false", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback, { includeAZ: false }));
        act(() => {
            fireKeydown("a");
            fireKeydown("Z");
        });
        expect(callback).not.toHaveBeenCalled();
    });

    it("should trigger callback for 0-9 when includeNumbers is true", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback, { includeNumbers: true }));
        act(() => {
            fireKeydown("1");
            fireKeydown("9");
        });
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls[0][0].key).toBe("1");
        expect(callback.mock.calls[1][0].key).toBe("9");
    });

    it("should not trigger callback for 0-9 when includeNumbers is false (default)", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback));
        act(() => {
            fireKeydown("1");
            fireKeydown("9");
        });
        expect(callback).not.toHaveBeenCalled();
    });

    it("should not trigger callback when focused element is input, textarea, or contenteditable", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback));
        // Input
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.focus();
        act(() => {
            fireKeydown("a");
            fireKeydown("1");
        });
        // Textarea
        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        textarea.focus();
        act(() => {
            fireKeydown("a");
            fireKeydown("1");
        });
        // Contenteditable
        const div = document.createElement("div");
        div.setAttribute("contenteditable", "true");
        document.body.appendChild(div);
        div.focus();
        act(() => {
            fireKeydown("a");
            fireKeydown("1");
        });
        // Clean up
        input.remove();
        textarea.remove();
        div.remove();
        expect(callback).not.toHaveBeenCalled();
    });

    it("should not trigger callback for meta/ctrl/alt key combinations", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        renderHook(() => useOnStartTyping(callback));
        act(() => {
            fireKeydown("a", { metaKey: true });
            fireKeydown("a", { ctrlKey: true });
            fireKeydown("a", { altKey: true });
        });
        expect(callback).not.toHaveBeenCalled();
    });

    it("should clean up event listeners on unmount", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        const { unmount } = renderHook(() => useOnStartTyping(callback));
        unmount();
        act(() => {
            fireKeydown("a");
        });
        expect(callback).not.toHaveBeenCalled();
    });

    it("should not recreate callback unnecessarily", () => {
        expect.hasAssertions();
        const callback = vi.fn();
        const { rerender } = renderHook(({ cb }) => useOnStartTyping(cb), {
            initialProps: { cb: callback },
        });
        const cb2 = vi.fn();
        rerender({ cb: cb2 });
        act(() => {
            fireKeydown("a");
        });
        // Only the latest callback should be called
        expect(cb2).toHaveBeenCalledTimes(1);
        expect(callback).not.toHaveBeenCalled();
    });

    it("should allow all keys including first one to be entered into focused input via ref", () => {
        expect.hasAssertions();
        const callback = vi.fn();

        // Create a test component that uses the hook and renders an input
        function TestComponent() {
            const inputRef = React.useRef<HTMLInputElement>(null);

            useOnStartTyping((event) => {
                // Focus the input when typing starts
                if (inputRef.current) {
                    inputRef.current.focus();
                    // Simulate the first keystroke being added to the input
                    // This is because in jsdom, the input value is not updated automatically
                    // when a keydown event is triggered
                    inputRef.current.value += event.key;
                }
                callback(event);
            });

            return <input ref={inputRef} data-testid="test-input" />;
        }

        const { getByTestId } = render(<TestComponent />);
        const input = getByTestId("test-input") as HTMLInputElement;

        // First keystroke should trigger callback and focus input
        act(() => {
            fireKeydown("h");
        });

        // Verify first keystroke behavior
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({ key: "h" }));
        expect(input).toBe(document.activeElement);
        expect(input.value).toBe("h");

        // Subsequent keystrokes should not trigger callback since input is now focused
        // In a real browser, these would automatically be added to the input
        // We simulate this behavior in the test
        act(() => {
            fireKeydown("e");
            // Simulate browser adding keystroke to focused input
            input.value += "e";
        });

        act(() => {
            fireKeydown("l");
            // Simulate browser adding keystroke to focused input
            input.value += "l";
        });

        act(() => {
            fireKeydown("l");
            // Simulate browser adding keystroke to focused input
            input.value += "l";
        });

        act(() => {
            fireKeydown("o");
            // Simulate browser adding keystroke to focused input
            input.value += "o";
        });

        // Callback should only have been called once (for the first keystroke)
        expect(callback).toHaveBeenCalledTimes(1);

        // Verify the input received all the characters including the first one
        expect(input.value).toBe("hello");
        expect(input).toBe(document.activeElement);
    });
}); 