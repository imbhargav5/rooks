import { vi } from "vitest";
/**
 */
import React, { Suspense } from "react";
import {
    render,
    screen,
    waitFor,
    act,
    fireEvent,
    cleanup
} from "@testing-library/react";
import { useSuspenseLocalStorageState, clearCache } from "@/hooks/useSuspenseLocalStorageState";

// Mock console methods to reduce test noise
beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
    (console.error as vi.Mock).mockRestore();
    (console.warn as vi.Mock).mockRestore();
});

// Test component that uses the hook
function TestComponent<T>({
    storageKey,
    initializer,
    testId = "test"
}: {
    storageKey: string;
    initializer: (value: string | null) => T;
    testId?: string;
}) {
    const [value, { getItem, setItem, deleteItem }] = useSuspenseLocalStorageState(
        storageKey,
        initializer
    );

    return (
        <div>
            <div data-testid={`${testId}-value`}>{JSON.stringify(value)}</div>
            <button
                data-testid={`${testId}-get`}
                onClick={() => {
                    const currentValue = getItem();
                    // Show current value in a separate element for testing
                    const display = document.querySelector(`[data-testid="${testId}-get-result"]`) as HTMLElement;
                    if (display) {
                        display.textContent = JSON.stringify(currentValue);
                    }
                }}
            >
                Get Item
            </button>
            <button
                data-testid={`${testId}-set`}
                onClick={() => setItem("new-value" as T)}
            >
                Set Item
            </button>
            <button
                data-testid={`${testId}-delete`}
                onClick={deleteItem}
            >
                Delete Item
            </button>
            <div data-testid={`${testId}-get-result`}></div>
        </div>
    );
}

// Component for testing number type
function NumberTestComponent({ storageKey }: { storageKey: string }) {
    const [count, { setItem, deleteItem }] = useSuspenseLocalStorageState(
        storageKey,
        (value) => value ? parseInt(value, 10) : 0
    );

    return (
        <div>
            <div data-testid="count">{count}</div>
            <button
                data-testid="increment"
                onClick={() => setItem(count + 1)}
            >
                Increment
            </button>
            <button
                data-testid="reset"
                onClick={deleteItem}
            >
                Reset
            </button>
        </div>
    );
}

// Component for testing object type
interface User {
    id: number;
    name: string;
}

function ObjectTestComponent({ storageKey }: { storageKey: string }) {
    const [user, { setItem, deleteItem }] = useSuspenseLocalStorageState(
        storageKey,
        (value) => {
            if (value) {
                try {
                    return JSON.parse(value) as User;
                } catch {
                    return { id: 0, name: "Unknown" };
                }
            }
            return { id: 0, name: "Unknown" };
        }
    );

    return (
        <div>
            <div data-testid="user-id">{user.id}</div>
            <div data-testid="user-name">{user.name}</div>
            <button
                data-testid="set-user"
                onClick={() => setItem({ id: 123, name: "John Doe" })}
            >
                Set User
            </button>
            <button
                data-testid="delete-user"
                onClick={deleteItem}
            >
                Delete User
            </button>
        </div>
    );
}

// Wrapper with Suspense and Error Boundary
function SuspenseWrapper({ 
    children, 
    fallback = "Loading..." 
}: { 
    children: React.ReactNode;
    fallback?: string;
}) {
    return (
        <Suspense fallback={<div data-testid="loading">{fallback}</div>}>
            {children}
        </Suspense>
    );
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return <div data-testid="error">Error: {this.state.error?.message}</div>;
        }
        return this.props.children;
    }
}

describe("useSuspenseLocalStorageState", () => {
    beforeEach(() => {
        localStorage.clear();
        clearCache(); // Clear the hook's internal cache
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
        clearCache();
    });

    it("should be defined", () => {
        expect.hasAssertions();
        expect(useSuspenseLocalStorageState).toBeDefined();
    });

    it("should suspend during initialization", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-suspend"
                    initializer={(value) => value || "default"}
                />
            </SuspenseWrapper>
        );

        // Should show loading initially
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        // Wait for the hook to resolve
        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"default"');
    });

    it("should initialize with default value when localStorage is empty", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-empty"
                    initializer={(value) => value || "default-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"default-value"');
    });

    it("should initialize with existing value from localStorage", async () => {
        expect.hasAssertions();

        // Pre-populate localStorage
        localStorage.setItem("test-existing", JSON.stringify("existing-value"));

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-existing"
                    initializer={(value) => value ? JSON.parse(value) : "default"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"existing-value"');
    });

    it("should work with number types", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <NumberTestComponent storageKey="test-number" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
        });

        // Initial value should be 0
        expect(screen.getByTestId("count").textContent).toBe("0");

        // Increment the count
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        expect(screen.getByTestId("count").textContent).toBe("1");

        // Check that localStorage was updated
        const storedValue = localStorage.getItem("test-number");
        expect(storedValue).toBe("1");
    });

    it("should work with object types", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <ObjectTestComponent storageKey="test-object" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-id")).toBeInTheDocument();
        });

        // Initial values
        expect(screen.getByTestId("user-id").textContent).toBe("0");
        expect(screen.getByTestId("user-name").textContent).toBe("Unknown");

        // Set user
        await act(async () => {
            fireEvent.click(screen.getByTestId("set-user"));
        });

        expect(screen.getByTestId("user-id").textContent).toBe("123");
        expect(screen.getByTestId("user-name").textContent).toBe("John Doe");

        // Check localStorage
        const storedValue = localStorage.getItem("test-object");
        const parsedValue = JSON.parse(storedValue!);
        expect(parsedValue).toEqual({ id: 123, name: "John Doe" });
    });

    it("should provide working getItem method", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-get-item"
                    initializer={(value) => value || "initial-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Click get item button
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-get"));
        });

        // Check that getItem result is displayed
        expect(screen.getByTestId("test-get-result").textContent).toBe('"initial-value"');
    });

    it("should update state when setItem is called", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-set-item"
                    initializer={(value) => value || "initial"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"initial"');

        // Set new value
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-set"));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');
    });

    it("should reset to initial value when deleteItem is called", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <NumberTestComponent storageKey="test-delete" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
        });

        // Increment count twice
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });
        
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        expect(screen.getByTestId("count").textContent).toBe("2");

        // Reset (delete)
        await act(async () => {
            fireEvent.click(screen.getByTestId("reset"));
        });

        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(localStorage.getItem("test-delete")).toBeNull();
    });

    it("should handle cross-tab storage events", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <NumberTestComponent storageKey="test-cross-tab" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
        });

        expect(screen.getByTestId("count").textContent).toBe("0");

        // Simulate storage event from another tab
        await act(async () => {
            const storageEvent = new StorageEvent("storage", {
                key: "test-cross-tab",
                oldValue: "0",
                newValue: "42",
                storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
        });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("42");
        });
    });

    it("should handle storage event with null value (item removed)", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <NumberTestComponent storageKey="test-removal" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
        });

        // First increment the count
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        expect(screen.getByTestId("count").textContent).toBe("1");

        // Simulate storage event with null value (item removed)
        await act(async () => {
            const storageEvent = new StorageEvent("storage", {
                key: "test-removal",
                oldValue: "1",
                newValue: null,
                storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
        });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("0");
        });
    });

    it("should broadcast custom events within the same document", async () => {
        expect.hasAssertions();

        // Render two components with the same key
        render(
            <div>
                <SuspenseWrapper>
                    <NumberTestComponent storageKey="test-broadcast" />
                </SuspenseWrapper>
                <SuspenseWrapper>
                    <div data-testid="second-component">
                        <TestComponent
                            storageKey="test-broadcast"
                            initializer={(value) => value ? parseInt(value, 10) : 0}
                            testId="second"
                        />
                    </div>
                </SuspenseWrapper>
            </div>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
            expect(screen.getByTestId("second-value")).toBeInTheDocument();
        });

        // Both should start with 0
        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(screen.getByTestId("second-value").textContent).toBe("0");

        // Increment the first component
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        // Both should be updated
        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
            expect(screen.getByTestId("second-value").textContent).toBe("1");
        });
    });

    it("should handle localStorage errors gracefully", async () => {
        expect.hasAssertions();

        // Mock localStorage to throw errors
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = vi.fn(() => {
            throw new Error("Storage quota exceeded");
        });

        render(
            <SuspenseWrapper>
                <NumberTestComponent storageKey="test-error" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
        });

        // Should still work even if localStorage throws
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        expect(screen.getByTestId("count").textContent).toBe("1");

        // Restore original method
        Storage.prototype.setItem = originalSetItem;
    });

    it("should handle initializer errors and show error boundary", async () => {
        expect.hasAssertions();

        const BadComponent = () => {
            useSuspenseLocalStorageState("test-bad", () => {
                throw new Error("Initializer failed");
            });
            return <div>Should not render</div>;
        };

        render(
            <ErrorBoundary>
                <SuspenseWrapper>
                    <BadComponent />
                </SuspenseWrapper>
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });

        expect(screen.getByTestId("error").textContent).toBe("Error: Initializer failed");
    });

    it("should handle malformed JSON in localStorage", async () => {
        expect.hasAssertions();

        // Pre-populate localStorage with malformed JSON
        localStorage.setItem("test-malformed", "{ invalid json");

        render(
            <SuspenseWrapper>
                <ObjectTestComponent storageKey="test-malformed" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-id")).toBeInTheDocument();
        });

        // Should fall back to default value
        expect(screen.getByTestId("user-id").textContent).toBe("0");
        expect(screen.getByTestId("user-name").textContent).toBe("Unknown");
    });

    it("should not conflict with different keys", async () => {
        expect.hasAssertions();

        render(
            <div>
                <SuspenseWrapper>
                    <NumberTestComponent storageKey="test-key-1" />
                </SuspenseWrapper>
                <SuspenseWrapper>
                    <div data-testid="second-component">
                        <TestComponent
                            storageKey="test-key-2"
                            initializer={(value) => value ? parseInt(value, 10) : 100}
                            testId="second"
                        />
                    </div>
                </SuspenseWrapper>
            </div>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
            expect(screen.getByTestId("second-value")).toBeInTheDocument();
        });

        // Should have different initial values
        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(screen.getByTestId("second-value").textContent).toBe("100");

        // Increment the first component
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
        });

        // Only the first should change
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("second-value").textContent).toBe("100");
    });

    it("should use cached result on subsequent renders with same key", async () => {
        expect.hasAssertions();

        const { unmount } = render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-cache"
                    initializer={(value) => value || "cached-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"cached-value"');

        // Unmount and render again
        unmount();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-cache"
                    initializer={(value) => value || "different-value"}
                />
            </SuspenseWrapper>
        );

        // Should resolve immediately from cache (no loading state)
        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Should still use the cached value, not re-run initializer
        expect(screen.getByTestId("test-value").textContent).toBe('"cached-value"');
    });

    it("should handle server-side rendering scenario", async () => {
        expect.hasAssertions();

        // Mock localStorage as undefined (SSR scenario)
        const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
        Object.defineProperty(window, 'localStorage', {
            value: undefined,
            configurable: true
        });

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-ssr"
                    initializer={(value) => value || "ssr-default"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Should work with default value even without localStorage
        expect(screen.getByTestId("test-value").textContent).toBe('"ssr-default"');

        // Restore localStorage
        if (originalLocalStorage) {
            Object.defineProperty(window, 'localStorage', originalLocalStorage);
        }
    });
});