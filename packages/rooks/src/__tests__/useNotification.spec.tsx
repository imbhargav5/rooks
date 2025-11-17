/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useNotification } from "@/hooks/useNotification";

describe("useNotification", () => {
  let mockNotification: jest.Mock;
  let mockRequestPermission: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockNotification = jest.fn();
    mockRequestPermission = jest.fn();

    // Mock Notification API
    Object.defineProperty(window, "Notification", {
      writable: true,
      configurable: true,
      value: mockNotification,
    });

    mockNotification.requestPermission = mockRequestPermission;
    mockNotification.permission = "default";

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useNotification).toBeDefined();
  });

  it("should return initial state when supported", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useNotification());

    expect(result.current.permission).toBe("default");
    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.show).toBe("function");
    expect(typeof result.current.requestPermission).toBe("function");
  });

  it("should detect when Notification API is not supported", () => {
    expect.hasAssertions();
    const originalNotification = window.Notification;
    // @ts-ignore
    delete window.Notification;

    const { result } = renderHook(() => useNotification());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.permission).toBe("default");

    // Restore
    window.Notification = originalNotification;
  });

  it("should sync permission state from Notification.permission", () => {
    expect.hasAssertions();
    mockNotification.permission = "granted";

    const { result } = renderHook(() => useNotification());

    expect(result.current.permission).toBe("granted");
  });

  it("should request notification permission", async () => {
    expect.hasAssertions();
    mockRequestPermission.mockResolvedValue("granted");

    const { result } = renderHook(() => useNotification());

    let permissionResult: string = "";
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
    expect(permissionResult).toBe("granted");
    expect(result.current.permission).toBe("granted");
  });

  it("should handle permission request denial", async () => {
    expect.hasAssertions();
    mockRequestPermission.mockResolvedValue("denied");

    const { result } = renderHook(() => useNotification());

    let permissionResult: string = "";
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult).toBe("denied");
    expect(result.current.permission).toBe("denied");
  });

  it("should handle errors during permission request", async () => {
    expect.hasAssertions();
    mockRequestPermission.mockRejectedValue(new Error("Permission error"));

    const { result } = renderHook(() => useNotification());

    let permissionResult: string = "";
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult).toBe("denied");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error requesting notification permission:",
      expect.any(Error)
    );
  });

  it("should return denied when requesting permission without support", async () => {
    expect.hasAssertions();
    const originalNotification = window.Notification;
    // @ts-ignore
    delete window.Notification;

    const { result } = renderHook(() => useNotification());

    let permissionResult: string = "";
    await act(async () => {
      permissionResult = await result.current.requestPermission();
    });

    expect(permissionResult).toBe("denied");
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Notification API is not supported"
    );

    // Restore
    window.Notification = originalNotification;
  });

  it("should show notification when permission is granted", async () => {
    expect.hasAssertions();
    mockNotification.permission = "granted";
    const mockNotificationInstance = { close: jest.fn() };
    mockNotification.mockReturnValue(mockNotificationInstance);

    const { result } = renderHook(() => useNotification());

    let notification: Notification | null = null;
    await act(async () => {
      notification = await result.current.show("Test Title", {
        body: "Test body",
        icon: "/icon.png",
      });
    });

    expect(mockNotification).toHaveBeenCalledWith("Test Title", {
      body: "Test body",
      icon: "/icon.png",
    });
    expect(notification).toBe(mockNotificationInstance);
  });

  it("should not show notification when permission is not granted", async () => {
    expect.hasAssertions();
    mockNotification.permission = "default";

    const { result } = renderHook(() => useNotification());

    let notification: Notification | null = null;
    await act(async () => {
      notification = await result.current.show("Test Title");
    });

    expect(mockNotification).not.toHaveBeenCalled();
    expect(notification).toBe(null);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Notification permission not granted. Current permission:",
      "default"
    );
  });

  it("should not show notification when permission is denied", async () => {
    expect.hasAssertions();
    mockNotification.permission = "denied";

    const { result } = renderHook(() => useNotification());

    let notification: Notification | null = null;
    await act(async () => {
      notification = await result.current.show("Test Title");
    });

    expect(mockNotification).not.toHaveBeenCalled();
    expect(notification).toBe(null);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Notification permission not granted. Current permission:",
      "denied"
    );
  });

  it("should return null when showing notification without support", async () => {
    expect.hasAssertions();
    const originalNotification = window.Notification;
    // @ts-ignore
    delete window.Notification;

    const { result } = renderHook(() => useNotification());

    let notification: Notification | null = null;
    await act(async () => {
      notification = await result.current.show("Test Title");
    });

    expect(notification).toBe(null);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Notification API is not supported"
    );

    // Restore
    window.Notification = originalNotification;
  });

  it("should handle errors when creating notification", async () => {
    expect.hasAssertions();
    mockNotification.permission = "granted";
    mockNotification.mockImplementation(() => {
      throw new Error("Notification error");
    });

    const { result } = renderHook(() => useNotification());

    let notification: Notification | null = null;
    await act(async () => {
      notification = await result.current.show("Test Title");
    });

    expect(notification).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error showing notification:",
      expect.any(Error)
    );
  });

  it("should show notification with all options", async () => {
    expect.hasAssertions();
    mockNotification.permission = "granted";
    const mockNotificationInstance = { close: jest.fn() };
    mockNotification.mockReturnValue(mockNotificationInstance);

    const { result } = renderHook(() => useNotification());

    const options = {
      body: "Test body",
      icon: "/icon.png",
      badge: "/badge.png",
      tag: "test-tag",
      data: { customData: "value" },
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      image: "/image.png",
    };

    await act(async () => {
      await result.current.show("Test Title", options);
    });

    expect(mockNotification).toHaveBeenCalledWith("Test Title", options);
  });

  it("should update permission state after requesting permission", async () => {
    expect.hasAssertions();
    mockRequestPermission.mockResolvedValue("granted");
    mockNotification.permission = "default";

    const { result } = renderHook(() => useNotification());

    expect(result.current.permission).toBe("default");

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe("granted");
  });
});
