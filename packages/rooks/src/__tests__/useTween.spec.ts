import { renderHook, act } from "@testing-library/react-hooks";
import { useTween } from "../hooks/useTween";

jest.mock("raf", () => {
    const raf = (cb: any) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
    };
    raf.cancel = () => { };
    return raf;
});

describe("useTween", () => {
    let nowSpy: jest.SpyInstance;

    beforeAll(() => {
        jest.useFakeTimers();

        nowSpy = jest.spyOn(performance, "now");

        // We don't need to spy on requestAnimationFrame anymore since we mocked raf
        // But we need to make sure our raf mock updates the time
        // Wait, the raf mock defined above uses performance.now().
        // But we need to increment currentTime inside the timeout?
        // We can't access currentTime from the top-level mock easily.
        // We can rely on jest.advanceTimersByTime to fire the timeout.
        // But we need a way to increment currentTime.

        // Maybe we can just use a variable in the scope if we define mock inside?
        // No, jest.mock is hoisted.

        // Alternative: Mock raf to use setTimeout.
        // And in the test, we use an interval to increment time?
        // Or we spy on setTimeout? No.

        // Let's make performance.now() return Date.now() which jest mocks!
        // jest.useFakeTimers() mocks Date.
        // So if we make performance.now() return Date.now(), it should work with advanceTimersByTime.

        nowSpy.mockImplementation(() => Date.now());
    });

    afterAll(() => {
        jest.useRealTimers();
        nowSpy.mockRestore();
    });

    it("should start at 0", () => {
        const { result } = renderHook(() => useTween(1000));
        expect(result.current).toBe(0);
    });

    it("should progress over time", () => {
        const { result } = renderHook(() => useTween(1000));

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current).toBeGreaterThan(0);
        expect(result.current).toBeLessThan(1);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(1);
    });
});
