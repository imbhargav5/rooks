import { renderHook } from '@testing-library/react-hooks';
import { useBreakpoint } from '../hooks/useBreakpoint';

// Mock the window object
const mockWindow = () => {
    // Save original window properties
    const originalInnerWidth = window.innerWidth;

    // Mock window innerWidth
    const setWindowWidth = (width: number) => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: width,
            writable: true
        });
    };

    // Restore original window properties
    const restoreWindow = () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: originalInnerWidth,
            writable: true
        });
    };

    return { setWindowWidth, restoreWindow };
};

describe('useBreakpoint', () => {
    // Suppress specific console errors
    const originalConsoleError = console.error;
    beforeAll(() => {
        console.error = jest.fn((...args) => {
            if (typeof args[0] === 'string' && args[0].includes('act')) {
                return;
            }
            originalConsoleError(...args);
        });
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
    };

    const { setWindowWidth, restoreWindow } = mockWindow();

    afterEach(() => {
        restoreWindow();
    });

    it('should initialize with correct breakpoint states based on window width', () => {
        // Set window width to 800px (greater than sm and md, less than lg and xl)
        setWindowWidth(800);

        const { result } = renderHook(() => useBreakpoint(breakpoints));

        expect(result.current.sm).toBe(true);
        expect(result.current.md).toBe(true);
        expect(result.current.lg).toBe(false);
        expect(result.current.xl).toBe(false);
    });

    it('should detect all breakpoints when width is large enough', () => {
        setWindowWidth(1500);

        const { result } = renderHook(() => useBreakpoint(breakpoints));

        expect(result.current.sm).toBe(true);
        expect(result.current.md).toBe(true);
        expect(result.current.lg).toBe(true);
        expect(result.current.xl).toBe(true);
    });

    it('should detect no breakpoints when width is too small', () => {
        setWindowWidth(500);

        const { result } = renderHook(() => useBreakpoint(breakpoints));

        expect(result.current.sm).toBe(false);
        expect(result.current.md).toBe(false);
        expect(result.current.lg).toBe(false);
        expect(result.current.xl).toBe(false);
    });

    it('should handle empty breakpoints object', () => {
        const { result } = renderHook(() => useBreakpoint({}));

        expect(result.current).toEqual({});
    });

    it('should handle custom breakpoint names', () => {
        const customBreakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };

        setWindowWidth(800);

        const { result } = renderHook(() => useBreakpoint(customBreakpoints));

        expect(result.current.mobile).toBe(true);
        expect(result.current.tablet).toBe(true);
        expect(result.current.desktop).toBe(false);
    });
}); 