import { renderHook, act } from "@testing-library/react-hooks";
import { useAnimation } from "../hooks/useAnimation";

jest.mock("raf", () => {
    const raf = (cb: any) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
    };
    raf.cancel = () => { };
    return raf;
});

describe("useAnimation", () => {
    let nowSpy: jest.SpyInstance;

    beforeAll(() => {
        jest.useFakeTimers();
        nowSpy = jest.spyOn(performance, "now").mockImplementation(() => Date.now());
    });

    afterAll(() => {
        jest.useRealTimers();
        nowSpy.mockRestore();
    });

    it("should start at 0", () => {
        const { result } = renderHook(() => useAnimation({ duration: 1000 }));
        expect(result.current).toBe(0);
    });

    it("should progress over time", () => {
        const { result } = renderHook(() => useAnimation({ duration: 1000 }));

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current).toBeGreaterThan(0);
        expect(result.current).toBeLessThan(1);
    });
});
