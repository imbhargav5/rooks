import { useSyncExternalStore } from "react";

type MouseData = {
  clientX: number | null;
  clientY: number | null;
  movementX: number | null;
  movementY: number | null;
  offsetX: number | null;
  offsetY: number | null;
  pageX: number | null;
  pageY: number | null;
  screenX: number | null;
  screenY: number | null;
  x: number | null;
  y: number | null;
};

const initialMouseState: MouseData = {
  clientX: null,
  clientY: null,
  movementX: null,
  movementY: null,
  offsetX: null,
  offsetY: null,
  pageX: null,
  pageY: null,
  screenX: null,
  screenY: null,
  x: null,
  y: null,
};

// Module-level state to store the current mouse position
let currentMouseData: MouseData = initialMouseState;

function getMousePositionFromEvent(event: MouseEvent): MouseData {
  const {
    screenX,
    screenY,
    movementX,
    movementY,
    pageX,
    pageY,
    clientX,
    clientY,
    offsetX,
    offsetY,
  } = event;

  return {
    clientX,
    clientY,
    movementX,
    movementY,
    offsetX,
    offsetY,
    pageX,
    pageY,
    screenX,
    screenY,
    x: screenX,
    y: screenY,
  };
}

// Set of listeners to notify on mouse move
const listeners = new Set<() => void>();

function handleMouseMove(event: MouseEvent): void {
  currentMouseData = getMousePositionFromEvent(event);
  listeners.forEach((listener) => listener());
}

// Track if we've added the global listener
let isListening = false;

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  // Add global listener only once when first subscriber connects
  if (!isListening && typeof document !== "undefined") {
    document.addEventListener("mousemove", handleMouseMove);
    isListening = true;
  }

  return () => {
    listeners.delete(onStoreChange);

    // Remove global listener when last subscriber disconnects
    if (listeners.size === 0 && isListening && typeof document !== "undefined") {
      document.removeEventListener("mousemove", handleMouseMove);
      isListening = false;
      // Reset state when no subscribers
      currentMouseData = initialMouseState;
    }
  };
}

function getSnapshot(): MouseData {
  return currentMouseData;
}

function getServerSnapshot(): MouseData {
  return initialMouseState;
}

/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
 * @see https://rooks.vercel.app/docs/hooks/useMouse
 */
export function useMouse(): MouseData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
