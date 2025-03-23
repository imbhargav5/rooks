import { renderHook, act } from '@testing-library/react-hooks';
import { useClipboard } from '../hooks/useClipboard';

describe('useClipboard', () => {
    // Mock Clipboard API
    const originalClipboard = { ...global.navigator.clipboard };
    const mockClipboard = {
        writeText: jest.fn(() => Promise.resolve()),
        readText: jest.fn(() => Promise.resolve('Clipboard content'))
    };

    beforeEach(() => {
        // Setup navigator.clipboard mock
        Object.defineProperty(global.navigator, 'clipboard', {
            value: mockClipboard,
            writable: true
        });

        // Clear mocks before each test
        mockClipboard.writeText.mockClear();
        mockClipboard.readText.mockClear();
    });

    afterAll(() => {
        // Restore original clipboard
        Object.defineProperty(global.navigator, 'clipboard', {
            value: originalClipboard,
            writable: true
        });
    });

    it('should provide copyToClipboard and readFromClipboard functions', () => {
        const { result } = renderHook(() => useClipboard());

        expect(result.current.copyToClipboard).toBeDefined();
        expect(typeof result.current.copyToClipboard).toBe('function');

        expect(result.current.readFromClipboard).toBeDefined();
        expect(typeof result.current.readFromClipboard).toBe('function');

        expect(result.current.clipboardState).toBeDefined();
    });

    it('should copy text to clipboard', async () => {
        const textToCopy = 'Hello, clipboard!';
        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            const success = await result.current.copyToClipboard(textToCopy);
            expect(success).toBe(true);
        });

        expect(mockClipboard.writeText).toHaveBeenCalledWith(textToCopy);
        expect(result.current.clipboardState.value).toBe(textToCopy);
        expect(result.current.clipboardState.copied).toBe(true);
        expect(result.current.clipboardState.error).toBeNull();
    });

    it('should read text from clipboard', async () => {
        const expectedText = 'Clipboard content';
        const { result } = renderHook(() => useClipboard());

        let clipboardText;
        await act(async () => {
            clipboardText = await result.current.readFromClipboard();
        });

        expect(mockClipboard.readText).toHaveBeenCalled();
        expect(clipboardText).toBe(expectedText);
        expect(result.current.clipboardState.value).toBe(expectedText);
        expect(result.current.clipboardState.copied).toBe(false);
        expect(result.current.clipboardState.error).toBeNull();
    });

    it('should handle errors when copying to clipboard', async () => {
        const error = new Error('Copy error');
        mockClipboard.writeText.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useClipboard());

        let success;
        await act(async () => {
            success = await result.current.copyToClipboard('Test text');
        });

        expect(success).toBe(false);
        expect(result.current.clipboardState.error).toEqual(error);
        expect(result.current.clipboardState.copied).toBe(false);
        expect(result.current.clipboardState.value).toBeNull();
    });

    it('should handle errors when reading from clipboard', async () => {
        const error = new Error('Read error');
        mockClipboard.readText.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            try {
                await result.current.readFromClipboard();
                // Should not reach here
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual(error);
            }
        });

        expect(result.current.clipboardState.error).toEqual(error);
        expect(result.current.clipboardState.copied).toBe(false);
        expect(result.current.clipboardState.value).toBeNull();
    });
}); 