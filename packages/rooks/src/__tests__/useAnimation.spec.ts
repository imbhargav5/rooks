import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAnimation } from "../hooks/useAnimation";

vi.mock("raf", () => {
    const raf = (cb: any) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
    };
    raf.cancel = () => { };
    return { default: raf };
});

describe("useAnimation", () => {
    let nowSpy: vi.SpyInstance;

    beforeAll(() => {
        vi.useFakeTimers();
        nowSpy = vi.spyOn(performance, "now").mockImplementation(() => Date.now());
    });

    afterAll(() => {
        vi.useRealTimers();
        nowSpy.mockRestore();
    });

    it("should start at 0", () => {
        const { result } = renderHook(() => useAnimation({ duration: 1000 }));
        expect(result.current).toBe(0);
    });

    it("should progress over time", () => {
        const { result } = renderHook(() => useAnimation({ duration: 1000 }));

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBeGreaterThan(0);
        expect(result.current).toBeLessThan(1);
    });
});
