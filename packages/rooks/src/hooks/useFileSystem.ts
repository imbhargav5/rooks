import { useCallback, useState } from "react";

export type FilePickerOptions = {
    multiple?: boolean;
    accept?: string[];
    excludeAcceptAllOption?: boolean;
};

export type FileSaveOptions = {
    suggestedName?: string;
    types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
    }>;
    excludeAcceptAllOption?: boolean;
};

export type DirectoryPickerOptions = {
    id?: string;
    mode?: "read" | "readwrite";
    startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
};

export type FileSystemHandler = {
    openFile: (options?: FilePickerOptions) => Promise<File | null>;
    openFiles: (options?: FilePickerOptions) => Promise<File[]>;
    saveFile: (data: string | BufferSource, options?: FileSaveOptions) => Promise<void>;
    openDirectory: (options?: DirectoryPickerOptions) => Promise<FileSystemDirectoryHandle | null>;
    currentFile: File | null;
    fileContents: string | ArrayBuffer | null;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useFileSystem
 * @description A hook to interact with the File System Access API
 * @returns {FileSystemHandler} Methods and state for file system operations
 * @see {@link https://rooks.vercel.app/docs/useFileSystem}
 *
 * @example
 *
 * const { 
 *   openFile, 
 *   saveFile, 
 *   openDirectory, 
 *   currentFile, 
 *   fileContents, 
 *   error 
 * } = useFileSystem();
 *
 * // Open a file
 * openFile({ accept: [".txt", ".md"] }).then(() => {
 *   console.log(fileContents);
 * });
 *
 * // Save changes
 * saveFile("New content for the file");
 */
function useFileSystem(): FileSystemHandler {
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [fileContents, setFileContents] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const isSupported = typeof window !== "undefined" && "showOpenFilePicker" in window;

    const openFile = useCallback(async (options: FilePickerOptions = {}): Promise<File | null> => {
        if (!isSupported) {
            const error = new Error("File System Access API is not supported in this browser");
            setError(error);
            return Promise.reject(error);
        }

        try {
            // @ts-ignore - TypeScript doesn't recognize these APIs yet in many environments
            const [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                ...options
            });

            const file = await fileHandle.getFile();
            setCurrentFile(file);

            // Read file contents
            const contents = await file.text();
            setFileContents(contents);

            return file;
        } catch (err) {
            // User cancelled is not an error
            if (err instanceof Error && err.name === "AbortError") {
                return null;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported]);

    const openFiles = useCallback(async (options: FilePickerOptions = {}): Promise<File[]> => {
        if (!isSupported) {
            const error = new Error("File System Access API is not supported in this browser");
            setError(error);
            return Promise.reject(error);
        }

        try {
            // @ts-ignore - TypeScript doesn't recognize these APIs yet in many environments
            const fileHandles = await window.showOpenFilePicker({
                multiple: true,
                ...options
            });

            const files = await Promise.all(fileHandles.map((handle: any) => handle.getFile()));

            // Set the first file as current if available
            if (files.length > 0) {
                setCurrentFile(files[0]);
                const contents = await files[0].text();
                setFileContents(contents);
            }

            return files;
        } catch (err) {
            // User cancelled is not an error
            if (err instanceof Error && err.name === "AbortError") {
                return [];
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return [];
        }
    }, [isSupported]);

    const saveFile = useCallback(async (data: string | BufferSource, options: FileSaveOptions = {}): Promise<void> => {
        if (!isSupported) {
            const error = new Error("File System Access API is not supported in this browser");
            setError(error);
            return Promise.reject(error);
        }

        try {
            // @ts-ignore - TypeScript doesn't recognize these APIs yet in many environments
            const fileHandle = await window.showSaveFilePicker(options);

            // Create a FileSystemWritableFileStream to write to
            const writable = await fileHandle.createWritable();

            // Write the contents of the file to the stream
            await writable.write(data);

            // Close the file and write the contents to disk
            await writable.close();
        } catch (err) {
            // User cancelled is not an error
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        }
    }, [isSupported]);

    const openDirectory = useCallback(async (options: DirectoryPickerOptions = {}): Promise<FileSystemDirectoryHandle | null> => {
        if (!isSupported) {
            const error = new Error("File System Access API is not supported in this browser");
            setError(error);
            return Promise.reject(error);
        }

        try {
            // @ts-ignore - TypeScript doesn't recognize these APIs yet in many environments
            const directoryHandle = await window.showDirectoryPicker(options);
            return directoryHandle;
        } catch (err) {
            // User cancelled is not an error
            if (err instanceof Error && err.name === "AbortError") {
                return null;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported]);

    return {
        openFile,
        openFiles,
        saveFile,
        openDirectory,
        currentFile,
        fileContents,
        error,
        isSupported
    };
}

export { useFileSystem }; 