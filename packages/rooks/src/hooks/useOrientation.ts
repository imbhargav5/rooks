/**
 * useOrientation
 * @description orientation hook for react
 * @see {@link https://rooks.vercel.app/docs/hooks/useOrientation}
 */
import { useState, useEffect } from "react";

const useOrientation = (): ScreenOrientation | null => {
  const [orientation, setOrientation] = useState<ScreenOrientation | null>(
    typeof window !== "undefined" ? window.screen.orientation : null
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation);
    };

    window.screen.orientation.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => {
      window.screen.orientation.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, []);

  return orientation;
};

export { useOrientation };
