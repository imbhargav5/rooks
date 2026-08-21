/**
 * Experimental Hooks
 *
 * ⚠️ WARNING: These hooks are experimental and may be removed or significantly
 * changed in any release without notice. Use with caution in production applications.
 *
 * Import experimental hooks like this:
 * import { useSuspenseNavigatorUserAgentData } from 'rooks/experimental'
 */

export { useSuspenseNavigatorUserAgentData } from "./hooks/useSuspenseNavigatorUserAgentData";
export { useSuspenseNavigatorBattery } from "./hooks/useSuspenseNavigatorBattery";
export { useSuspenseFavicon } from "./hooks/useSuspenseFavicon";
export { useSuspenseLocalStorageState } from "./hooks/useSuspenseLocalStorageState";
export { useSuspenseSessionStorageState } from "./hooks/useSuspenseSessionStorageState";
export { useSuspenseIndexedDBState } from "./hooks/useSuspenseIndexedDBState";
export { useDisposable } from "./hooks/useDisposable";
export { useAsyncDisposable } from "./hooks/useAsyncDisposable";
export { useEventListener } from "./hooks/useEventListener";
export { useIsClient } from "./hooks/useIsClient";
export { useBeforeUnload } from "./hooks/useBeforeUnload";
export { useLocationSnapshot } from "./hooks/useLocationSnapshot";
export { useLocationHash } from "./hooks/useLocationHash";
export { useLocationSearchParam } from "./hooks/useLocationSearchParam";
export { useScript } from "./hooks/useScript";
export { useKeyPress } from "./hooks/useKeyPress";
export { useSize } from "./hooks/useSize";
export { useScroll } from "./hooks/useScroll";
export { usePermission } from "./hooks/usePermission";
export { useMediaDevices } from "./hooks/useMediaDevices";
export { useResponsive } from "./hooks/useResponsive";
export { useBrowserCookieState } from "./hooks/useBrowserCookieState";
export { useRequest } from "./hooks/useRequest";
export { useWebSocket } from "./hooks/useWebSocket";
export { useVirtualList } from "./hooks/useVirtualList";

export type { UseEventListenerOptions } from "./hooks/useEventListener";
export type {
  UseScriptOptions,
  UseScriptReturnValue,
  UseScriptStatus,
} from "./hooks/useScript";
export type { KeyIdentifier, UseKeyPressOptions } from "./hooks/useKeyPress";
export type { Size, UseSizeOptions, UseSizeReturnValue } from "./hooks/useSize";
export type {
  ScrollState,
  UseScrollOptions,
  UseScrollReturnValue,
} from "./hooks/useScroll";
export type { UseBeforeUnloadOptions } from "./hooks/useBeforeUnload";
export type { LocationSnapshot } from "./hooks/useLocationSnapshot";
export type {
  PermissionDescriptorLike,
  PermissionNameLike,
  UsePermissionOptions,
  UsePermissionReturnValue,
} from "./hooks/usePermission";
export type {
  UseMediaDevicesOptions,
  UseMediaDevicesReturnValue,
} from "./hooks/useMediaDevices";
export type {
  ResponsiveMatches,
  UseResponsiveOptions,
  UseResponsiveReturnValue,
} from "./hooks/useResponsive";
export type {
  CookieScopeOptions,
  DecodeFunction,
  EncodeFunction,
  JsonPrimitive,
  JsonValue,
  UseBrowserCookieStateOptions,
  UseBrowserCookieStateReturnValue,
} from "./hooks/useBrowserCookieState";
export type {
  PromiseService,
  UseRequestOptions,
  UseRequestReturnValue,
  ValidUseRequestOptions,
} from "./hooks/useRequest";
export type {
  UseWebSocketOptions,
  UseWebSocketReconnectOptions,
  UseWebSocketReturnValue,
  UseWebSocketStatus,
} from "./hooks/useWebSocket";
export type {
  UseVirtualListOptions,
  UseVirtualListReturnValue,
  VirtualListItem,
  VirtualListOrientation,
} from "./hooks/useVirtualList";
