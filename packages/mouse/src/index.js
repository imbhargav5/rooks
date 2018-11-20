import { useEffect, useState } from "react";

const initialMouseState = {
  x: null,
  y: null
};

function getMousePositionFromEvent(e) {
  const { screenX: x, screenY: y } = e;
  return { x, y };
}

export default function() {
  const [mousePosition, setMousePostition] = useState(initialMouseState);

  function updateMousePosition(e) {
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
