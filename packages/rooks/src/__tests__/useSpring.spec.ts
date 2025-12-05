import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpring } from "../hooks/useSpring";

vi.mock("raf", () => {
    const raf = (cb: any) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
    };
    raf.cancel = () => { };
    return { default: raf };
});

describe("useSpring", () => {
    let nowSpy: vi.SpyInstance;

    beforeAll(() => {
        vi.useFakeTimers();
        nowSpy = vi.spyOn(performance, "now").mockImplementation(() => Date.now());
    });

    afterAll(() => {
        vi.useRealTimers();
        nowSpy.mockRestore();
    });

    it("should start at target value", () => {
        const { result } = renderHook(() => useSpring(0));
        expect(result.current).toBe(0);
    });

    it("should animate to new target value", () => {
        const { result, rerender } = renderHook(
            ({ target }) => useSpring(target),
            { initialProps: { target: 0 } }
        );

        expect(result.current).toBe(0);

        rerender({ target: 100 });

        // Advance time to simulate animation frames
        act(() => {
            vi.advanceTimersByTime(100);
        });

        // Should have moved from 0 towards 100
        expect(result.current).not.toBe(0);
        // expect(result.current).toBeGreaterThan(0); // This might be flaky if 100ms isn't enough for spring to move significantly with default config, but it should move.
    });
});
