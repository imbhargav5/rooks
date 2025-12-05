import { vi } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useFileDropRef } from "@/hooks/useFileDropRef";

function createFileWithSize(name: string, type: string, size: number) {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
}

describe("useFileDropRef", () => {
  const options: Parameters<typeof useFileDropRef>[0] = {
    accept: ["image/jpeg", "image/png"],
    maxFileSize: 1000000, // 1 MB
    maxFiles: 3,
  };
  const callbacks: Parameters<typeof useFileDropRef>[1] = {
    onDrop: vi.fn(),
    onFileAccepted: vi.fn(),
    onFileRejected: vi.fn(),
    onDragEnter: vi.fn(),
    onDragLeave: vi.fn(),
  };

  function TestComponent() {
    const dropAreaRef = useFileDropRef(options, callbacks);
    return <div ref={dropAreaRef} data-testid="drop-area" />;
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle drag enter and drag leave events", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const dropArea = document.querySelector("[data-testid=drop-area]");
    expect(dropArea).not.toBeNull();
    if (!dropArea) return;
    const file = createFileWithSize("test-image-1.jpeg", "image/jpeg", 2000000);
    fireEvent.dragEnter(dropArea, {
      dataTransfer: {
        files: [file],
      },
    });
    expect(callbacks.onDragEnter).toHaveBeenCalled();

    fireEvent.dragLeave(dropArea);
    expect(callbacks.onDragLeave).toHaveBeenCalled();
  });

  it("should handle drop event with valid files", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const dropArea = document.querySelector("[data-testid=drop-area]");
    expect(dropArea).not.toBeNull();
    if (!dropArea) return;
    const files: File[] = [
      createFileWithSize("test-image-1.jpeg", "image/jpeg", 500000),
      createFileWithSize("test-image-2.jpeg", "image/jpeg", 500000),
    ];

    fireEvent.drop(dropArea, {
      dataTransfer: {
        files,
      },
    });
    expect(callbacks.onFileRejected).not.toHaveBeenCalled();

    expect(callbacks.onDrop).toHaveBeenCalled();
    expect(callbacks.onFileAccepted).toHaveBeenCalledTimes(files.length);
  });

  it("should handle drop event with rejected files (invalid type and size)", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const dropArea = document.querySelector("[data-testid=drop-area]");
    expect(dropArea).not.toBeNull();
    if (!dropArea) return;
    const files: File[] = [
      createFileWithSize("test-image-1.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-2.jpeg", "image/jpeg", 5000000),
    ];

    fireEvent.drop(dropArea, {
      dataTransfer: {
        files,
      },
    });

    expect(callbacks.onDrop).toHaveBeenCalled();
    expect(callbacks.onFileAccepted).not.toHaveBeenCalled();
    expect(callbacks.onFileRejected).toHaveBeenCalledTimes(files.length);
  });

  it("should handle drop event with rejected files (too many files)", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const dropArea = document.querySelector("[data-testid=drop-area]");
    expect(dropArea).not.toBeNull();
    if (!dropArea) return;
    const files: File[] = [
      createFileWithSize("test-image-1.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-2.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-3.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-4.jpeg", "image/jpeg", 5000000),
    ];

    fireEvent.drop(dropArea, {
      dataTransfer: {
        files,
      },
    });

    expect(callbacks.onDrop).toHaveBeenCalled();
    expect(callbacks.onFileAccepted).toHaveBeenCalledTimes(0);
    expect(callbacks.onFileRejected).toHaveBeenCalledTimes(files.length);
  });

  it("should handle drop event with a mix of valid and rejected files", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const dropArea = document.querySelector("[data-testid=drop-area]");
    expect(dropArea).not.toBeNull();
    if (!dropArea) return;
    const files: File[] = [
      createFileWithSize("test-image-1.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-2.jpeg", "image/jpeg", 5000000),
      createFileWithSize("test-image-3.jpeg", "image/jpeg", 500000),
    ];

    fireEvent.drop(dropArea, {
      dataTransfer: {
        files,
      },
    });

    expect(callbacks.onDrop).toHaveBeenCalled();
    expect(callbacks.onFileAccepted).toHaveBeenCalledTimes(1);
    expect(callbacks.onFileRejected).toHaveBeenCalledTimes(2);
  });
});
