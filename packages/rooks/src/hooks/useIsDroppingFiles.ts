/**
 * useIsDroppingFiles
 * @description Check if any files are currently being dropped anywhere. Useful for highlighting drop areas.
 * @see {@link https://rooks.vercel.app/docs/useIsDroppingFiles}
 */
import { CallbackRef, HTMLElementOrNull } from "@/utils/utils";
import { useState, useEffect, useCallback } from "react";
import { useFreshCallback } from "./useFreshCallback";

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

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        if (!isDroppingFiles) {
          setIsDroppingFiles(true);
        }
      } else {
        setIsDroppingFiles(false);
      }
    },
    [isDroppingFiles]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        if (!isDroppingFiles) {
          setIsDroppingFiles(true);
        }
      } else {
        setIsDroppingFiles(false);
      }
    },
    [isDroppingFiles]
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDroppingFiles(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDroppingFiles(false);
  }, []);

  const freshHandleDragEnter = useFreshCallback(handleDragEnter);
  const freshHandleDragOver = useFreshCallback(handleDragOver);
  const freshHandleDragLeave = useFreshCallback(handleDragLeave);
  const freshHandleDrop = useFreshCallback(handleDrop);

  useEffect(() => {
    const target = isTargetWindow ? window : targetNode;

    if (target) {
      target.addEventListener("dragenter", freshHandleDragEnter);
      target.addEventListener("dragover", freshHandleDragOver);
      target.addEventListener("dragleave", freshHandleDragLeave);
      target.addEventListener("drop", freshHandleDrop);
    }

    return () => {
      if (target) {
        target.removeEventListener("dragenter", freshHandleDragEnter);
        target.removeEventListener("dragover", freshHandleDragOver);
        target.removeEventListener("dragleave", freshHandleDragLeave);
        target.removeEventListener("drop", freshHandleDrop);
      }
    };
  }, [
    freshHandleDragEnter,
    freshHandleDragLeave,
    freshHandleDragOver,
    freshHandleDrop,
    isDroppingFiles,
    isTargetWindow,
    targetNode,
  ]);
  if (isTargetWindow) {
    return isDroppingFiles;
  }

  return [ref, isDroppingFiles];
}

export { useIsDroppingFiles };
