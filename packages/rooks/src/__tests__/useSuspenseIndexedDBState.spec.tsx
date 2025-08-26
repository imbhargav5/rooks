/**
 * @jest-environment jsdom
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
import { useSuspenseIndexedDBState, clearCache } from "@/hooks/useSuspenseIndexedDBState";

// Mock IndexedDB for testing
import "fake-indexeddb/auto";

// Polyfill for structuredClone
if (typeof global.structuredClone === "undefined") {
    global.structuredClone = (obj: unknown) => JSON.parse(JSON.stringify(obj));
}

// Mock BroadcastChannel for testing
if (typeof global.BroadcastChannel === "undefined") {
    global.BroadcastChannel = class MockBroadcastChannel implements BroadcastChannel {
        name: string;
        onmessage: ((event: MessageEvent) => void) | null = null;
        onmessageerror: ((event: MessageEvent) => void) | null = null;

        constructor(name: string) {
            this.name = name;
        }

        postMessage(_message: unknown) {
            // Mock implementation - no cross-tab sync in tests
        }

        addEventListener(_type: string, _listener: EventListener) {
            // Mock implementation
        }

        removeEventListener(_type: string, _listener: EventListener) {
            // Mock implementation
        }

        dispatchEvent(_event: Event): boolean {
            // Mock implementation
            return true;
        }

        close() {
            // Mock implementation
        }
    };
}

// Mock console methods to reduce test noise
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
});

// Test component that uses the hook
function TestComponent<T>({
    storageKey,
    initializer,
    testId = "test",
    config
}: {
    storageKey: string;
    initializer: (value: unknown) => T;
    testId?: string;
    config?: { dbName?: string; storeName?: string; version?: number };
}) {
    const [value, { getItem, setItem, deleteItem }] = useSuspenseIndexedDBState(
        storageKey,
        initializer,
        config
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
                onClick={async () => {
                    try {
                        await setItem("new-value" as T);
                    } catch (error) {
                        console.error("Set item error:", error);
                    }
                }}
            >
                Set Item
            </button>
            <button
                data-testid={`${testId}-delete`}
                onClick={async () => {
                    try {
                        await deleteItem();
                    } catch (error) {
                        console.error("Delete item error:", error);
                    }
                }}
            >
                Delete Item
            </button>
            <div data-testid={`${testId}-get-result`}></div>
        </div>
    );
}

// Component for testing number type
function NumberTestComponent({ storageKey }: { storageKey: string }) {
    const [count, { setItem }] = useSuspenseIndexedDBState(
        storageKey,
        (value) => (typeof value === "number" ? value : 0)
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
        </div>
    );
}

// Component for testing object type
interface User {
    id: number;
    name: string;
    email: string;
}

function ObjectTestComponent({ storageKey }: { storageKey: string }) {
    const [user, { setItem }] = useSuspenseIndexedDBState(
        storageKey,
        (value): User => {
            if (value && typeof value === "object" && "id" in value) {
                return value as User;
            }
            return { id: 0, name: "Guest", email: "" };
        }
    );

    return (
        <div>
            <div data-testid="user-name">{user.name}</div>
            <div data-testid="user-email">{user.email}</div>
            <button
                data-testid="update-user"
                onClick={() => setItem({ id: 123, name: "John Doe", email: "john@example.com" })}
            >
                Update User
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
        <ErrorBoundary>
            <Suspense fallback={<div data-testid="loading">{fallback}</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
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

describe("useSuspenseIndexedDBState", () => {
    beforeEach(async () => {
        // Clear IndexedDB between tests
        if (typeof indexedDB !== "undefined") {
            const dbs = await indexedDB.databases();
            await Promise.all(
                dbs.map(db => {
                    if (db.name) {
                        return new Promise<void>((resolve) => {
                            const deleteReq = indexedDB.deleteDatabase(db.name!);
                            deleteReq.onsuccess = () => resolve();
                            deleteReq.onerror = () => resolve(); // Continue even if deletion fails
                        });
                    }
                    return Promise.resolve();
                })
            );
        }
        clearCache(); // Clear the hook's internal cache
    });

    afterEach(() => {
        cleanup();
        clearCache();
    });

    it("should be defined", () => {
        expect.hasAssertions();
        expect(useSuspenseIndexedDBState).toBeDefined();
    });

    it("should suspend during initialization", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-suspend"
                    initializer={(value) => value || "initial-value"}
                />
            </SuspenseWrapper>
        );

        // Initially should show loading state
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"initial-value"');
    });

    it("should initialize with default value when IndexedDB is empty", async () => {
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

    it("should initialize with existing value from IndexedDB", async () => {
        expect.hasAssertions();

        // Test by setting a value first, then remounting
        const { unmount } = render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-existing"
                    initializer={(value) => value || "default-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Set a value
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-set"));
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');

        // Unmount and remount to test persistence
        unmount();
        clearCache(); // Clear cache to force re-initialization

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-existing"
                    initializer={(value) => value || "default-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Should initialize with the persisted value
        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');
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

        expect(screen.getByTestId("count").textContent).toBe("0");

        // Increment the counter
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
            // Wait for async operation to complete
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("should work with object types", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <ObjectTestComponent storageKey="test-object" />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-name")).toBeInTheDocument();
        });

        expect(screen.getByTestId("user-name").textContent).toBe("Guest");
        expect(screen.getByTestId("user-email").textContent).toBe("");

        // Update the user
        await act(async () => {
            fireEvent.click(screen.getByTestId("update-user"));
            // Wait for async operation to complete
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("user-name").textContent).toBe("John Doe");
        expect(screen.getByTestId("user-email").textContent).toBe("john@example.com");
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
            // Wait for async operation to complete
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');
    });

    it("should reset to initial value when deleteItem is called", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-delete-item"
                    initializer={(value) => value || "default"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Set a value first
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-set"));
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');

        // Delete the value
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-delete"));
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"default"');
    });

    it("should handle initializer errors and show error boundary", async () => {
        expect.hasAssertions();

        const errorInitializer = () => {
            throw new Error("Initializer error");
        };

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="test-error"
                    initializer={errorInitializer}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });

        expect(screen.getByTestId("error").textContent).toContain("Initializer error");
    });

    it("should not conflict with different keys", async () => {
        expect.hasAssertions();

        render(
            <SuspenseWrapper>
                <div>
                    <NumberTestComponent storageKey="counter-1" />
                    <div data-testid="separator">---</div>
                    <TestComponent
                        storageKey="counter-2"
                        testId="second"
                        initializer={() => 100}
                    />
                </div>
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("count")).toBeInTheDocument();
            expect(screen.getByTestId("second-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(screen.getByTestId("second-value").textContent).toBe("100");

        // Increment the first component
        await act(async () => {
            fireEvent.click(screen.getByTestId("increment"));
            await new Promise(resolve => setTimeout(resolve, 100));
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
                    initializer={(value) => value || "cached-value"}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        // Should use cached result without suspending
        expect(screen.getByTestId("test-value").textContent).toBe('"cached-value"');
    });

    it("should work with custom database configuration", async () => {
        expect.hasAssertions();

        const customConfig = {
            dbName: "custom-db",
            storeName: "custom-store",
            version: 2
        };

        render(
            <SuspenseWrapper>
                <TestComponent
                    storageKey="custom-test"
                    initializer={(value) => value || "custom-value"}
                    config={customConfig}
                />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("test-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"custom-value"');

        // Test that it actually uses the custom database
        await act(async () => {
            fireEvent.click(screen.getByTestId("test-set"));
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("test-value").textContent).toBe('"new-value"');
    });

    it("should handle complex objects with nested data", async () => {
        expect.hasAssertions();

        interface ComplexData {
            user: { id: number; name: string };
            settings: { theme: string; notifications: boolean };
            items: string[];
        }

        const initialComplexData: ComplexData = {
            user: { id: 1, name: "Test User" },
            settings: { theme: "dark", notifications: true },
            items: ["item1", "item2"]
        };

        function ComplexTestComponent() {
            const [data, { setItem }] = useSuspenseIndexedDBState(
                "complex-data",
                (value): ComplexData => {
                    if (value && typeof value === 'object' && 'user' in value) {
                        return value as ComplexData;
                    }
                    return initialComplexData;
                }
            );

            return (
                <div>
                    <div data-testid="user-id">{data.user.id}</div>
                    <div data-testid="user-name">{data.user.name}</div>
                    <div data-testid="theme">{data.settings.theme}</div>
                    <div data-testid="items-count">{data.items.length}</div>
                    <button
                        data-testid="update-complex"
                        onClick={() => setItem({
                            ...data,
                            user: { ...data.user, name: "Updated User" },
                            items: [...data.items, "item3"]
                        })}
                    >
                        Update Complex Data
                    </button>
                </div>
            );
        }

        render(
            <SuspenseWrapper>
                <ComplexTestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user-id")).toBeInTheDocument();
        });

        expect(screen.getByTestId("user-id").textContent).toBe("1");
        expect(screen.getByTestId("user-name").textContent).toBe("Test User");
        expect(screen.getByTestId("theme").textContent).toBe("dark");
        expect(screen.getByTestId("items-count").textContent).toBe("2");

        // Update complex data
        await act(async () => {
            fireEvent.click(screen.getByTestId("update-complex"));
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(screen.getByTestId("user-name").textContent).toBe("Updated User");
        expect(screen.getByTestId("items-count").textContent).toBe("3");
    });

    it("should handle broadcast channel messages correctly", async () => {
        expect.hasAssertions();

        // Create a working BroadcastChannel implementation for testing
        const channels: Map<string, MockBroadcastChannel[]> = new Map();

        class MockBroadcastChannel implements BroadcastChannel {
            name: string;
            onmessage: ((event: MessageEvent) => void) | null = null;
            onmessageerror: ((event: MessageEvent) => void) | null = null;
            private listeners: EventListener[] = [];

            constructor(name: string) {
                this.name = name;
                if (!channels.has(name)) {
                    channels.set(name, []);
                }
                channels.get(name)!.push(this);
            }

            postMessage(message: unknown) {
                const channelInstances = channels.get(this.name) || [];
                // Simulate async message delivery
                setTimeout(() => {
                    channelInstances.forEach(instance => {
                        if (instance !== this) { // Don't send to self
                            const event = new MessageEvent('message', { data: message });
                            instance.listeners.forEach(listener => {
                                listener(event);
                            });
                            if (instance.onmessage) {
                                instance.onmessage(event);
                            }
                        }
                    });
                }, 0);
            }

            addEventListener(type: string, listener: EventListener) {
                if (type === 'message') {
                    this.listeners.push(listener);
                }
            }

            removeEventListener(type: string, listener: EventListener) {
                if (type === 'message') {
                    const index = this.listeners.indexOf(listener);
                    if (index > -1) {
                        this.listeners.splice(index, 1);
                    }
                }
            }

            dispatchEvent(_event: Event): boolean {
                return true;
            }

            close() {
                const channelInstances = channels.get(this.name);
                if (channelInstances) {
                    const index = channelInstances.indexOf(this);
                    if (index > -1) {
                        channelInstances.splice(index, 1);
                    }
                }
            }
        }

        // Temporarily replace the global BroadcastChannel
        const originalBroadcastChannel = global.BroadcastChannel;
        global.BroadcastChannel = MockBroadcastChannel as any;

        let testChannel: MockBroadcastChannel | null = null;
        testChannel = new MockBroadcastChannel("rooks-indexeddb-rooks-db-state");

        const TestBroadcastComponent = () => {
            const [value, { setItem }] = useSuspenseIndexedDBState(
                "broadcast-test",
                (current) => current || "initial"
            );

            return (
                <div>
                    <div data-testid="broadcast-value">{JSON.stringify(value)}</div>
                    <button
                        data-testid="set-broadcast-value"
                        onClick={() => setItem("local-update")}
                    >
                        Set Value
                    </button>
                </div>
            );
        };

        render(
            <SuspenseWrapper>
                <TestBroadcastComponent />
            </SuspenseWrapper>
        );

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByTestId("broadcast-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("broadcast-value").textContent).toBe('"initial"');

        // Simulate broadcast message from another tab
        if (testChannel) {
            await act(async () => {
                testChannel.postMessage({
                    type: 'SET',
                    key: 'broadcast-test',
                    value: 'broadcast-update',
                    dbName: 'rooks-db',
                    storeName: 'state'
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            // Value should be updated from broadcast message
            expect(screen.getByTestId("broadcast-value").textContent).toBe('"broadcast-update"');

            // Test DELETE broadcast message
            await act(async () => {
                testChannel.postMessage({
                    type: 'DELETE',
                    key: 'broadcast-test',
                    dbName: 'rooks-db',
                    storeName: 'state'
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            // Value should be reset to initial value
            expect(screen.getByTestId("broadcast-value").textContent).toBe('"initial"');

            testChannel.close();
        }

        // Restore original BroadcastChannel
        global.BroadcastChannel = originalBroadcastChannel;
    });

    it("should not respond to broadcast messages for different keys/databases", async () => {
        expect.hasAssertions();

        // Create a working BroadcastChannel implementation for testing
        const channels: Map<string, MockBroadcastChannel[]> = new Map();

        class MockBroadcastChannel implements BroadcastChannel {
            name: string;
            onmessage: ((event: MessageEvent) => void) | null = null;
            onmessageerror: ((event: MessageEvent) => void) | null = null;
            private listeners: EventListener[] = [];

            constructor(name: string) {
                this.name = name;
                if (!channels.has(name)) {
                    channels.set(name, []);
                }
                channels.get(name)!.push(this);
            }

            postMessage(message: unknown) {
                const channelInstances = channels.get(this.name) || [];
                setTimeout(() => {
                    channelInstances.forEach(instance => {
                        if (instance !== this) {
                            const event = new MessageEvent('message', { data: message });
                            instance.listeners.forEach(listener => {
                                listener(event);
                            });
                            if (instance.onmessage) {
                                instance.onmessage(event);
                            }
                        }
                    });
                }, 0);
            }

            addEventListener(type: string, listener: EventListener) {
                if (type === 'message') {
                    this.listeners.push(listener);
                }
            }

            removeEventListener(type: string, listener: EventListener) {
                if (type === 'message') {
                    const index = this.listeners.indexOf(listener);
                    if (index > -1) {
                        this.listeners.splice(index, 1);
                    }
                }
            }

            dispatchEvent(_event: Event): boolean {
                return true;
            }

            close() {
                const channelInstances = channels.get(this.name);
                if (channelInstances) {
                    const index = channelInstances.indexOf(this);
                    if (index > -1) {
                        channelInstances.splice(index, 1);
                    }
                }
            }
        }

        // Temporarily replace the global BroadcastChannel
        const originalBroadcastChannel = global.BroadcastChannel;
        global.BroadcastChannel = MockBroadcastChannel as any;

        let testChannel: MockBroadcastChannel | null = null;
        testChannel = new MockBroadcastChannel("rooks-indexeddb-rooks-db-state");

        const TestBroadcastComponent = () => {
            const [value] = useSuspenseIndexedDBState(
                "specific-key",
                (current) => current || "original"
            );

            return <div data-testid="specific-value">{JSON.stringify(value)}</div>;
        };

        render(
            <SuspenseWrapper>
                <TestBroadcastComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("specific-value")).toBeInTheDocument();
        });

        expect(screen.getByTestId("specific-value").textContent).toBe('"original"');

        if (testChannel) {
            // Send message for different key - should not affect our component
            await act(async () => {
                testChannel.postMessage({
                    type: 'SET',
                    key: 'different-key',
                    value: 'should-not-update',
                    dbName: 'rooks-db',
                    storeName: 'state'
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            // Value should remain unchanged
            expect(screen.getByTestId("specific-value").textContent).toBe('"original"');

            // Send message for different database - should not affect our component
            await act(async () => {
                testChannel.postMessage({
                    type: 'SET',
                    key: 'specific-key',
                    value: 'should-not-update',
                    dbName: 'different-db',
                    storeName: 'state'
                });
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            // Value should remain unchanged
            expect(screen.getByTestId("specific-value").textContent).toBe('"original"');

            testChannel.close();
        }

        // Restore original BroadcastChannel
        global.BroadcastChannel = originalBroadcastChannel;
    });
});