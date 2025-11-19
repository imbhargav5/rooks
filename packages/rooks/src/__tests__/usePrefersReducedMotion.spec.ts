import { renderHook } from "@testing-library/react-hooks";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

describe("usePrefersReducedMotion", () => {
    let matchMediaMock: jest.Mock;

    beforeEach(() => {
        matchMediaMock = jest.fn();
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: matchMediaMock,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return true if prefers-reduced-motion is reduce", () => {
        matchMediaMock.mockReturnValue({
            matches: true,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        });

        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(true);
        expect(matchMediaMock).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    });

    it("should return false if prefers-reduced-motion is not reduce", () => {
        matchMediaMock.mockReturnValue({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        });

        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(false);
        expect(matchMediaMock).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    });
});
