/**
 * useFileDropRef
 * @description Drop files easily
 * @see {@link https://rooks.vercel.app/docs/hooks/useFileDropRef}
 */
import { noop } from "@/utils/noop";
import { useCallback, useState, useEffect } from "react";
import { useFreshCallback } from "./useFreshCallback";

type FileDropOptions = {
  accept?: string[];
  maxFileSize?: number;
  maxFiles?: number;
};

type FileDropCallbacks = {
  onDrop?: (acceptedFiles: File[], rejectedFiles: File[]) => void;
  onFileAccepted?: (file: File) => void;
  onFileRejected?: (file: File, reason: string) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
};

type FileDropRef = (node: HTMLElement | null) => void;

function useFileDropRef(
  options: FileDropOptions = {},
  callbacks: FileDropCallbacks = {}
): FileDropRef {
  const { accept, maxFileSize, maxFiles } = options;
  const {
    onDrop = noop,
    onFileAccepted = noop,
    onFileRejected = noop,
    onDragEnter = noop,
    onDragLeave = noop,
  } = callbacks;

  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);

  const freshOnDrop = useFreshCallback(onDrop as any);
  const freshOnFileAccepted = useFreshCallback(onFileAccepted as any);
  const freshOnFileRejected = useFreshCallback(onFileRejected as any);
  const freshOnDragEnter = useFreshCallback(onDragEnter as any);
  const freshOnDragLeave = useFreshCallback(onDragLeave as any);

  useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);

  const fileIsValid = useCallback(
    (file: File): { valid: boolean; reason?: string } => {
      if (accept && !accept.includes(file.type)) {
        return { valid: false, reason: "File type not allowed" };
      }

      if (maxFileSize && file.size > maxFileSize) {
        return { valid: false, reason: "File size exceeds the limit" };
      }

      return { valid: true };
    },
    [accept, maxFileSize]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer?.files || []);
      const acceptedFiles: File[] = [];
      const rejectedFiles: File[] = [];

      if (maxFiles && files.length > maxFiles) {
        for (const file of files) {
          freshOnFileRejected(file, "Exceeded maximum number of files");
        }
      } else {
        files.forEach((file) => {
          const validationResult = fileIsValid(file);
          if (validationResult.valid) {
            acceptedFiles.push(file);
            freshOnFileAccepted(file);
          } else {
            rejectedFiles.push(file);
            freshOnFileRejected(
              file,
              validationResult.reason || "Unknown reason"
            );
          }
        });
      }

      freshOnDrop(acceptedFiles, rejectedFiles);
    },
    [
      fileIsValid,
      freshOnFileAccepted,
      freshOnFileRejected,
      maxFiles,
      freshOnDrop,
    ]
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (targetNode) {
      targetNode.addEventListener("drop", handleDrop);
      targetNode.addEventListener("dragover", handleDragOver);
      targetNode.addEventListener("dragenter", freshOnDragEnter);
      targetNode.addEventListener("dragleave", freshOnDragLeave);

      return () => {
        targetNode.removeEventListener("drop", handleDrop);
        targetNode.removeEventListener("dragover", handleDragOver);
        targetNode.removeEventListener("dragenter", freshOnDragEnter);
        targetNode.removeEventListener("dragleave", freshOnDragLeave);
      };
    } else {
      return () => { };
    }
  }, [
    targetNode,
    handleDrop,
    handleDragOver,
    freshOnDragEnter,
    freshOnDragLeave,
  ]);

  return useCallback((node: HTMLElement | null) => {
    setTargetNode(node);
  }, []);
}

export { useFileDropRef };
