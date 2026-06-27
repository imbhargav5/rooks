import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTween } from "../hooks/useTween";

vi.mock("raf", () => {
    const raf = (cb: FrameRequestCallback) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
    };
    raf.cancel = () => { };
    return { default: raf };
});

describe("useTween", () => {
    let nowSpy: vi.SpyInstance;

    beforeAll(() => {
        vi.useFakeTimers();

        nowSpy = vi.spyOn(performance, "now");
        nowSpy.mockImplementation(() => Date.now());
    });

    afterAll(() => {
        vi.useRealTimers();
        nowSpy.mockRestore();
    });

    it("should start at 0", () => {
        const { result } = renderHook(() => useTween(1000));
        expect(result.current).toBe(0);
    });

    it("should progress over time", () => {
        const { result } = renderHook(() => useTween(1000));

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBeGreaterThan(0);
        expect(result.current).toBeLessThan(1);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(1);
    });
});
