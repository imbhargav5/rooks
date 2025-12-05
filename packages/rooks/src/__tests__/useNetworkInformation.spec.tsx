import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { useNetworkInformation } from "@/hooks/useNetworkInformation";

describe("useNetworkInformation", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      type: "wifi",
      effectiveType: "4g",
      downlink: 10,
      downlinkMax: 20,
      rtt: 50,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      writable: true,
      configurable: true,
      value: mockConnection,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useNetworkInformation).toBeDefined();
  });

  it("should return initial state when supported", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.type).toBe("wifi");
    expect(result.current.effectiveType).toBe("4g");
    expect(result.current.downlink).toBe(10);
    expect(result.current.downlinkMax).toBe(20);
    expect(result.current.rtt).toBe(50);
    expect(result.current.saveData).toBe(false);
  });

  it("should detect when Network Information API is not supported", () => {
    expect.hasAssertions();
    const originalConnection = (navigator as any).connection;
    delete (navigator as any).connection;

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.type).toBe(null);
    expect(result.current.effectiveType).toBe(null);
    expect(result.current.downlink).toBe(null);
    expect(result.current.rtt).toBe(null);

    // Restore
    (navigator as any).connection = originalConnection;
  });

  it("should update when connection changes", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNetworkInformation());

    // Simulate connection change
    act(() => {
      mockConnection.effectiveType = "3g";
      mockConnection.downlink = 5;
      mockConnection.rtt = 100;
      const changeListener = mockConnection.addEventListener.mock.calls.find(
        ([event]: any) => event === "change"
      )?.[1];
      if (changeListener) {
        changeListener();
      }
    });

    expect(result.current.effectiveType).toBe("3g");
    expect(result.current.downlink).toBe(5);
    expect(result.current.rtt).toBe(100);
  });

  it("should handle save data mode", () => {
    expect.hasAssertions();
    mockConnection.saveData = true;

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.saveData).toBe(true);
  });

  it("should remove event listener on unmount", () => {
    expect.hasAssertions();
    const { unmount } = renderHook(() => useNetworkInformation());

    unmount();

    expect(mockConnection.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should handle connection with missing properties", () => {
    expect.hasAssertions();
    const minimalConnection = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      value: minimalConnection,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.type).toBe(null);
    expect(result.current.effectiveType).toBe(null);
    expect(result.current.downlink).toBe(null);
    expect(result.current.rtt).toBe(null);
    expect(result.current.saveData).toBe(false);
  });

  it("should use mozConnection if available", () => {
    expect.hasAssertions();
    delete (navigator as any).connection;

    Object.defineProperty(navigator, "mozConnection", {
      value: mockConnection,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.effectiveType).toBe("4g");

    delete (navigator as any).mozConnection;
  });

  it("should use webkitConnection if available", () => {
    expect.hasAssertions();
    delete (navigator as any).connection;

    Object.defineProperty(navigator, "webkitConnection", {
      value: mockConnection,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.effectiveType).toBe("4g");

    delete (navigator as any).webkitConnection;
  });

  it("should handle different connection types", () => {
    expect.hasAssertions();
    mockConnection.type = "cellular";
    mockConnection.effectiveType = "2g";

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.type).toBe("cellular");
    expect(result.current.effectiveType).toBe("2g");
  });

  it("should handle slow-2g connection", () => {
    expect.hasAssertions();
    mockConnection.effectiveType = "slow-2g";
    mockConnection.downlink = 0.5;
    mockConnection.rtt = 2000;

    const { result } = renderHook(() => useNetworkInformation());

    expect(result.current.effectiveType).toBe("slow-2g");
    expect(result.current.downlink).toBe(0.5);
    expect(result.current.rtt).toBe(2000);
  });

  it("should register change event listener", () => {
    expect.hasAssertions();
    renderHook(() => useNetworkInformation());

    expect(mockConnection.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
