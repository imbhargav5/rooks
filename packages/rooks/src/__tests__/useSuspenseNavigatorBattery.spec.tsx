import { vi } from "vitest";
import React, { Suspense } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { useSuspenseNavigatorBattery } from "@/hooks/useSuspenseNavigatorBattery";
import { clearCache } from "@/hooks/useSuspenseNavigatorBattery";

// BatteryManager interface from Web API specification
interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

// Mock navigator.getBattery
const mockGetBattery = vi.fn();

// Store event listeners for testing
const eventListeners: { [key: string]: EventListener[] } = {};

const createMockBatteryManager = (): BatteryManager => {
    const mockBattery = {
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 0.75,
        addEventListener: vi.fn((event: string, listener: EventListener) => {
            if (!eventListeners[event]) {
                eventListeners[event] = [];
            }
            eventListeners[event].push(listener);
        }),
        removeEventListener: vi.fn((event: string, listener: EventListener) => {
            if (eventListeners[event]) {
                const index = eventListeners[event].indexOf(listener);
                if (index > -1) {
                    eventListeners[event].splice(index, 1);
                }
            }
        }),
        dispatchEvent: vi.fn(),
    } as BatteryManager;

    return mockBattery;
};

// Helper function to trigger battery events
const triggerBatteryEvent = (eventType: string) => {
    if (eventListeners[eventType]) {
        eventListeners[eventType].forEach(listener => {
            listener(new Event(eventType));
        });
    }
};

// Mock navigator globally
const originalNavigator = global.navigator;

beforeEach(() => {
    vi.clearAllMocks();
    clearCache(); // Clear the hook's internal cache
    // Clear event listeners
    Object.keys(eventListeners).forEach(key => {
        eventListeners[key] = [];
    });

    // Reset navigator mock
    Object.defineProperty(global, "navigator", {
        value: {
            ...originalNavigator,
            getBattery: mockGetBattery,
        },
        configurable: true,
    });
});

afterEach(() => {
    Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        configurable: true,
    });
});

// Test component that uses the hook
function TestComponent() {
    const battery = useSuspenseNavigatorBattery();
    return (
        <div>
            <div data-testid="charging">{battery.charging ? "true" : "false"}</div>
            <div data-testid="charging-time">{battery.chargingTime}</div>
            <div data-testid="discharging-time">{battery.dischargingTime}</div>
            <div data-testid="level">{battery.level}</div>
        </div>
    );
}

// Wrapper with Suspense
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
            {children}
        </Suspense>
    );
}

describe("useSuspenseNavigatorBattery", () => {
    it("should be defined", () => {
        expect.hasAssertions();
        expect(useSuspenseNavigatorBattery).toBeDefined();
    });

    it("should suspend while promise is resolving", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();

        // Create a promise that doesn't resolve immediately
        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockGetBattery.mockReturnValue(promise);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        // Should show loading initially
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        // Resolve the promise
        await act(async () => {
            resolvePromise!(mockBattery);
        });

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        expect(screen.getByTestId("charging").textContent).toBe("true");
        expect(screen.getByTestId("charging-time").textContent).toBe("0");
        expect(screen.getByTestId("discharging-time").textContent).toBe("Infinity");
        expect(screen.getByTestId("level").textContent).toBe("0.75");
    });

    it("should return battery information when resolved", async () => {
        expect.hasAssertions();

        const mockBattery = {
            ...createMockBatteryManager(),
            charging: false,
            chargingTime: Infinity,
            dischargingTime: 7200,
            level: 0.5,
        };

        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        expect(screen.getByTestId("charging").textContent).toBe("false");
        expect(screen.getByTestId("charging-time").textContent).toBe("Infinity");
        expect(screen.getByTestId("discharging-time").textContent).toBe("7200");
        expect(screen.getByTestId("level").textContent).toBe("0.5");
    });

    it("should add event listeners for battery status changes", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        // Verify event listeners were added
        expect(mockBattery.addEventListener).toHaveBeenCalledWith('chargingchange', expect.any(Function));
        expect(mockBattery.addEventListener).toHaveBeenCalledWith('chargingtimechange', expect.any(Function));
        expect(mockBattery.addEventListener).toHaveBeenCalledWith('dischargingtimechange', expect.any(Function));
        expect(mockBattery.addEventListener).toHaveBeenCalledWith('levelchange', expect.any(Function));
        expect(mockBattery.addEventListener).toHaveBeenCalledTimes(4);
    });

    it("should update when charging status changes", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        // Initial state
        expect(screen.getByTestId("charging").textContent).toBe("true");

        // Change the battery's charging status
        await act(async () => {
            mockBattery.charging = false;
            triggerBatteryEvent('chargingchange');
        });

        // Should update the display
        await waitFor(() => {
            expect(screen.getByTestId("charging").textContent).toBe("false");
        });
    });

    it("should update when battery level changes", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("level")).toBeInTheDocument();
        });

        // Initial state
        expect(screen.getByTestId("level").textContent).toBe("0.75");

        // Change the battery level
        await act(async () => {
            mockBattery.level = 0.25;
            triggerBatteryEvent('levelchange');
        });

        // Should update the display
        await waitFor(() => {
            expect(screen.getByTestId("level").textContent).toBe("0.25");
        });
    });

    it("should update when charging time changes", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging-time")).toBeInTheDocument();
        });

        // Initial state
        expect(screen.getByTestId("charging-time").textContent).toBe("0");

        // Change the charging time
        await act(async () => {
            mockBattery.chargingTime = 3600;
            triggerBatteryEvent('chargingtimechange');
        });

        // Should update the display
        await waitFor(() => {
            expect(screen.getByTestId("charging-time").textContent).toBe("3600");
        });
    });

    it("should update when discharging time changes", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("discharging-time")).toBeInTheDocument();
        });

        // Initial state
        expect(screen.getByTestId("discharging-time").textContent).toBe("Infinity");

        // Change the discharging time
        await act(async () => {
            mockBattery.dischargingTime = 1800;
            triggerBatteryEvent('dischargingtimechange');
        });

        // Should update the display
        await waitFor(() => {
            expect(screen.getByTestId("discharging-time").textContent).toBe("1800");
        });
    });

    it("should remove event listeners on unmount", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        const { unmount } = render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        // Verify event listeners were added
        expect(mockBattery.addEventListener).toHaveBeenCalledTimes(4);

        // Unmount the component
        unmount();

        // Verify event listeners were removed
        expect(mockBattery.removeEventListener).toHaveBeenCalledWith('chargingchange', expect.any(Function));
        expect(mockBattery.removeEventListener).toHaveBeenCalledWith('chargingtimechange', expect.any(Function));
        expect(mockBattery.removeEventListener).toHaveBeenCalledWith('dischargingtimechange', expect.any(Function));
        expect(mockBattery.removeEventListener).toHaveBeenCalledWith('levelchange', expect.any(Function));
        expect(mockBattery.removeEventListener).toHaveBeenCalledTimes(4);
    });

    it("should handle browser without getBattery support", async () => {
        expect.hasAssertions();

        // Mock navigator without getBattery
        Object.defineProperty(global, "navigator", {
            value: {
                ...originalNavigator,
                getBattery: undefined,
            },
            configurable: true,
        });

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
                    return <div data-testid="error">Error: Navigator Battery API not supported</div>;
                }
                return this.props.children;
            }
        }

        render(
            <ErrorBoundary>
                <SuspenseWrapper>
                    <TestComponent />
                </SuspenseWrapper>
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });
    });

    it("should handle API rejection (NotAllowedError)", async () => {
        expect.hasAssertions();

        const error = new DOMException("Permission denied", "NotAllowedError");
        mockGetBattery.mockRejectedValue(error);

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
                    return <div data-testid="error">Error occurred</div>;
                }
                return this.props.children;
            }
        }

        render(
            <ErrorBoundary>
                <SuspenseWrapper>
                    <TestComponent />
                </SuspenseWrapper>
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });
    });

    it("should handle SecurityError for insecure contexts", async () => {
        expect.hasAssertions();

        const error = new DOMException("SecurityError", "SecurityError");
        mockGetBattery.mockRejectedValue(error);

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
                    return <div data-testid="error">Security Error</div>;
                }
                return this.props.children;
            }
        }

        render(
            <ErrorBoundary>
                <SuspenseWrapper>
                    <TestComponent />
                </SuspenseWrapper>
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });
    });

    it("should cache the battery manager result", async () => {
        expect.hasAssertions();

        const mockBattery = createMockBatteryManager();
        mockGetBattery.mockResolvedValue(mockBattery);

        // Render first component
        const { unmount } = render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        unmount();

        // Render second component
        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        // Should only be called once due to caching
        expect(mockGetBattery).toHaveBeenCalledTimes(1);
    });

    it("should handle battery manager with default values", async () => {
        expect.hasAssertions();

        const mockBattery = {
            ...createMockBatteryManager(),
            charging: true,
            chargingTime: 0,
            dischargingTime: Infinity,
            level: 1.0,
        };

        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        expect(screen.getByTestId("charging").textContent).toBe("true");
        expect(screen.getByTestId("charging-time").textContent).toBe("0");
        expect(screen.getByTestId("discharging-time").textContent).toBe("Infinity");
        expect(screen.getByTestId("level").textContent).toBe("1");
    });

    it("should handle low battery scenario", async () => {
        expect.hasAssertions();

        const mockBattery = {
            ...createMockBatteryManager(),
            charging: false,
            chargingTime: Infinity,
            dischargingTime: 600, // 10 minutes
            level: 0.15, // 15%
        };

        mockGetBattery.mockResolvedValue(mockBattery);

        render(
            <SuspenseWrapper>
                <TestComponent />
            </SuspenseWrapper>
        );

        await waitFor(() => {
            expect(screen.getByTestId("charging")).toBeInTheDocument();
        });

        expect(screen.getByTestId("charging").textContent).toBe("false");
        expect(screen.getByTestId("charging-time").textContent).toBe("Infinity");
        expect(screen.getByTestId("discharging-time").textContent).toBe("600");
        expect(screen.getByTestId("level").textContent).toBe("0.15");
    });

    it("should handle undefined navigator", async () => {
        expect.hasAssertions();

        // Mock undefined navigator
        Object.defineProperty(global, "navigator", {
            value: undefined,
            configurable: true,
        });

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
                    return <div data-testid="error">Navigator undefined</div>;
                }
                return this.props.children;
            }
        }

        render(
            <ErrorBoundary>
                <SuspenseWrapper>
                    <TestComponent />
                </SuspenseWrapper>
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByTestId("error")).toBeInTheDocument();
        });
    });
}); 