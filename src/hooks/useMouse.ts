import { useEffect, useState } from "react";
import type { DeepNullable } from "@/types/utils";

type MouseData = DeepNullable<
  Pick<
    MouseEvent,
    | "clientX"
    | "clientY"
    | "movementX"
    | "movementY"
    | "offsetX"
    | "offsetY"
    | "pageX"
    | "pageY"
    | "screenX"
    | "screenY"
    | "x"
    | "y"
  >
>;
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
  // eslint-disable-next-line id-length
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
    // eslint-disable-next-line id-length
    y: screenY,
  };
}

/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
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
