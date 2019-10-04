import { useEffect, useState } from "react";

interface MouseData {
  target: EventTarget | null;
  position: {
    client: { x: number | null; y: number | null };
    page: { x: number | null; y: number | null };
    screen: { x: number | null; y: number | null };
    offset: { x: number | null; y: number | null };
  };
  movement: { x: number | null; y: number | null };
  buttons: {
    left: boolean;
    right: boolean;
    middle: boolean;
  };
  keyboard: {
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
  };
}

const initialMouseState: MouseData = {
  target: null,
  position: {
    client: { x: null, y: null },
    page: { x: null, y: null },
    screen: { x: null, y: null },
    offset: { x: null, y: null }
  },
  movement: { x: null, y: null },
  buttons: {
    left: false,
    right: false,
    middle: false
  },
  keyboard: {
    alt: false,
    ctrl: false,
    meta: false,
    shift: false
  }
};

/**
 * useMouse hook
 *
 * Retrieves current mouse position and information about the position like
 * screenX, pageX, clientX, movementX, offsetX
 */
export function useMouse(): MouseData {
  const [mouse, setMouse] = useState<MouseData>(initialMouseState);
  useEffect(() => {
    const events = ["mousedown", "mousemove", "mouseup"];
    const handleMouseEvent = (event: MouseEvent) => {
      const {
        target,
        altKey,
        clientX,
        clientY,
        ctrlKey,
        metaKey,
        movementX,
        movementY,
        screenX,
        screenY,
        pageX,
        pageY,
        offsetX,
        offsetY,
        shiftKey,
        buttons
      } = event;
      setMouse({
        target,
        position: {
          client: { x: clientX, y: clientY },
          page: { x: pageX, y: pageY },
          screen: { x: screenX, y: screenY },
          offset: { x: offsetX, y: offsetY }
        },
        movement: { x: movementX, y: movementY },
        buttons: {
          left: [1, 3, 5, 7].includes(buttons),
          right: [2, 3, 6, 7].includes(buttons),
          middle: [4, 5, 6, 7].includes(buttons)
        },
        keyboard: {
          alt: altKey,
          ctrl: ctrlKey,
          meta: metaKey,
          shift: shiftKey
        }
      });
    };
    events.forEach(eventType => {
      document.addEventListener(eventType, handleMouseEvent);
    });
    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleMouseEvent);
      });
    };
  }, []);

  return mouse;
}
