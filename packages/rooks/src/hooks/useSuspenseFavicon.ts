/**
 * useSuspenseFavicon
 * @description Suspense-enabled hook for reading and updating the current favicon
 * @see {@link https://rooks.vercel.app/docs/hooks/useSuspenseFavicon}
 */

/// <reference lib="dom" />

import { useEffect, useMemo, useRef, useState } from "react";

type SameOriginFavicon = {
  kind: "same-origin";
  relativeHref: string;
  href: string;
};

type ExternalFavicon = {
  kind: "external";
  url: string;
  href: string;
};

type CurrentFavicon = SameOriginFavicon | ExternalFavicon | null;

type UpdateFaviconURLConfig =
  | { kind: "same-origin"; relativeHref: string }
  | { kind: "external"; url: string };

type UnmountStrategy = "restore-originals" | "leave-as-is";

interface UseSuspenseFaviconOptions {
  /**
   * Controls how the hook cleans up the managed favicon when the last hook
   * instance unmounts.
   * @default "restore-originals"
   */
  unmountStrategy?: UnmountStrategy;
}

interface UseSuspenseFaviconControls {
  /**
   * Updates the document favicon using a same-origin relative href or an
   * external absolute URL.
   */
  updateFaviconURL: (config: UpdateFaviconURLConfig) => void;
}

type UseSuspenseFaviconReturnValue = [
  CurrentFavicon,
  UseSuspenseFaviconControls,
];

type Subscriber = (favicon: CurrentFavicon) => void;

interface FaviconSnapshotEntry {
  link: HTMLLinkElement;
  placeholder: Comment;
}

interface FaviconResource {
  status: "idle" | "pending" | "resolved" | "rejected";
  promise?: Promise<CurrentFavicon>;
  result?: CurrentFavicon;
  error?: Error;
  currentValue: CurrentFavicon;
  subscribers: Set<Subscriber>;
  originalLinks: FaviconSnapshotEntry[] | null;
  managedLink: HTMLLinkElement | null;
  isManaging: boolean;
  instanceCount: number;
  instanceStrategies: Map<symbol, UnmountStrategy>;
}

const MANAGED_FAVICON_ATTRIBUTE = "data-rooks-managed-favicon";
const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

const resource: FaviconResource = {
  status: "idle",
  currentValue: null,
  subscribers: new Set(),
  originalLinks: null,
  managedLink: null,
  isManaging: false,
  instanceCount: 0,
  instanceStrategies: new Map(),
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function ensureBrowserEnvironment(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error(
      "useSuspenseFavicon can only be used in a browser environment."
    );
  }
}

function getDocumentHead(): HTMLHeadElement {
  ensureBrowserEnvironment();

  if (!document.head) {
    throw new Error("useSuspenseFavicon requires document.head to be available.");
  }

  return document.head;
}

function isIconLink(link: HTMLLinkElement): boolean {
  const relAttribute = link.getAttribute("rel");

  if (!relAttribute) {
    return false;
  }

  return relAttribute
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .includes("icon");
}

function getExplicitFaviconLinks(): HTMLLinkElement[] {
  const head = getDocumentHead();

  return Array.from(head.querySelectorAll('link[rel][href]')).filter(
    (node): node is HTMLLinkElement =>
      node instanceof HTMLLinkElement && isIconLink(node)
  );
}

function normalizeRelativeHref(url: URL): string {
  return `${url.pathname}${url.search}${url.hash}`;
}

function createSameOriginFavicon(
  url: URL,
  relativeHref = normalizeRelativeHref(url)
): SameOriginFavicon {
  return {
    kind: "same-origin",
    relativeHref,
    href: url.href,
  };
}

function classifyFaviconHref(
  href: string,
  preferredRelativeHref?: string
): CurrentFavicon {
  const resolved = new URL(href, document.baseURI);

  if (resolved.origin === window.location.origin) {
    return createSameOriginFavicon(resolved, preferredRelativeHref);
  }

  return {
    kind: "external",
    url: resolved.href,
    href: resolved.href,
  };
}

function discoverCurrentFavicon(): CurrentFavicon {
  ensureBrowserEnvironment();

  const links = getExplicitFaviconLinks();

  for (let index = links.length - 1; index >= 0; index -= 1) {
    const href = links[index]?.getAttribute("href");

    if (!href) {
      continue;
    }

    try {
      return classifyFaviconHref(href);
    } catch {
      continue;
    }
  }

  return null;
}

function createInitializationPromise(): Promise<CurrentFavicon> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(discoverCurrentFavicon());
      } catch (error) {
        reject(toError(error));
      }
    }, 0);
  });
}

function initializeResourceIfNeeded(): void {
  ensureBrowserEnvironment();

  if (resource.status !== "idle") {
    return;
  }

  const promise = createInitializationPromise();

  resource.status = "pending";
  resource.promise = promise;

  promise
    .then((result) => {
      resource.status = "resolved";
      resource.result = result;
      resource.currentValue = result;
    })
    .catch((error) => {
      resource.status = "rejected";
      resource.error = toError(error);
    });
}

function notifySubscribers(nextValue: CurrentFavicon): void {
  resource.currentValue = nextValue;
  resource.result = nextValue;
  resource.status = "resolved";
  resource.error = undefined;

  for (const subscriber of resource.subscribers) {
    subscriber(nextValue);
  }
}

function ensureManagedMode(): void {
  if (resource.isManaging) {
    return;
  }

  const faviconLinks = getExplicitFaviconLinks();

  resource.originalLinks = faviconLinks.map((link) => {
    const placeholder = document.createComment("rooks-favicon-placeholder");
    link.parentNode?.insertBefore(placeholder, link);
    link.remove();

    return {
      link,
      placeholder,
    };
  });

  resource.isManaging = true;
  resource.managedLink = null;
}

function getOrCreateManagedLink(): HTMLLinkElement {
  const head = getDocumentHead();

  if (resource.managedLink?.isConnected) {
    return resource.managedLink;
  }

  const link = document.createElement("link");
  link.setAttribute("rel", "icon");
  link.setAttribute(MANAGED_FAVICON_ATTRIBUTE, "true");
  head.appendChild(link);

  resource.managedLink = link;

  return link;
}

function cleanupManagedLinkReference(): void {
  if (resource.managedLink?.isConnected) {
    resource.managedLink.remove();
  }

  resource.managedLink = null;
}

function restoreOriginalLinks(): void {
  const head = typeof document !== "undefined" ? document.head : null;

  cleanupManagedLinkReference();

  if (!resource.originalLinks) {
    resource.isManaging = false;
    return;
  }

  for (const { link, placeholder } of resource.originalLinks) {
    if (placeholder.parentNode) {
      placeholder.parentNode.replaceChild(link, placeholder);
    } else if (head) {
      head.appendChild(link);
    }
  }

  resource.originalLinks = null;
  resource.isManaging = false;
}

function discardOriginalSnapshot(): void {
  if (resource.originalLinks) {
    for (const { placeholder } of resource.originalLinks) {
      placeholder.remove();
    }
  }

  resource.originalLinks = null;
  resource.isManaging = false;
  resource.managedLink = null;
}

function removeManagedLinksFromDocument(): void {
  if (typeof document === "undefined") {
    return;
  }

  for (const managedLink of Array.from(
    document.head?.querySelectorAll(`link[${MANAGED_FAVICON_ATTRIBUTE}]`) ?? []
  )) {
    managedLink.remove();
  }
}

function resetInitializationState(): void {
  resource.status = "idle";
  resource.promise = undefined;
  resource.result = undefined;
  resource.error = undefined;
  resource.currentValue = null;
}

function cleanupAfterLastUnmount(strategy: UnmountStrategy): void {
  if (resource.isManaging || resource.originalLinks || resource.managedLink) {
    if (strategy === "restore-originals") {
      restoreOriginalLinks();
    } else {
      discardOriginalSnapshot();
    }
  }

  resource.instanceStrategies.clear();
  resource.instanceCount = 0;
  resetInitializationState();
}

function resolveSameOriginRelativeHref(relativeHref: string): URL {
  ensureBrowserEnvironment();

  const trimmedRelativeHref = relativeHref.trim();

  if (!trimmedRelativeHref) {
    throw new Error(
      "useSuspenseFavicon expected a non-empty same-origin relativeHref."
    );
  }

  if (
    ABSOLUTE_URL_PATTERN.test(trimmedRelativeHref) ||
    trimmedRelativeHref.startsWith("//")
  ) {
    throw new Error(
      "useSuspenseFavicon expected same-origin updates to use a relative href string."
    );
  }

  const resolved = new URL(trimmedRelativeHref, document.baseURI);

  if (resolved.origin !== window.location.origin) {
    throw new Error(
      "useSuspenseFavicon expected same-origin updates to resolve to the current origin."
    );
  }

  return resolved;
}

function resolveExternalUrl(url: string): URL {
  ensureBrowserEnvironment();

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    throw new Error("useSuspenseFavicon expected a non-empty external url.");
  }

  const resolved = new URL(trimmedUrl, document.baseURI);

  if (resolved.origin === window.location.origin) {
    throw new Error(
      "useSuspenseFavicon expected external updates to resolve to a different origin."
    );
  }

  return resolved;
}

function updateFaviconURL(config: UpdateFaviconURLConfig): void {
  ensureBrowserEnvironment();
  ensureManagedMode();

  const managedLink = getOrCreateManagedLink();

  if (config.kind === "same-origin") {
    const trimmedRelativeHref = config.relativeHref.trim();
    const resolved = resolveSameOriginRelativeHref(trimmedRelativeHref);

    managedLink.setAttribute("href", trimmedRelativeHref);
    notifySubscribers(createSameOriginFavicon(resolved, trimmedRelativeHref));
    return;
  }

  const resolved = resolveExternalUrl(config.url);

  managedLink.setAttribute("href", resolved.href);
  notifySubscribers({
    kind: "external",
    url: resolved.href,
    href: resolved.href,
  });
}

/**
 * Clear the internal cache and restore managed DOM changes.
 * Useful for tests.
 *
 * @internal
 */
export function clearCache(): void {
  restoreOriginalLinks();
  removeManagedLinksFromDocument();
  resource.subscribers.clear();
  resource.instanceStrategies.clear();
  resource.instanceCount = 0;
  resetInitializationState();
}

/**
 * Suspense-enabled hook for reading and updating the current favicon.
 *
 * The hook suspends during the initial favicon discovery phase and then returns
 * the current favicon resource along with controls for switching to a new
 * same-origin or external favicon URL.
 */
function useSuspenseFavicon(
  options: UseSuspenseFaviconOptions = {}
): UseSuspenseFaviconReturnValue {
  const { unmountStrategy = "restore-originals" } = options;
  const instanceId = useRef(Symbol("useSuspenseFavicon"));
  const latestUnmountStrategy = useRef<UnmountStrategy>(unmountStrategy);

  latestUnmountStrategy.current = unmountStrategy;

  initializeResourceIfNeeded();

  if (resource.status === "pending") {
    throw resource.promise;
  }

  if (resource.status === "rejected") {
    throw resource.error;
  }

  const [favicon, setFavicon] = useState<CurrentFavicon>(resource.currentValue);

  useEffect(() => {
    const subscriber: Subscriber = (nextFavicon) => {
      setFavicon(nextFavicon);
    };

    resource.subscribers.add(subscriber);
    resource.instanceCount += 1;
    resource.instanceStrategies.set(
      instanceId.current,
      latestUnmountStrategy.current
    );

    setFavicon(resource.currentValue);

    return () => {
      resource.subscribers.delete(subscriber);
      resource.instanceStrategies.delete(instanceId.current);
      resource.instanceCount = Math.max(0, resource.instanceCount - 1);

      if (resource.instanceCount === 0) {
        cleanupAfterLastUnmount(latestUnmountStrategy.current);
      }
    };
  }, []);

  useEffect(() => {
    resource.instanceStrategies.set(instanceId.current, unmountStrategy);
  }, [unmountStrategy]);

  const controls = useMemo<UseSuspenseFaviconControls>(
    () => ({
      updateFaviconURL,
    }),
    []
  );

  return [favicon, controls];
}

export { useSuspenseFavicon };
