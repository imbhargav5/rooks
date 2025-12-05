import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import { useDebouncedAsyncEffect } from "@/hooks/useDebouncedAsyncEffect";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useDebouncedAsyncEffect", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be defined", () => {
        expect.hasAssertions();
        expect(useDebouncedAsyncEffect).toBeDefined();
    });

    it("should debounce async effect execution", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { rerender } = renderHook(
            ({ value }) => useDebouncedAsyncEffect(mockAsyncEffect, [value], 500),
            { initialProps: { value: 0 } }
        );

        // Effect should not be called immediately
        expect(mockAsyncEffect).not.toHaveBeenCalled();

        // Advance timers
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);

        // Change dependency
        rerender({ value: 1 });
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);

        // Advance timers again
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(2);
    });

    it("should cancel pending async effect on rapid dependency changes", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { rerender } = renderHook(
            ({ value }) => useDebouncedAsyncEffect(mockAsyncEffect, [value], 500),
            { initialProps: { value: 0 } }
        );

        // Change dependency multiple times rapidly
        rerender({ value: 1 });
        vi.advanceTimersByTime(100);
        rerender({ value: 2 });
        vi.advanceTimersByTime(100);
        rerender({ value: 3 });
        vi.advanceTimersByTime(100);

        // Effect should not have been called yet
        expect(mockAsyncEffect).not.toHaveBeenCalled();

        // Advance timers to complete the debounce (400ms more to reach 500ms from last change)
        vi.advanceTimersByTime(400);
        await vi.runAllTimersAsync();

        // Effect should be called only once
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);
    });

    it("should provide shouldContinueEffect callback", async () => {
        expect.hasAssertions();
        const shouldContinueChecks: boolean[] = [];

        const mockAsyncEffect = vi.fn(async (shouldContinueEffect) => {
            await wait(10);
            shouldContinueChecks.push(shouldContinueEffect());
            return "result";
        });

        renderHook(() => useDebouncedAsyncEffect(mockAsyncEffect, [], 500));

        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();

        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);
        expect(shouldContinueChecks[0]).toBe(true);
    });

    it("should call cleanup function with result", async () => {
        expect.hasAssertions();
        const mockCleanup = vi.fn();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "test-result";
        });

        const { rerender } = renderHook(
            ({ value }) =>
                useDebouncedAsyncEffect(mockAsyncEffect, [value], 500, mockCleanup),
            { initialProps: { value: 0 } }
        );

        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);

        // Change dependency to trigger cleanup
        rerender({ value: 1 });
        expect(mockCleanup).toHaveBeenCalledTimes(1);
        expect(mockCleanup).toHaveBeenCalledWith("test-result");
    });

    it("should cancel pending async effect on unmount", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { unmount } = renderHook(() =>
            useDebouncedAsyncEffect(mockAsyncEffect, [], 500)
        );

        // Effect should not be called immediately
        expect(mockAsyncEffect).not.toHaveBeenCalled();

        // Unmount before debounce completes
        unmount();

        // Advance timers
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();

        // Effect should not be called after unmount
        expect(mockAsyncEffect).not.toHaveBeenCalled();
    });

    it("should work with leading option", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { rerender } = renderHook(
            ({ value }) =>
                useDebouncedAsyncEffect(mockAsyncEffect, [value], 500, undefined, {
                    leading: true,
                }),
            { initialProps: { value: 0 } }
        );

        // With leading option, effect should be called immediately
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);

        // Change dependency
        rerender({ value: 1 });
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(2);
    });

    it("should work with trailing option set to false", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { rerender } = renderHook(
            ({ value }) =>
                useDebouncedAsyncEffect(mockAsyncEffect, [value], 500, undefined, {
                    trailing: false,
                }),
            { initialProps: { value: 0 } }
        );

        expect(mockAsyncEffect).not.toHaveBeenCalled();

        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        // With trailing: false, effect should not be called
        expect(mockAsyncEffect).not.toHaveBeenCalled();

        // Change dependency
        rerender({ value: 1 });
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).not.toHaveBeenCalled();
    });

    it("should respect default delay of 500ms", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            return "result";
        });

        renderHook(() => useDebouncedAsyncEffect(mockAsyncEffect, []));

        expect(mockAsyncEffect).not.toHaveBeenCalled();

        vi.advanceTimersByTime(499);
        expect(mockAsyncEffect).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple dependencies", async () => {
        expect.hasAssertions();
        const mockAsyncEffect = vi.fn(async () => {
            await wait(10);
            return "result";
        });

        const { rerender } = renderHook(
            ({ value1, value2 }) =>
                useDebouncedAsyncEffect(mockAsyncEffect, [value1, value2], 500),
            { initialProps: { value1: 0, value2: "a" } }
        );

        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(1);

        // Change first dependency
        rerender({ value1: 1, value2: "a" });
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(2);

        // Change second dependency
        rerender({ value1: 1, value2: "b" });
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(3);

        // Change both dependencies
        rerender({ value1: 2, value2: "c" });
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(mockAsyncEffect).toHaveBeenCalledTimes(4);
    });

    it("should only process results from the latest call", async () => {
        expect.hasAssertions();
        const results: string[] = [];
        let callCount = 0;

        const mockAsyncEffect = vi.fn(
            async (shouldContinueEffect: () => boolean) => {
                const thisCall = ++callCount;
                await wait(100);

                if (shouldContinueEffect()) {
                    results.push(`call-${thisCall}`);
                }

                return `result-${thisCall}`;
            }
        );

        const { rerender } = renderHook(
            ({ value }) => useDebouncedAsyncEffect(mockAsyncEffect, [value], 200),
            { initialProps: { value: 0 } }
        );

        // The hook runs on mount, scheduling the first call.
        // Let the first debounced effect trigger.
        vi.advanceTimersByTime(200);

        // Before the first async operation (wait(100)) completes,
        // trigger a second call.
        rerender({ value: 1 });
        vi.advanceTimersByTime(200);

        // Now, let all pending async operations and timers complete.
        await vi.runAllTimersAsync();

        // Both async operations should have been called
        expect(mockAsyncEffect).toHaveBeenCalledTimes(2);

        // But only the result from the latest call should have been processed.
        expect(results).toEqual(["call-2"]);
    });

    it("should handle errors in async effects", async () => {
        expect.hasAssertions();
        const ERROR_MESSAGE = "Test error";

        const { result } = renderHook(() => {
            const [error, setError] = useState<Error | null>(null);

            useDebouncedAsyncEffect(
                async (shouldContinueEffect): Promise<void> => {
                    try {
                        await new Promise<void>((_resolve, reject) => {
                            setTimeout(() => {
                                reject(new Error(ERROR_MESSAGE));
                            }, 10);
                        });
                    } catch (err) {
                        if (shouldContinueEffect() && err instanceof Error) {
                            setError(err);
                        }
                    }
                },
                [],
                500
            );

            return { error };
        });

        expect(result.current.error).toBe(null);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(500);
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(10);
        });

        expect(result.current.error).toBeTruthy();
        expect((result.current.error as Error).message).toBe(ERROR_MESSAGE);
    });
});

