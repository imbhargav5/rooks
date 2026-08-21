import * as experimental from "@/experimental";
import * as stable from "@/index";

describe("experimental exports", () => {
  it("exports experimental hooks from rooks/experimental only", () => {
    const experimentalOnlyHooks = [
      "useDisposable",
      "useAsyncDisposable",
      "useEventListener",
      "useScript",
      "useKeyPress",
      "useSize",
      "useScroll",
      "useIsClient",
      "useBeforeUnload",
      "useLocationSnapshot",
      "useLocationHash",
      "useLocationSearchParam",
      "usePermission",
      "useMediaDevices",
      "useBrowserCookieState",
      "useRequest",
      "useWebSocket",
      "useResponsive",
      "useVirtualList",
    ] as const;

    for (const hookName of experimentalOnlyHooks) {
      expect(experimental[hookName]).toBeDefined();
      expect(hookName in stable).toBe(false);
    }
  });
});
