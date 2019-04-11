import { useEffect, useState } from "react";

interface MouseData {
  x: number | null;
  y: number | null;
  screenX: number | null;
  screenY: number | null;
  pageX: number | null;
  pageY: number | null;
  clientX: number | null;
  clientY: number | null;
  movementX: number | null;
  movementY: number | null;
  offsetX: number | null;
  offsetY: number | null;
}

const initialMouseState: MouseData = {
  x: null,
  y: null,
  screenX: null,
  screenY: null,
  pageX: null,
  pageY: null,
  clientX: null,
  clientY: null,
  movementX: null,
  movementY: null,
  offsetX: null,
  offsetY: null
};

function getMousePositionFromEvent(e: MouseEvent): MouseData {
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
    offsetY
  } = e;
  return {
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
    x: screenX,
    y: screenY
  };
}

/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
 */
export default function useMouse(): MouseData {
  const [mousePosition, setMousePostition] = useState<MouseData>(
    initialMouseState
  );

  function updateMousePosition(e: MouseEvent) {
    setMousePostition(getMousePositionFromEvent(e));
  }

  useEffect(() => {
    document.addEventListener("mousemove", updateMousePosition);
    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mousePosition;
}
