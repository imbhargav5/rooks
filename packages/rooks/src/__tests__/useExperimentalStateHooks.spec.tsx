import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useBrowserCookieState } from "@/hooks/useBrowserCookieState";
import { useLocationHash } from "@/hooks/useLocationHash";
import { useLocationSearchParam } from "@/hooks/useLocationSearchParam";
import { useLocationSnapshot } from "@/hooks/useLocationSnapshot";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { usePermission } from "@/hooks/usePermission";
import { useResponsive } from "@/hooks/useResponsive";
import { __resetLocationStoreForTests } from "@/utils/locationStore";

describe("experimental state hooks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = "theme=; Max-Age=0; Path=/";
    __resetLocationStoreForTests();
  });

  describe("location hooks", () => {
    beforeEach(() => {
      window.history.replaceState({}, "", "/initial?name=rooks#one");
      __resetLocationStoreForTests();
    });

    it("returns a location snapshot", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useLocationSnapshot());

      expect(result.current).toMatchObject({
        pathname: "/initial",
        search: "?name=rooks",
        hash: "#one",
      });
    });

    it("updates derived hooks when history changes", async () => {
      expect.hasAssertions();
      const hashHook = renderHook(() => useLocationHash());
      const paramHook = renderHook(() => useLocationSearchParam("name"));

      act(() => {
        window.history.pushState({}, "", "/next?name=hooks#two");
      });

      await waitFor(() => {
        expect(hashHook.result.current).toBe("#two");
        expect(paramHook.result.current).toBe("hooks");
      });
    });
  });

  describe("usePermission", () => {
    it("queries and updates permission state", async () => {
      expect.hasAssertions();
      const permissionStatus = new EventTarget() as PermissionStatus;
      Object.defineProperty(permissionStatus, "state", {
        configurable: true,
        writable: true,
        value: "granted",
      });

      Object.defineProperty(navigator, "permissions", {
        configurable: true,
        value: {
          query: vi.fn().mockResolvedValue(permissionStatus),
        },
      });

      const { result } = renderHook(() =>
        usePermission({ name: "clipboard-read" } as PermissionDescriptor)
      );

      await waitFor(() => {
        expect(result.current.state).toBe("granted");
      });

      act(() => {
        Object.defineProperty(permissionStatus, "state", {
          configurable: true,
          writable: true,
          value: "denied",
        });
        permissionStatus.dispatchEvent(new Event("change"));
      });

      await waitFor(() => {
        expect(result.current.state).toBe("denied");
      });
    });
  });

  describe("useMediaDevices", () => {
    it("enumerates devices and can request access", async () => {
      expect.hasAssertions();
      const enumerateDevices = vi.fn().mockResolvedValue([
        { deviceId: "1", kind: "audioinput", label: "Mic" },
        { deviceId: "2", kind: "videoinput", label: "Cam" },
      ]);
      const stop = vi.fn();
      const getUserMedia = vi.fn().mockResolvedValue({
        getTracks: () => [{ stop }],
      });
      const target = new EventTarget();

      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: {
          enumerateDevices,
          getUserMedia,
          addEventListener: target.addEventListener.bind(target),
          removeEventListener: target.removeEventListener.bind(target),
        },
      });

      const { result } = renderHook(() => useMediaDevices());

      await waitFor(() => {
        expect(result.current.devices).toHaveLength(2);
        expect(result.current.audioInputs).toHaveLength(1);
        expect(result.current.videoInputs).toHaveLength(1);
      });

      await act(async () => {
        await result.current.requestAccess({ audio: true });
      });

      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(stop).toHaveBeenCalled();
    });
  });

  describe("useResponsive", () => {
    it("tracks matching breakpoints", async () => {
      expect.hasAssertions();
      const mediaQueries = new Map<string, MediaQueryList>();

      window.matchMedia = vi.fn().mockImplementation((query: string) => {
        if (!mediaQueries.has(query)) {
          const target = new EventTarget() as MediaQueryList;
          Object.defineProperty(target, "media", {
            configurable: true,
            value: query,
          });
          Object.defineProperty(target, "matches", {
            configurable: true,
            writable: true,
            value: query === "(min-width: 1024px)",
          });
          Object.assign(target, {
            addListener: vi.fn(),
            removeListener: vi.fn(),
          });
          mediaQueries.set(query, target);
        }

        return mediaQueries.get(query)!;
      });

      const { result } = renderHook(() =>
        useResponsive(
          {
            mobile: "(max-width: 767px)",
            desktop: "(min-width: 1024px)",
          },
          { defaultValue: "mobile" }
        )
      );

      expect(result.current.current).toBe("desktop");
      expect(result.current.matches.desktop).toBe(true);

      act(() => {
        const desktopQuery = mediaQueries.get("(min-width: 1024px)")!;
        Object.defineProperty(desktopQuery, "matches", {
          configurable: true,
          writable: true,
          value: false,
        });
        desktopQuery.dispatchEvent(new Event("change"));
      });

      await waitFor(() => {
        expect(result.current.current).toBe("mobile");
      });
    });
  });

  describe("useBrowserCookieState", () => {
    it("persists and removes cookie-backed state", async () => {
      expect.hasAssertions();
      const firstHook = renderHook(() =>
        useBrowserCookieState("theme", "light", { path: "/" })
      );
      const secondHook = renderHook(() =>
        useBrowserCookieState("theme", "light", { path: "/" })
      );

      act(() => {
        const [, setTheme] = firstHook.result.current;
        setTheme("dark");
      });

      await waitFor(() => {
        expect(firstHook.result.current[0]).toBe("dark");
        expect(secondHook.result.current[0]).toBe("dark");
      });

      act(() => {
        const [, , removeTheme] = firstHook.result.current;
        removeTheme();
      });

      await waitFor(() => {
        expect(firstHook.result.current[0]).toBe("light");
        expect(secondHook.result.current[0]).toBe("light");
      });
    });
  });
});
