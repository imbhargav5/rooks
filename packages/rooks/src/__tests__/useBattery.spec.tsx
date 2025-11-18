/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useBattery } from "@/hooks/useBattery";

describe("useBattery", () => {
  let mockGetBattery: jest.Mock;
  let mockBatteryManager: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockBatteryManager = {
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 3600,
      level: 0.75,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    mockGetBattery = jest.fn(() => Promise.resolve(mockBatteryManager));

    Object.defineProperty(navigator, "getBattery", {
      writable: true,
      configurable: true,
      value: mockGetBattery,
    });

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useBattery).toBeDefined();
  });

  it("should return initial loading state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useBattery());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.loading).toBe(true);
  });

  it("should detect when Battery API is not supported", () => {
    expect.hasAssertions();
    const originalGetBattery = navigator.getBattery;
    // @ts-ignore
    delete navigator.getBattery;

    const { result } = renderHook(() => useBattery());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.loading).toBe(false);

    // Restore
    Object.defineProperty(navigator, "getBattery", {
      value: originalGetBattery,
      writable: true,
      configurable: true,
    });
  });

  it("should load battery status", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    expect(mockGetBattery).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.charging).toBe(false);
    expect(result.current.chargingTime).toBe(Infinity);
    expect(result.current.dischargingTime).toBe(3600);
    expect(result.current.level).toBe(0.75);
  });

  it("should update when charging state changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    expect(result.current.charging).toBe(false);

    // Simulate charging change
    act(() => {
      mockBatteryManager.charging = true;
      mockBatteryManager.chargingTime = 1800;
      const chargingChangeListener = mockBatteryManager.addEventListener.mock.calls.find(
        ([event]: any) => event === "chargingchange"
      )?.[1];
      if (chargingChangeListener) {
        chargingChangeListener();
      }
    });

    expect(result.current.charging).toBe(true);
    expect(result.current.chargingTime).toBe(1800);
  });

  it("should update when level changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    expect(result.current.level).toBe(0.75);

    // Simulate level change
    act(() => {
      mockBatteryManager.level = 0.5;
      const levelChangeListener = mockBatteryManager.addEventListener.mock.calls.find(
        ([event]: any) => event === "levelchange"
      )?.[1];
      if (levelChangeListener) {
        levelChangeListener();
      }
    });

    expect(result.current.level).toBe(0.5);
  });

  it("should update when charging time changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    // Simulate charging time change
    act(() => {
      mockBatteryManager.chargingTime = 900;
      const chargingTimeChangeListener = mockBatteryManager.addEventListener.mock.calls.find(
        ([event]: any) => event === "chargingtimechange"
      )?.[1];
      if (chargingTimeChangeListener) {
        chargingTimeChangeListener();
      }
    });

    expect(result.current.chargingTime).toBe(900);
  });

  it("should update when discharging time changes", async () => {
    expect.hasAssertions();
    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    // Simulate discharging time change
    act(() => {
      mockBatteryManager.dischargingTime = 1800;
      const dischargingTimeChangeListener = mockBatteryManager.addEventListener.mock.calls.find(
        ([event]: any) => event === "dischargingtimechange"
      )?.[1];
      if (dischargingTimeChangeListener) {
        dischargingTimeChangeListener();
      }
    });

    expect(result.current.dischargingTime).toBe(1800);
  });

  it("should remove event listeners on unmount", async () => {
    expect.hasAssertions();
    const { unmount, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    unmount();

    expect(mockBatteryManager.removeEventListener).toHaveBeenCalledWith(
      "chargingchange",
      expect.any(Function)
    );
    expect(mockBatteryManager.removeEventListener).toHaveBeenCalledWith(
      "chargingtimechange",
      expect.any(Function)
    );
    expect(mockBatteryManager.removeEventListener).toHaveBeenCalledWith(
      "dischargingtimechange",
      expect.any(Function)
    );
    expect(mockBatteryManager.removeEventListener).toHaveBeenCalledWith(
      "levelchange",
      expect.any(Function)
    );
  });

  it("should handle getBattery errors", async () => {
    expect.hasAssertions();
    mockGetBattery.mockRejectedValue(new Error("Battery error"));

    const { result, waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get battery information:",
      expect.any(Error)
    );
    expect(result.current.loading).toBe(false);
  });

  it("should handle all event listeners being registered", async () => {
    expect.hasAssertions();
    const { waitForNextUpdate } = renderHook(() => useBattery());

    await waitForNextUpdate();

    expect(mockBatteryManager.addEventListener).toHaveBeenCalledWith(
      "chargingchange",
      expect.any(Function)
    );
    expect(mockBatteryManager.addEventListener).toHaveBeenCalledWith(
      "chargingtimechange",
      expect.any(Function)
    );
    expect(mockBatteryManager.addEventListener).toHaveBeenCalledWith(
      "dischargingtimechange",
      expect.any(Function)
    );
    expect(mockBatteryManager.addEventListener).toHaveBeenCalledWith(
      "levelchange",
      expect.any(Function)
    );
  });
});
