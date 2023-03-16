/**
 * useIsDroppingFiles
 * @description Check if any files are currently being dropped anywhere. Useful for highlighting drop areas.
 * @see {@link https://rooks.vercel.app/docs/useIsDroppingFiles}
 */
import { CallbackRef, HTMLElementOrNull } from "@/utils/utils";
import { useState, useEffect, useCallback } from "react";

function useIsDroppingFiles(isTargetWindow: true): boolean;
function useIsDroppingFiles(
  isTargetWindow?: false
): [CallbackRef<HTMLElement | null>, boolean];

function useIsDroppingFiles(
  isTargetWindow = false
): boolean | [CallbackRef<HTMLElement | null>, boolean] {
  const [targetNode, setTargetNode] = useState<HTMLElementOrNull>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);
  const [isDroppingFiles, setIsDroppingFiles] = useState(false);

  useEffect(() => {
    const target = isTargetWindow ? window : targetNode;
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setIsDroppingFiles(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDroppingFiles(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDroppingFiles(false);
    };

    if (target) {
      target.addEventListener("dragenter", handleDragEnter);
      target.addEventListener("dragleave", handleDragLeave);
      target.addEventListener("drop", handleDrop);
    }

    return () => {
      if (target) {
        target.removeEventListener("dragenter", handleDragEnter);
        target.removeEventListener("dragleave", handleDragLeave);
        target.removeEventListener("drop", handleDrop);
      }
    };
  }, [isTargetWindow, targetNode]);
  if (isTargetWindow) {
    return isDroppingFiles;
  }

  return [ref, isDroppingFiles];
}

export { useIsDroppingFiles };
