import { useSyncExternalStore } from "react";

export type LocationSnapshot = {
  href: string;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
};

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();

let cleanup: (() => void) | null = null;
let historyPatched = false;
let originalPushState: History["pushState"] | null = null;
let originalReplaceState: History["replaceState"] | null = null;
let patchedPushState: History["pushState"] | null = null;
let patchedReplaceState: History["replaceState"] | null = null;
let activePatchGeneration = 0;
let cachedHref: string | null = null;
let cachedSnapshot: LocationSnapshot | null = null;

function emitLocationChange() {
  for (const subscriber of subscribers) {
    subscriber();
  }
}

function patchHistoryMethods() {
  if (
    historyPatched ||
    typeof window === "undefined" ||
    typeof history === "undefined"
  ) {
    return;
  }

  originalPushState = history.pushState;
  originalReplaceState = history.replaceState;
  const pushStateToCall = history.pushState;
  const replaceStateToCall = history.replaceState;
  const patchGeneration = activePatchGeneration + 1;
  activePatchGeneration = patchGeneration;

  patchedPushState = function pushStatePatched(this: History, ...args) {
    const result = pushStateToCall.apply(this, args);
    if (historyPatched && activePatchGeneration === patchGeneration) {
      emitLocationChange();
    }
    return result;
  };

  patchedReplaceState = function replaceStatePatched(this: History, ...args) {
    const result = replaceStateToCall.apply(this, args);
    if (historyPatched && activePatchGeneration === patchGeneration) {
      emitLocationChange();
    }
    return result;
  };

  history.pushState = patchedPushState;
  history.replaceState = patchedReplaceState;

  historyPatched = true;
}

function unpatchHistoryMethods() {
  if (!historyPatched || !originalPushState || !originalReplaceState) {
    return;
  }

  const ownsPushState = history.pushState === patchedPushState;
  const ownsReplaceState = history.replaceState === patchedReplaceState;

  if (ownsPushState) {
    history.pushState = originalPushState;
  }
  if (ownsReplaceState) {
    history.replaceState = originalReplaceState;
  }

  historyPatched = false;
  activePatchGeneration += 1;
  originalPushState = null;
  originalReplaceState = null;
  patchedPushState = null;
  patchedReplaceState = null;
}

function ensureListeners() {
  if (cleanup || typeof window === "undefined") {
    return;
  }

  patchHistoryMethods();

  const handleChange = () => {
    emitLocationChange();
  };

  window.addEventListener("popstate", handleChange);
  window.addEventListener("hashchange", handleChange);

  cleanup = () => {
    window.removeEventListener("popstate", handleChange);
    window.removeEventListener("hashchange", handleChange);
    cleanup = null;
    unpatchHistoryMethods();
  };
}

function teardownListenersIfNeeded() {
  if (subscribers.size === 0) {
    cleanup?.();
  }
}

export function getLocationSnapshot(): LocationSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const { location } = window;
  if (location.href === cachedHref && cachedSnapshot) {
    return cachedSnapshot;
  }

  cachedHref = location.href;
  cachedSnapshot = {
    href: location.href,
    origin: location.origin,
    protocol: location.protocol,
    host: location.host,
    hostname: location.hostname,
    port: location.port,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };

  return cachedSnapshot;
}

function subscribe(onStoreChange: Subscriber) {
  ensureListeners();
  subscribers.add(onStoreChange);

  return () => {
    subscribers.delete(onStoreChange);
    teardownListenersIfNeeded();
  };
}

function getServerSnapshot() {
  return null;
}

export function useLocationStore(): LocationSnapshot | null {
  return useSyncExternalStore(
    subscribe,
    getLocationSnapshot,
    getServerSnapshot
  );
}

export function __resetLocationStoreForTests() {
  subscribers.clear();
  cleanup?.();
  cleanup = null;
  unpatchHistoryMethods();
  cachedHref = null;
  cachedSnapshot = null;
}
