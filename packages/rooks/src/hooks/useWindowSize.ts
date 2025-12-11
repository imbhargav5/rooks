import { useSyncExternalStore } from "react";
import type { DeepNullable } from "@/types/utils";

type WindowDimensions = DeepNullable<
  Pick<Window, "innerHeight" | "innerWidth" | "outerHeight" | "outerWidth">
>;

const nullDimensions: WindowDimensions = {
  innerHeight: null,
  innerWidth: null,
  outerHeight: null,
  outerWidth: null,
};

// Cache the current dimensions to ensure referential stability
let cachedDimensions: WindowDimensions | null = null;

function getDimensions(): WindowDimensions {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

// Set of listeners to notify on resize
const listeners = new Set<() => void>();

function handleResize(): void {
  cachedDimensions = getDimensions();
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void): () => void {
  // Add listener to the resize event on first subscription
  if (listeners.size === 0 && typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
  }

  listeners.add(onStoreChange);

  return () => {
    listeners.delete(onStoreChange);

    // Clean up when last subscriber disconnects
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
      cachedDimensions = null;
    }
  };
}

function getSnapshot(): WindowDimensions {
  if (typeof window === "undefined") {
    return nullDimensions;
  }

  // Initialize cache on first call if needed
  if (cachedDimensions === null) {
    cachedDimensions = getDimensions();
  }

  return cachedDimensions;
}

function getServerSnapshot(): WindowDimensions {
  return nullDimensions;
}

/**
 * useWindowSize hook
 * A hook that provides information of the dimensions of the window
 *
 * @returns Dimensions of the window
 * @see https://rooks.vercel.app/docs/hooks/useWindowSize
 */
export function useWindowSize(): WindowDimensions {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
