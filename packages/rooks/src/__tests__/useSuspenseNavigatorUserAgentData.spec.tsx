import React, { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSuspenseNavigatorUserAgentData } from "@/hooks/useSuspenseNavigatorUserAgentData";
import { clearCache } from "@/hooks/useSuspenseNavigatorUserAgentData";

// Mock navigator.userAgentData
const mockGetHighEntropyValues = jest.fn();

// Mock NavigatorUAData interface
interface MockNavigatorUAData {
  getHighEntropyValues: jest.MockedFunction<any>;
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
}

const createMockUserAgentData = (): MockNavigatorUAData => ({
  getHighEntropyValues: mockGetHighEntropyValues,
  brands: [{ brand: "Chrome", version: "120" }],
  mobile: false,
  platform: "Windows",
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
      userAgentData: createMockUserAgentData(),
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
function TestComponent({ hints }: { hints?: string[] }) {
  const data = useSuspenseNavigatorUserAgentData(hints);
  return (
    <div>
      <div data-testid="data">{JSON.stringify(data)}</div>
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

describe("useSuspenseNavigatorUserAgentData", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSuspenseNavigatorUserAgentData).toBeDefined();
  });

  it("should suspend while promise is resolving", async () => {
    expect.hasAssertions();
    
    const mockData = {
      architecture: "x64",
      bitness: "64",
      model: "",
      platformVersion: "10.0",
    };

    // Create a promise that doesn't resolve immediately
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockGetHighEntropyValues.mockReturnValue(promise);

    render(
      <SuspenseWrapper>
        <TestComponent hints={["architecture", "bitness"]} />
      </SuspenseWrapper>
    );

    // Should show loading initially
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!(mockData);
    
    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(JSON.parse(screen.getByTestId("data").textContent || "{}")).toEqual(mockData);
  });

  it("should work with all supported high entropy hints", async () => {
    expect.hasAssertions();

    const allHints = [
      "architecture",
      "bitness", 
      "formFactors",
      "fullVersionList",
      "model",
      "platformVersion",
      "uaFullVersion",
      "wow64"
    ];

    const mockData = {
      architecture: "x64",
      bitness: "64",
      formFactors: ["Desktop"],
      fullVersionList: [
        { brand: "Chrome", version: "120.0.6099.109" },
        { brand: "Chromium", version: "120.0.6099.109" }
      ],
      model: "",
      platformVersion: "10.0",
      uaFullVersion: "120.0.6099.109",
      wow64: false,
    };

    mockGetHighEntropyValues.mockResolvedValue(mockData);

    render(
      <SuspenseWrapper>
        <TestComponent />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(mockGetHighEntropyValues).toHaveBeenCalledWith(allHints);
    expect(JSON.parse(screen.getByTestId("data").textContent || "{}")).toEqual(mockData);
  });

  it("should use default hints when no hints provided", async () => {
    expect.hasAssertions();

    const mockData = {
      architecture: "x64",
      bitness: "64",
      formFactors: ["Desktop"],
      fullVersionList: [{ brand: "Chrome", version: "120.0.6099.109" }],
      model: "",
      platformVersion: "10.0",
      uaFullVersion: "120.0.6099.109",
      wow64: false,
    };

    mockGetHighEntropyValues.mockResolvedValue(mockData);

    render(
      <SuspenseWrapper>
        <TestComponent />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    // Should be called with all available hints by default
    expect(mockGetHighEntropyValues).toHaveBeenCalledWith([
      "architecture",
      "bitness",
      "formFactors", 
      "fullVersionList",
      "model",
      "platformVersion",
      "uaFullVersion",
      "wow64"
    ]);
  });

  it("should handle browser without userAgentData support", async () => {
    expect.hasAssertions();

    // Mock navigator without userAgentData
    Object.defineProperty(global, "navigator", {
      value: {
        ...originalNavigator,
        userAgentData: undefined,
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
          return <div data-testid="error">Error: Navigator User Agent Data not supported</div>;
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
    mockGetHighEntropyValues.mockRejectedValue(error);

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
          <TestComponent hints={["architecture"]} />
        </SuspenseWrapper>
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });

  it("should cache results for the same hints", async () => {
    expect.hasAssertions();

    const hints = ["architecture", "bitness"];
    const mockData = { architecture: "x64", bitness: "64" };

    mockGetHighEntropyValues.mockResolvedValue(mockData);

    // Render first component
    const { unmount } = render(
      <SuspenseWrapper>
        <TestComponent hints={hints} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    unmount();

    // Render second component with same hints
    render(
      <SuspenseWrapper>
        <TestComponent hints={hints} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    // Should only be called once due to caching
    expect(mockGetHighEntropyValues).toHaveBeenCalledTimes(1);
  });

  it("should handle different hint combinations separately", async () => {
    expect.hasAssertions();

    const hints1 = ["architecture"];
    const hints2 = ["bitness"];
    const mockData1 = { architecture: "x64" };
    const mockData2 = { bitness: "64" };

    mockGetHighEntropyValues
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    // Render with first hints
    const { unmount } = render(
      <SuspenseWrapper>
        <TestComponent hints={hints1} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(JSON.parse(screen.getByTestId("data").textContent || "{}")).toEqual(mockData1);
    
    unmount();

    // Render with different hints
    render(
      <SuspenseWrapper>
        <TestComponent hints={hints2} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(JSON.parse(screen.getByTestId("data").textContent || "{}")).toEqual(mockData2);
    expect(mockGetHighEntropyValues).toHaveBeenCalledTimes(2);
  });

  it("should handle empty hints array", async () => {
    expect.hasAssertions();

    const mockData = {};
    mockGetHighEntropyValues.mockResolvedValue(mockData);

    render(
      <SuspenseWrapper>
        <TestComponent hints={[]} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data")).toBeInTheDocument();
    });

    expect(mockGetHighEntropyValues).toHaveBeenCalledWith([]);
    expect(JSON.parse(screen.getByTestId("data").textContent || "{}")).toEqual(mockData);
  });
});
