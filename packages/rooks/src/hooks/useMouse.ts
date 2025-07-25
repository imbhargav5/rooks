import { useEffect, useState } from "react";

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

/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
 * @see https://rooks.vercel.app/docs/hooks/useMouse
 */
export function useMouse(): MouseData {
  const [mousePosition, setMousePosition] =
    useState<MouseData>(initialMouseState);

  function updateMousePosition(event: MouseEvent) {
    setMousePosition(getMousePositionFromEvent(event));
  }

  useEffect(() => {
    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
}
