import React, { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSuspenseNavigatorBattery } from "@/hooks/useSuspenseNavigatorBattery";
import { clearCache } from "@/hooks/useSuspenseNavigatorBattery";

// Mock BatteryManager interface
interface MockBatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: jest.MockedFunction<any>;
  removeEventListener: jest.MockedFunction<any>;
}

// Mock navigator.getBattery
const mockGetBattery = jest.fn();

const createMockBatteryManager = (overrides: Partial<MockBatteryManager> = {}): MockBatteryManager => ({
  charging: false,
  chargingTime: Infinity,
  dischargingTime: 3600, // 1 hour
  level: 0.5, // 50%
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  ...overrides,
});

// Mock navigator globally
const originalNavigator = global.navigator;

beforeEach(() => {
  jest.clearAllMocks();
  clearCache(); // Clear the hook's internal cache
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
      <div data-testid="charging">{battery.charging.toString()}</div>
      <div data-testid="chargingTime">{battery.chargingTime}</div>
      <div data-testid="dischargingTime">{battery.dischargingTime}</div>
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
    
    const mockBattery = createMockBatteryManager({
      charging: true,
      chargingTime: 1800, // 30 minutes
      dischargingTime: Infinity,
      level: 0.8, // 80%
    });

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
    resolvePromise!(mockBattery);
    
    await waitFor(() => {
      expect(screen.getByTestId("charging")).toBeInTheDocument();
    });

    expect(screen.getByTestId("charging").textContent).toBe("true");
    expect(screen.getByTestId("chargingTime").textContent).toBe("1800");
    expect(screen.getByTestId("dischargingTime").textContent).toBe("Infinity");
    expect(screen.getByTestId("level").textContent).toBe("0.8");
  });

  it("should return battery information when promise resolves", async () => {
    expect.hasAssertions();

    const mockBattery = createMockBatteryManager({
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 7200, // 2 hours
      level: 0.3, // 30%
    });

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
    expect(screen.getByTestId("chargingTime").textContent).toBe("Infinity");
    expect(screen.getByTestId("dischargingTime").textContent).toBe("7200");
    expect(screen.getByTestId("level").textContent).toBe("0.3");
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
          return <div data-testid="error">Battery API not supported</div>;
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

  it("should handle SecurityError in insecure contexts", async () => {
    expect.hasAssertions();

    const error = new DOMException("Battery API not available in insecure context", "SecurityError");
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
          return <div data-testid="error">Security error</div>;
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

  it("should cache results and not call getBattery multiple times", async () => {
    expect.hasAssertions();

    const mockBattery = createMockBatteryManager({
      charging: true,
      level: 0.9,
    });

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

  it("should handle battery with all properties as expected values", async () => {
    expect.hasAssertions();

    const mockBattery = createMockBatteryManager({
      charging: true,
      chargingTime: 0, // Fully charged
      dischargingTime: Infinity,
      level: 1.0, // 100%
    });

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
    expect(screen.getByTestId("chargingTime").textContent).toBe("0");
    expect(screen.getByTestId("dischargingTime").textContent).toBe("Infinity");
    expect(screen.getByTestId("level").textContent).toBe("1");
  });

  it("should handle battery with minimum level", async () => {
    expect.hasAssertions();

    const mockBattery = createMockBatteryManager({
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 60, // 1 minute remaining
      level: 0.0, // 0%
    });

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
    expect(screen.getByTestId("chargingTime").textContent).toBe("Infinity");
    expect(screen.getByTestId("dischargingTime").textContent).toBe("60");
    expect(screen.getByTestId("level").textContent).toBe("0");
  });

  it("should handle typical charging scenario", async () => {
    expect.hasAssertions();

    const mockBattery = createMockBatteryManager({
      charging: true,
      chargingTime: 3600, // 1 hour to full charge
      dischargingTime: Infinity,
      level: 0.75, // 75%
    });

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
    expect(screen.getByTestId("chargingTime").textContent).toBe("3600");
    expect(screen.getByTestId("dischargingTime").textContent).toBe("Infinity");
    expect(screen.getByTestId("level").textContent).toBe("0.75");
  });

  it("should handle error when getBattery throws synchronously", async () => {
    expect.hasAssertions();

    mockGetBattery.mockImplementation(() => {
      throw new Error("Navigator not available");
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
          return <div data-testid="error">Synchronous error</div>;
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