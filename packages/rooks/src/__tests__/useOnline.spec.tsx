import { vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { useOnline } from "@/hooks/useOnline";

describe("useOnline", () => {
  let onlineGetter = vi.spyOn(window.navigator, "onLine", "get");

  beforeEach(() => {
    onlineGetter = vi.spyOn(window.navigator, "onLine", "get");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useOnline).toBeDefined();
  });

  it("should get the online status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
  });

  it("should get the offline status", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(false);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(false);
  });

  it("should update when the online event fires", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(false);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(false);

    // Simulate going online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });

  it("should update when the offline event fires", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);

    // Simulate going offline
    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("should handle rapid online/offline toggles", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);

    // Toggle offline
    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);

    // Toggle back online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current).toBe(true);

    // Toggle offline again
    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);
  });

  it("should clean up event listeners on unmount", () => {
    expect.hasAssertions();
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    onlineGetter.mockReturnValue(true);
    const { unmount } = renderHook(() => useOnline());

    // Should have added online and offline listeners
    expect(addSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("offline", expect.any(Function));

    unmount();

    // Should have removed online and offline listeners
    expect(removeSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("offline", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("should not respond to events after unmount", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result, unmount } = renderHook(() => useOnline());
    expect(result.current).toBe(true);

    unmount();

    // Dispatch event after unmount - should not throw
    onlineGetter.mockReturnValue(false);
    expect(() => {
      act(() => {
        window.dispatchEvent(new Event("offline"));
      });
    }).not.toThrow();
  });

  it("should work with multiple hook instances", () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const { result: result1 } = renderHook(() => useOnline());
    const { result: result2 } = renderHook(() => useOnline());

    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);

    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);
  });

  it("hydrates the server snapshot before reporting navigator state", async () => {
    expect.hasAssertions();
    onlineGetter.mockReturnValue(true);
    const onRecoverableError = vi.fn();

    function OnlineStatus() {
      const online = useOnline();
      return <span>{online === null ? "unknown" : String(online)}</span>;
    }

    const container = document.createElement("div");
    container.innerHTML = renderToString(<OnlineStatus />);
    expect(container).toHaveTextContent("unknown");

    const root = hydrateRoot(container, <OnlineStatus />, {
      onRecoverableError,
    });

    try {
      await waitFor(() => {
        expect(container).toHaveTextContent("true");
      });
      expect(onRecoverableError).not.toHaveBeenCalled();
    } finally {
      act(() => {
        root.unmount();
      });
    }
  });
});
