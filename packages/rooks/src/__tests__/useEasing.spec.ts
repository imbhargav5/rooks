import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEasing, Easing } from "../hooks/useEasing";

vi.mock("raf", () => {
    let nextId = 1;
    const pendingTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

    const raf = (cb: any) => {
        const id = nextId++;
        const timeoutId = setTimeout(() => {
            pendingTimeouts.delete(id);
            cb(performance.now());
        }, 16);
        pendingTimeouts.set(id, timeoutId);
        return id;
    };
    raf.cancel = (id: number) => {
        const timeoutId = pendingTimeouts.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            pendingTimeouts.delete(id);
        }
    };
    return { default: raf };
});

describe("useEasing", () => {
    let nowSpy: vi.SpyInstance;

    beforeAll(() => {
        vi.useFakeTimers();
        nowSpy = vi
            .spyOn(performance, "now")
            .mockImplementation(() => Date.now());
    });

    afterAll(() => {
        vi.useRealTimers();
        nowSpy.mockRestore();
    });

    beforeEach(() => {
        vi.clearAllTimers();
    });

    describe("initial state", () => {
        it("should start at 0 with autoStart: true (default)", () => {
            const { result } = renderHook(() => useEasing(1000));
            const [progress, controls] = result.current;

            expect(progress).toBe(0);
            expect(controls.state).toBe("running");
            expect(controls.direction).toBe("forward");
            expect(controls.endCount).toBe(0);
        });

        it("should start at 0 with autoStart: false", () => {
            const { result } = renderHook(() =>
                useEasing(1000, { autoStart: false })
            );
            const [progress, controls] = result.current;

            expect(progress).toBe(0);
            expect(controls.state).toBe("idle");
            expect(controls.direction).toBe("forward");
            expect(controls.endCount).toBe(0);
        });
    });

    describe("progress over time", () => {
        it("should progress from 0 to 1 over duration", () => {
            const { result } = renderHook(() => useEasing(1000));

            // Initial
            expect(result.current[0]).toBe(0);

            // Midway
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current[0]).toBeGreaterThan(0);
            expect(result.current[0]).toBeLessThan(1);

            // Complete
            act(() => {
                vi.advanceTimersByTime(600);
            });
            expect(result.current[0]).toBe(1);
            expect(result.current[1].state).toBe("idle");
            expect(result.current[1].endCount).toBe(1);
        });

        it("should apply easing function", () => {
            const { result: linearResult } = renderHook(() =>
                useEasing(1000, { easing: Easing.linear })
            );
            const { result: quadResult } = renderHook(() =>
                useEasing(1000, { easing: Easing.easeInQuad })
            );

            act(() => {
                vi.advanceTimersByTime(500);
            });

            // easeInQuad should be slower at the start
            expect(quadResult.current[0]).toBeLessThan(linearResult.current[0]);
        });
    });

    describe("controls", () => {
        it("should stop animation when stop() is called", () => {
            const { result } = renderHook(() => useEasing(1000));

            act(() => {
                vi.advanceTimersByTime(300);
            });

            act(() => {
                result.current[1].stop();
            });

            expect(result.current[1].state).toBe("idle");

            const progressAfterStop = result.current[0];

            // Progress should not change after stopping
            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current[0]).toBe(progressAfterStop);
        });

        it("should resume animation when start() is called after stop()", () => {
            const { result } = renderHook(() => useEasing(1000));

            act(() => {
                vi.advanceTimersByTime(300);
            });

            act(() => {
                result.current[1].stop();
            });

            const progressAfterStop = result.current[0];

            act(() => {
                result.current[1].start();
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current[1].state).toBe("running");
            expect(result.current[0]).toBeGreaterThan(progressAfterStop);
        });

        it("should reset to initial state when reset() is called", () => {
            const { result } = renderHook(() => useEasing(1000));

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(result.current[0]).toBeGreaterThan(0);

            act(() => {
                result.current[1].reset();
            });

            expect(result.current[0]).toBe(0);
            expect(result.current[1].state).toBe("idle");
            expect(result.current[1].direction).toBe("forward");
            expect(result.current[1].endCount).toBe(0);
        });

        it("should restart animation when restart() is called", () => {
            const { result } = renderHook(() => useEasing(1000));

            act(() => {
                vi.advanceTimersByTime(500);
            });

            const midProgress = result.current[0];
            expect(midProgress).toBeGreaterThan(0);

            act(() => {
                result.current[1].restart();
                vi.advanceTimersByTime(0); // Allow setTimeout to fire
            });

            expect(result.current[0]).toBe(0);
            expect(result.current[1].state).toBe("running");
        });
    });

    describe("loop option", () => {
        it("should loop when loop: true", () => {
            const { result } = renderHook(() =>
                useEasing(1000, { loop: true })
            );

            // Complete first iteration
            act(() => {
                vi.advanceTimersByTime(1100);
            });

            expect(result.current[1].endCount).toBe(1);
            expect(result.current[1].state).toBe("running");

            // Should still be running
            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(result.current[1].state).toBe("running");
        });

        it("should not loop when loop: false (default)", () => {
            const { result } = renderHook(() => useEasing(1000));

            act(() => {
                vi.advanceTimersByTime(1100);
            });

            expect(result.current[1].endCount).toBe(1);
            expect(result.current[1].state).toBe("idle");
        });
    });

    describe("alternate option", () => {
        it("should alternate direction when alternate: true and looping", () => {
            const { result } = renderHook(() =>
                useEasing(1000, { loop: true, alternate: true })
            );

            expect(result.current[1].direction).toBe("forward");

            // Complete first iteration
            act(() => {
                vi.advanceTimersByTime(1100);
            });

            expect(result.current[1].direction).toBe("backward");
            expect(result.current[1].endCount).toBe(1);

            // Complete second iteration
            act(() => {
                vi.advanceTimersByTime(1100);
            });

            expect(result.current[1].direction).toBe("forward");
            expect(result.current[1].endCount).toBe(2);
        });
    });

    describe("delay option", () => {
        it("should delay start of animation", () => {
            const { result } = renderHook(() =>
                useEasing(1000, { delay: 500 })
            );

            // During delay
            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(result.current[0]).toBe(0);

            // After delay
            act(() => {
                vi.advanceTimersByTime(200);
            });

            expect(result.current[0]).toBeGreaterThan(0);
        });
    });

    describe("onEnd callback", () => {
        it("should call onEnd when animation completes", () => {
            const onEnd = vi.fn();
            const { result } = renderHook(() =>
                useEasing(1000, { onEnd })
            );

            act(() => {
                vi.advanceTimersByTime(1100);
            });

            expect(onEnd).toHaveBeenCalledTimes(1);
            expect(result.current[1].endCount).toBe(1);
        });

        it("should call onEnd on each loop iteration", () => {
            const onEnd = vi.fn();
            renderHook(() =>
                useEasing(1000, { loop: true, onEnd })
            );

            act(() => {
                vi.advanceTimersByTime(1100);
            });
            expect(onEnd).toHaveBeenCalledTimes(1);

            act(() => {
                vi.advanceTimersByTime(1100);
            });
            expect(onEnd).toHaveBeenCalledTimes(2);
        });
    });

    describe("Easing presets", () => {
        it("should export Easing presets", () => {
            expect(Easing.linear).toBeDefined();
            expect(Easing.easeInQuad).toBeDefined();
            expect(Easing.easeOutQuad).toBeDefined();
            expect(Easing.easeInOutQuad).toBeDefined();
            expect(Easing.easeInCubic).toBeDefined();
            expect(Easing.easeOutCubic).toBeDefined();
            expect(Easing.easeInOutCubic).toBeDefined();
        });

        it("should have correct easing values", () => {
            // Linear: f(0.5) = 0.5
            expect(Easing.linear(0.5)).toBe(0.5);

            // easeInQuad: f(0.5) = 0.25
            expect(Easing.easeInQuad(0.5)).toBe(0.25);

            // All should start at 0 and end at 1
            Object.values(Easing).forEach((fn) => {
                expect(fn(0)).toBe(0);
                expect(fn(1)).toBe(1);
            });
        });
    });
});
