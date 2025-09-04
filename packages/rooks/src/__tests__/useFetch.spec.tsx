import { renderHook, act } from "@testing-library/react";
import { useFetch } from "../hooks/useFetch";

// Mock fetch globally
const mockFetch = jest.fn();
Object.defineProperty(global, 'fetch', {
    value: mockFetch,
    writable: true,
});

describe("useFetch", () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it("should be defined", () => {
        expect(useFetch).toBeDefined();
    });

    it("should return initial state", () => {
        const { result } = renderHook(() => useFetch("https://api.example.com/users/1"));

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.startFetch).toBe("function");
    });

    it("should not fetch automatically on mount", () => {
        renderHook(() => useFetch("https://api.example.com/users/1"));

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should fetch when fetch function is called", async () => {
        const mockResponse = { name: "John Doe", email: "john@example.com" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const { result } = renderHook(() => useFetch<User>("https://api.example.com/users/1"));

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe(null);

        // Call startFetch function
        await act(async () => {
            await result.current.startFetch();
        });

        expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users/1", expect.any(Object));
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("should handle loading state during fetch", async () => {
        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValueOnce(promise);

        const { result } = renderHook(() => useFetch("https://api.example.com/users/1"));

        // Start fetch
        let fetchPromise: Promise<void>;
        act(() => {
            fetchPromise = result.current.startFetch();
        });

        expect(result.current.loading).toBe(true);

        // Resolve the promise
        act(() => {
            resolvePromise!({
                ok: true,
                json: async () => ({ name: "John Doe" }),
            } as Response);
        });

        await act(async () => {
            await fetchPromise!;
        });

        expect(result.current.loading).toBe(false);
    });

    it("should handle HTTP errors", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: "Not Found",
        } as Response);

        const { result } = renderHook(() => useFetch("https://api.example.com/users/999"));

        await act(async () => {
            await result.current.startFetch();
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("HTTP 404: Not Found");
        expect((result.current.error as any).status).toBe(404);
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
    });

    it("should handle network errors", async () => {
        const networkError = new Error("Network error");
        mockFetch.mockRejectedValueOnce(networkError);

        const { result } = renderHook(() => useFetch("https://api.example.com/users/1"));

        await act(async () => {
            await result.current.startFetch();
        });

        expect(result.current.error).toBe(networkError);
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
    });

    it("should call onFetch callback when fetch starts", async () => {
        const mockResponse = { name: "John Doe" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const onFetch = jest.fn();
        const { result } = renderHook(() =>
            useFetch("https://api.example.com/users/1", { onFetch })
        );

        await act(async () => {
            await result.current.startFetch();
        });

        expect(onFetch).toHaveBeenCalledTimes(1);
    });

    it("should call onSuccess callback when fetch succeeds", async () => {
        const mockResponse = { name: "John Doe", email: "john@example.com" };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const onSuccess = jest.fn();
        const { result } = renderHook(() =>
            useFetch<User>("https://api.example.com/users/1", { onSuccess })
        );

        await act(async () => {
            await result.current.startFetch();
        });

        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });

    it("should call onError callback when fetch fails", async () => {
        const networkError = new Error("Network error");
        mockFetch.mockRejectedValueOnce(networkError);

        const onError = jest.fn();
        const { result } = renderHook(() =>
            useFetch("https://api.example.com/users/1", { onError })
        );

        await act(async () => {
            await result.current.startFetch();
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(networkError);
    });

    it("should call onError callback for HTTP errors", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        } as Response);

        const onError = jest.fn();
        const { result } = renderHook(() =>
            useFetch("https://api.example.com/users/1", { onError })
        );

        await act(async () => {
            await result.current.startFetch();
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(expect.objectContaining({
            message: "HTTP 500: Internal Server Error",
            status: 500,
            statusText: "Internal Server Error"
        }));
    });

    it("should not call callbacks if component is unmounted", async () => {
        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockFetch.mockReturnValueOnce(promise);

        const onSuccess = jest.fn();
        const onError = jest.fn();
        const onFetch = jest.fn();

        const { result, unmount } = renderHook(() =>
            useFetch("https://api.example.com/users/1", { onSuccess, onError, onFetch })
        );

        // Start fetch
        let fetchPromise: Promise<void>;
        act(() => {
            fetchPromise = result.current.startFetch();
        });

        expect(onFetch).toHaveBeenCalledTimes(1);

        // Unmount component before resolving
        unmount();

        // Resolve the promise after unmount
        act(() => {
            resolvePromise!({
                ok: true,
                json: async () => ({ name: "John Doe" }),
            } as Response);
        });

        // Wait for the promise to resolve
        await act(async () => {
            try {
                await fetchPromise!;
            } catch (e) {
                // Ignore any errors from unmounted component
            }
        });

        // Callbacks should not be called after unmount
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
    });
});

interface User {
    name: string;
    email: string;
}
