import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

describe("usePrefersReducedMotion", () => {
    let matchMediaMock: vi.Mock;

    beforeEach(() => {
        matchMediaMock = vi.fn();
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: matchMediaMock,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should return true if prefers-reduced-motion is reduce", () => {
        matchMediaMock.mockReturnValue({
            matches: true,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(true);
        expect(matchMediaMock).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    });

    it("should return false if prefers-reduced-motion is not reduce", () => {
        matchMediaMock.mockReturnValue({
            matches: false,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });

        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(false);
        expect(matchMediaMock).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    });
});
